import type { UserProfile } from "../components/ProfileWizard";
import type {
  CriterionResult,
  EligibilityResult,
  Scheme,
} from "../types/scheme";

const normalize = (value: unknown): string =>
  String(value ?? "").trim().toLowerCase();

const isMissing = (value: unknown): boolean =>
  value === null ||
  value === undefined ||
  String(value).trim() === "" ||
  normalize(value) === "not sure";

const parseNumber = (value: unknown): number | null => {
  if (isMissing(value)) return null;

  const raw = String(value).trim();

  // The wizard's "5 or more" option represents a numeric lower bound.
  if (/^5\s*(?:\+|or more)$/i.test(raw)) return 5;

  const parsed = Number(raw.replace(/[₹,\s]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
};

const educationLevels: Record<string, number> = {
  "below 10th": 0,
  "10th pass": 1,
  "12th pass": 2,
  diploma: 2,
  undergraduate: 3,
  graduate: 4,
  postgraduate: 5,
  doctorate: 6,
};

const getWeight = (weight: number): number =>
  Number.isFinite(weight) && weight > 0 ? weight : 0;

const evaluatePmegpEducationThreshold = (
  profile: UserProfile
): CriterionResult["status"] => {
  const projectCost = parseNumber(profile.proposedProjectCost);
  const projectType = normalize(profile.pmegpProjectType);

  if (projectCost === null || !projectType) return "missing";

  const threshold =
    projectType === "manufacturing"
      ? 1_000_000
      : projectType === "service / business"
        ? 500_000
        : null;

  if (threshold === null) return "missing";

  // Class VIII is required only when project cost is above the threshold.
  if (projectCost <= threshold) return "met";

  if (isMissing(profile.pmegpEducationEligible)) return "missing";

  return normalize(profile.pmegpEducationEligible) === "yes"
    ? "met"
    : "not-met";
};

const evaluatePmegpProjectCostLimit = (
  profile: UserProfile
): CriterionResult["status"] => {
  const projectCost = parseNumber(profile.proposedProjectCost);
  const projectType = normalize(profile.pmegpProjectType);

  if (projectCost === null || !projectType) return "missing";

  const maximum =
    projectType === "manufacturing"
      ? 5_000_000
      : projectType === "service / business"
        ? 2_000_000
        : null;

  if (maximum === null) return "missing";

  return projectCost <= maximum ? "met" : "not-met";
};

const evaluatePmDakshIncome = (
  profile: UserProfile
): CriterionResult["status"] => {
  const targetGroup = normalize(profile.dakshTargetGroup);

  if (isMissing(profile.dakshTargetGroup)) return "missing";

  if (targetGroup === "obc" || targetGroup === "ews") {
    const income = parseNumber(profile.annualIncome);
    if (income === null) return "missing";

    // PM-DAKSH specifies income below ₹3 lakh for OBC and EWS.
    return income < 300_000 ? "met" : "not-met";
  }

  if (
    ["sc", "dnt", "safai karamchari", "waste picker"].includes(targetGroup)
  ) {
    return "met";
  }

  return "not-met";
};

const evaluateRule = (
  profile: UserProfile,
  rule: EligibilityRule
): CriterionResult["status"] => {
  if (rule.operator === "pmegpEducationThreshold") {
    return evaluatePmegpEducationThreshold(profile);
  }

  if (rule.operator === "pmegpProjectCostLimit") {
    return evaluatePmegpProjectCostLimit(profile);
  }

  if (rule.operator === "pmDakshIncomeThreshold") {
    return evaluatePmDakshIncome(profile);
  }

  const actual = profile[rule.field];
  if (isMissing(actual)) return "missing";

  switch (rule.operator) {
    case "min": {
      const actualNumber = parseNumber(actual);
      const minimum = parseNumber(rule.value);

      if (actualNumber === null || minimum === null) return "missing";
      return actualNumber >= minimum ? "met" : "not-met";
    }

    case "max": {
      const actualNumber = parseNumber(actual);
      const maximum = parseNumber(rule.value);

      if (actualNumber === null || maximum === null) return "missing";
      return actualNumber <= maximum ? "met" : "not-met";
    }

    case "equals":
      return normalize(actual) === normalize(rule.value) ? "met" : "not-met";

    case "oneOf": {
      if (!Array.isArray(rule.value)) return "missing";
      const allowedValues = rule.value.map(normalize);
      return allowedValues.includes(normalize(actual)) ? "met" : "not-met";
    }

    case "educationAtLeast": {
      const actualLevel = educationLevels[normalize(actual)];
      const requiredLevel = educationLevels[normalize(rule.value)];

      if (actualLevel === undefined || requiredLevel === undefined) {
        return "missing";
      }

      return actualLevel >= requiredLevel ? "met" : "not-met";
    }

    default:
      return "missing";
  }
};

export const evaluateScheme = (
  profile: UserProfile,
  scheme: Scheme
): EligibilityResult => {
  const criteria: CriterionResult[] = scheme.criteria.map((item) => ({
    rule: item,
    status: evaluateRule(profile, item),
  }));

  const mandatoryCriteria = criteria.filter((item) => item.rule.mandatory);
  const failedMandatory = mandatoryCriteria.some(
    (item) => item.status === "not-met"
  );
  const missingMandatory = mandatoryCriteria.some(
    (item) => item.status === "missing"
  );

  const totalWeight = mandatoryCriteria.reduce(
    (sum, item) => sum + getWeight(item.rule.weight),
    0
  );
  const metWeight = mandatoryCriteria.reduce(
    (sum, item) =>
      sum + (item.status === "met" ? getWeight(item.rule.weight) : 0),
    0
  );
  const knownCriteria = mandatoryCriteria.filter(
    (item) => item.status !== "missing"
  ).length;

  const matchScore =
    totalWeight === 0 ? 0 : Math.round((metWeight / totalWeight) * 100);

  const informationCoverage =
    mandatoryCriteria.length === 0
      ? 0
      : Math.round((knownCriteria / mandatoryCriteria.length) * 100);

  let status: EligibilityResult["status"];

  if (failedMandatory) {
    status = "not-eligible";
  } else if (missingMandatory || mandatoryCriteria.length === 0) {
    status = "needs-information";
  } else {
    status = "potentially-eligible";
  }

  return {
    scheme,
    status,
    matchScore,
    informationCoverage,
    criteria,
  };
};

export const recommendSchemes = (
  profile: UserProfile,
  schemes: Scheme[]
): EligibilityResult[] => {
  const statusOrder: Record<EligibilityResult["status"], number> = {
    "potentially-eligible": 0,
    "needs-information": 1,
    "not-eligible": 2,
  };

  return schemes
    .map((scheme) => evaluateScheme(profile, scheme))
    .sort((a, b) => {
      const statusDifference = statusOrder[a.status] - statusOrder[b.status];
      if (statusDifference !== 0) return statusDifference;

      if (b.informationCoverage !== a.informationCoverage) {
        return b.informationCoverage - a.informationCoverage;
      }

      return b.matchScore - a.matchScore;
    });
};
