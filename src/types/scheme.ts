import type { UserProfile } from "../components/ProfileWizard";

export type RuleOperator =
  | "min"
  | "max"
  | "equals"
  | "oneOf"
  | "educationAtLeast";

export type EligibilityRule = {
  field: keyof UserProfile;
  operator: RuleOperator;
  value: string | number | string[];
  mandatory: boolean;
  weight: number;
  label: string;
};

export type Scheme = {
  id: string;
  name: string;
  category: string;
  description: string;
  benefit: string;
  criteria: EligibilityRule[];
  dataStatus: "prototype" | "verified";
  sourceUrl: string | null;
  lastVerifiedAt?: string | null;
};

export type CriterionResult = {
  rule: EligibilityRule;
  status: "met" | "not-met" | "missing";
};

export type EligibilityResult = {
  scheme: Scheme;
  status: "potentially-eligible" | "needs-information" | "not-eligible";
  matchScore: number;
  informationCoverage: number;
  criteria: CriterionResult[];
};
