import { describe, it, expect } from "vitest";

import { schemes } from "../data/schemes";
import {
  evaluateScheme,
  recommendSchemes
} from "./eligibility";

import type { UserProfile } from "../components/ProfileWizard";

// A complete blank profile. Individual tests override relevant fields.
const createProfile = (
  overrides: Partial<UserProfile> = {}
): UserProfile => ({
  age: "",
  gender: "",
  state: "",
  district: "",
  residence: "",
  annualIncome: "",
  education: "",
  category: "",
  occupation: "",
  primaryGoal: "",

  postMatricEnrolled: "",
  class12Above80thPercentile: "",
  courseMode: "",
  receivesOtherScholarship: "",
  isDiplomaCourse: "",
  tookDropAfter12: "",
  topClassInstitution: "",

  ownsCultivableLand: "",
  landRecordedInApplicantName: "",
  pmKisanExclusion: "",

  ownsPuccaHouse: "",
  receivedHousingAssistance: "",

  proposedEnterpriseIsNew: "",
  proposedProjectCost: "",

  agriculturalLandHolding: "",
  pmKmyExclusion: "",

  ...overrides
});

function getScheme(id: string) {
  const scheme = schemes.find(item => item.id === id);

  if (!scheme) {
    throw new Error(`Scheme not found: ${id}`);
  }

  return scheme;
}

