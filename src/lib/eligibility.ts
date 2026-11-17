
import type { UserProfile } from "../components/ProfileWizard";
import type {
  Scheme,
  EligibilityRule,
  CriterionResult,
  EligibilityResult
} from "../types/scheme";

const educationLevels: Record<string, number> = {
  "Below 10th": 0,
  "10th pass": 1,
  "12th pass": 2,
  "Diploma": 3,
  "Undergraduate": 4,
  "Postgraduate": 5,
  "Doctorate": 6,
  "Other": -1
};

function evaluateRule(
  profile: UserProfile,
  rule: EligibilityRule
): CriterionResult["status"] {
  const actual = profile[rule.field]?.trim();

  if (!actual) return "missing";

  const expected = rule.value;

  switch (rule.operator) {
    case "min":
    case "max": {
      const actualNumber = Number(actual);
      const expectedNumber = Number(expected);

      if (
        !Number.isFinite(actualNumber) ||
        !Number.isFinite(expectedNumber)
      ) {
        return "missing";
      }

      return rule.operator === "min"
        ? actualNumber >= expectedNumber ? "met" : "not-met"
        : actualNumber <= expectedNumber ? "met" : "not-met";
    }

    case "equals":
      return actual.toLowerCase() === String(expected).trim().toLowerCase()
        ? "met"
        : "not-met";

    case "oneOf": {
      const options = Array.isArray(expected) ? expected : [expected];

      return options.some(
        option =>
          String(option).trim().toLowerCase() === actual.toLowerCase()
      )
        ? "met"
        : "not-met";
    }

    case "educationAtLeast": {
      const actualLevel = educationLevels[actual];
      const requiredLevel = educationLevels[String(expected)];

      if (actualLevel === undefined || requiredLevel === undefined) {
        return "missing";
      }

      return actualLevel >= requiredLevel ? "met" : "not-met";
    }

    default:
      return "missing";
  }
}

export function evaluateScheme(
  profile: UserProfile,
  scheme: Scheme
): EligibilityResult {
  const criteria: CriterionResult[] = scheme.criteria.map(rule => ({
    rule,
    status: evaluateRule(profile, rule)
  }));

  const failedMandatory = criteria.some(
    item => item.rule.mandatory && item.status === "not-met"
  );

  const missingMandatory = criteria.some(
    item => item.rule.mandatory && item.status === "missing"
  );

  let status: EligibilityResult["status"];

  if (failedMandatory) {
    status = "not-eligible";
  } else if (missingMandatory) {
    status = "needs-information";
  } else {
    status = "potentially-eligible";
  }

  // Missing criteria count as zero matches instead of being excluded.
  const totalWeight = criteria.reduce(
    (sum, item) => sum + Math.max(0, item.rule.weight),
    0
  );

  const matchedWeight = criteria.reduce(
    (sum, item) =>
      sum + (
        item.status === "met"
          ? Math.max(0, item.rule.weight)
          : 0
      ),
    0
  );

  const matchScore = totalWeight > 0
    ? Math.round((matchedWeight / totalWeight) * 100)
    : 0;

  const evaluatedCount = criteria.filter(
    item => item.status !== "missing"
  ).length;

  const informationCoverage = criteria.length > 0
    ? Math.round((evaluatedCount / criteria.length) * 100)
    : 0;

  return {
    scheme,
    status,
    matchScore,
    informationCoverage,
    criteria
  };
}

export function recommendSchemes(
  profile: UserProfile,
  schemes: Scheme[]
): EligibilityResult[] {
  const priority = {
    "potentially-eligible": 0,
    "needs-information": 1,
    "not-eligible": 2
  };

  return schemes
    .map(scheme => evaluateScheme(profile, scheme))
    .sort((a, b) => {
      const statusDifference = priority[a.status] - priority[b.status];

      if (statusDifference !== 0) return statusDifference;

      return b.matchScore - a.matchScore;
    });
}