describe("Scheme database", () => {
  it("contains all 12 expected schemes", () => {
    expect(schemes).toHaveLength(12);
  });

  it("has unique scheme IDs", () => {
    const ids = schemes.map(scheme => scheme.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has valid criteria for every scheme", () => {
    for (const scheme of schemes) {
      expect(scheme.criteria.length).toBeGreaterThan(0);

      for (const criterion of scheme.criteria) {
        expect(criterion.field).toBeTruthy();
        expect(criterion.operator).toBeTruthy();
        expect(criterion.label).toBeTruthy();
        expect(Number.isFinite(criterion.weight)).toBe(true);
      }
    }
  });
});

describe("Post-Matric SC Scholarship", () => {
  const scheme = getScheme("post-matric-scholarship-sc");

  it("matches an eligible SC student", () => {
    const profile = createProfile({
      occupation: "Student",
      category: "SC",
      annualIncome: "200000",
      postMatricEnrolled: "Yes",
      receivesOtherScholarship: "No"
    });

    const result = evaluateScheme(profile, scheme);

    expect(result.status).toBe("potentially-eligible");
    expect(result.matchScore).toBe(100);
  });

  it("rejects an applicant above the income ceiling", () => {
    const profile = createProfile({
      occupation: "Student",
      category: "SC",
      annualIncome: "300000",
      postMatricEnrolled: "Yes",
      receivesOtherScholarship: "No"
    });

    expect(evaluateScheme(profile, scheme).status)
      .toBe("not-eligible");
  });

  it("requests missing mandatory information", () => {
    const profile = createProfile({
      occupation: "Student",
      category: "SC",
      annualIncome: "200000"
    });

    expect(evaluateScheme(profile, scheme).status)
      .toBe("needs-information");
  });
});

describe("PM-USP CSSS", () => {
  const scheme = getScheme("pm-usp-csss");

  it("matches a student satisfying all screening conditions", () => {
    const profile = createProfile({
      occupation: "Student",
      annualIncome: "400000",
      class12Above80thPercentile: "Yes",
      courseMode: "Regular",
      receivesOtherScholarship: "No",
      isDiplomaCourse: "No",
      tookDropAfter12: "No"
    });

    expect(evaluateScheme(profile, scheme).status)
      .toBe("potentially-eligible");
  });

  it("rejects a student who does not meet the percentile condition", () => {
    const profile = createProfile({
      occupation: "Student",
      annualIncome: "400000",
      class12Above80thPercentile: "No",
      courseMode: "Regular",
      receivesOtherScholarship: "No",
      isDiplomaCourse: "No",
      tookDropAfter12: "No"
    });

    expect(evaluateScheme(profile, scheme).status)
      .toBe("not-eligible");
  });
});

describe("ST Higher Education Scholarship", () => {
  const scheme = getScheme("top-class-scholarship-st");

  it("matches an eligible ST student at a notified institution", () => {
    const profile = createProfile({
      occupation: "Student",
      category: "ST",
      annualIncome: "500000",
      topClassInstitution: "Yes"
    });

    expect(evaluateScheme(profile, scheme).status)
      .toBe("potentially-eligible");
  });
});

describe("PM-KISAN", () => {
  const scheme = getScheme("pm-kisan-samman-nidhi");

  it("matches a farmer satisfying the recorded-land and exclusion checks", () => {
    const profile = createProfile({
      occupation: "Farmer",
      ownsCultivableLand: "Yes",
      landRecordedInApplicantName: "Yes",
      pmKisanExclusion: "No"
    });

    expect(evaluateScheme(profile, scheme).status)
      .toBe("potentially-eligible");
  });

  it("rejects a farmer who fails the exclusion check", () => {
    const profile = createProfile({
      occupation: "Farmer",
      ownsCultivableLand: "Yes",
      landRecordedInApplicantName: "Yes",
      pmKisanExclusion: "Yes"
    });

    expect(evaluateScheme(profile, scheme).status)
      .toBe("not-eligible");
  });
});

describe("PM-YASASVI", () => {
  const scheme = getScheme("pm-yasasvi-post-matric");

  it("accepts normalized education labels", () => {
    const profile = createProfile({
      occupation: "Student",
      category: "OBC",
      annualIncome: "200000",
      education: "Undergraduate"
    });

    expect(evaluateScheme(profile, scheme).status)
      .toBe("potentially-eligible");
  });
});

describe("AICTE Pragati", () => {
  const scheme = getScheme("aicte-pragati");

  it("accepts an eligible girl student in a regular course", () => {
    const profile = createProfile({
      occupation: "Student",
      gender: "Female",
      annualIncome: "500000",
      courseMode: "Regular",
      receivesOtherScholarship: "No",
      isDiplomaCourse: "Yes"
    });

    expect(evaluateScheme(profile, scheme).status)
      .toBe("potentially-eligible");
  });

  it("rejects an applicant who fails the gender condition", () => {
    const profile = createProfile({
      occupation: "Student",
      gender: "Male",
      annualIncome: "500000",
      courseMode: "Regular",
      receivesOtherScholarship: "No",
      isDiplomaCourse: "No"
    });

    expect(evaluateScheme(profile, scheme).status)
      .toBe("not-eligible");
  });
});

describe("Housing schemes", () => {
  it("matches an urban household without a pucca house", () => {
    const profile = createProfile({
      residence: "Urban",
      annualIncome: "500000",
      ownsPuccaHouse: "No",
      receivedHousingAssistance: "No"
    });

    const result = evaluateScheme(
      profile,
      getScheme("pmay-urban-2")
    );

    expect(result.status).toBe("potentially-eligible");
    expect(result.matchScore).toBe(100);
  });

  it("does not penalize a missing optional primary goal", () => {
    const profile = createProfile({
      residence: "Urban",
      annualIncome: "500000",
      ownsPuccaHouse: "No",
      receivedHousingAssistance: "No",
      primaryGoal: ""
    });

    const result = evaluateScheme(
      profile,
      getScheme("pmay-urban-2")
    );

    expect(result.status).toBe("potentially-eligible");
    expect(result.matchScore).toBe(100);
  });

  it("matches a rural household against PMAY-G screening rules", () => {
    const profile = createProfile({
      residence: "Rural",
      ownsPuccaHouse: "No",
      receivedHousingAssistance: "No"
    });

    expect(
      evaluateScheme(profile, getScheme("pmay-gramin")).status
    ).toBe("potentially-eligible");
  });
});

describe("PM-Vidyalaxmi", () => {
  it("does not require an optional primary goal", () => {
    const profile = createProfile({
      occupation: "Student",
      education: "Undergraduate",
      primaryGoal: ""
    });

    const result = evaluateScheme(
      profile,
      getScheme("pm-vidyalaxmi")
    );

    expect(result.status).toBe("potentially-eligible");
    expect(result.matchScore).toBe(100);
  });
});

describe("PMEGP", () => {
  const scheme = getScheme("pmegp");

  it("matches an adult proposing a new enterprise", () => {
    const profile = createProfile({
      age: "25",
      proposedEnterpriseIsNew: "Yes",
      proposedProjectCost: "500000"
    });

    expect(evaluateScheme(profile, scheme).status)
      .toBe("potentially-eligible");
  });

  it("rejects an applicant below 18", () => {
    const profile = createProfile({
      age: "17",
      proposedEnterpriseIsNew: "Yes",
      proposedProjectCost: "500000"
    });

    expect(evaluateScheme(profile, scheme).status)
      .toBe("not-eligible");
  });
});

describe("PM-KMY", () => {
  const scheme = getScheme("pm-kisan-maan-dhan");

  it("matches a farmer within the age and landholding limits", () => {
    const profile = createProfile({
      occupation: "Farmer",
      age: "30",
      ownsCultivableLand: "Yes",
      landRecordedInApplicantName: "Yes",
      agriculturalLandHolding: "1.5",
      pmKmyExclusion: "No"
    });

    expect(evaluateScheme(profile, scheme).status)
      .toBe("potentially-eligible");
  });

  it("rejects a farmer above the entry age limit", () => {
    const profile = createProfile({
      occupation: "Farmer",
      age: "41",
      ownsCultivableLand: "Yes",
      landRecordedInApplicantName: "Yes",
      agriculturalLandHolding: "1",
      pmKmyExclusion: "No"
    });

    expect(evaluateScheme(profile, scheme).status)
      .toBe("not-eligible");
  });
});

describe("PM-DAKSH", () => {
  const scheme = getScheme("pm-daksh");

  it("matches an applicant in the supported target groups", () => {
    const profile = createProfile({
      age: "25",
      category: "OBC"
    });

    expect(evaluateScheme(profile, scheme).status)
      .toBe("potentially-eligible");
  });
});

describe("Eligibility engine safeguards", () => {
  it("handles comma-separated Indian income values", () => {
    const profile = createProfile({
      occupation: "Student",
      category: "SC",
      annualIncome: "2,00,000",
      postMatricEnrolled: "Yes",
      receivesOtherScholarship: "No"
    });

    expect(
      evaluateScheme(
        profile,
        getScheme("post-matric-scholarship-sc")
      ).status
    ).toBe("potentially-eligible");
  });

  it("does not treat an invalid numeric value as eligible", () => {
    const profile = createProfile({
      occupation: "Student",
      category: "SC",
      annualIncome: "not a number",
      postMatricEnrolled: "Yes",
      receivesOtherScholarship: "No"
    });

    expect(
      evaluateScheme(
        profile,
        getScheme("post-matric-scholarship-sc")
      ).status
    ).toBe("needs-information");
  });

  it("does not count optional criteria in match score", () => {
    const profile = createProfile({
      residence: "Urban",
      annualIncome: "500000",
      ownsPuccaHouse: "No",
      receivedHousingAssistance: "No",
      primaryGoal: "Education & Scholarships"
    });

    const result = evaluateScheme(
      profile,
      getScheme("pmay-urban-2")
    );

    expect(result.matchScore).toBe(100);
    expect(result.informationCoverage).toBe(100);
    expect(result.status).toBe("potentially-eligible");
  });

  it("sorts potentially eligible schemes before incomplete matches", () => {
    const profile = createProfile({
      occupation: "Student",
      category: "SC",
      annualIncome: "200000",
      postMatricEnrolled: "Yes",
      receivesOtherScholarship: "No"
    });

    const results = recommendSchemes(profile, schemes);

    const firstIncomplete = results.findIndex(
      result => result.status === "needs-information"
    );

    const lastEligible = results.reduce(
      (last, result, index) =>
        result.status === "potentially-eligible" ? index : last,
      -1
    );

    if (firstIncomplete !== -1 && lastEligible !== -1) {
      expect(lastEligible).toBeLessThan(firstIncomplete);
    }
  });
});
