import { describe, expect, it } from "vitest";

import { schemes } from "../data/schemes";
import type { UserProfile } from "../components/ProfileWizard";
import { evaluateScheme, recommendSchemes } from "./eligibility";

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
  aicteApprovedInstitution: "",
  girlsInFamily: "",
  qheiAdmission: "",

  ownsCultivableLand: "",
  landRecordedInApplicantName: "",
  pmKisanExclusion: "",

  ownsPuccaHouse: "",
  receivedHousingAssistance: "",

  proposedEnterpriseIsNew: "",
  proposedProjectCost: "",
  pmegpProjectType: "",
  pmegpEducationEligible: "",
  pmegpPreviousSubsidy: "",
  pmegpCapitalExpenditure: "",

  agriculturalLandHolding: "",
  pmKmyExclusion: "",

  dakshTargetGroup: "",

  ...overrides,
});

const getScheme = (id: string) => {
  const scheme = schemes.find((item) => item.id === id);
  if (!scheme) throw new Error("Scheme not found: " + id);
  return scheme;
};

describe("Scheme database", () => {
  it("contains at least 50 schemes with unique IDs", () => {
    expect(schemes.length).toBeGreaterThanOrEqual(50);
    expect(new Set(schemes.map((scheme) => scheme.id)).size).toBe(schemes.length);
  });

  it("has valid, weighted criteria for every scheme", () => {
    for (const scheme of schemes) {
      expect(scheme.criteria.length).toBeGreaterThan(0);
      expect(scheme.dataStatus).toBe("prototype");

      for (const criterion of scheme.criteria) {
        expect(criterion.field).toBeTruthy();
        expect(criterion.operator).toBeTruthy();
        expect(criterion.label).toBeTruthy();
        expect(Number.isFinite(criterion.weight)).toBe(true);
        expect(criterion.weight).toBeGreaterThan(0);
      }
    }
  });
});

describe("Post-Matric Scholarship for SC Students", () => {
  const scheme = getScheme("post-matric-scholarship-sc");

  it("matches an SC student within the income limit", () => {
    const profile = createProfile({
      occupation: "Student",
      category: "SC",
      annualIncome: "200000",
      postMatricEnrolled: "Yes",
      receivesOtherScholarship: "No",
    });

    expect(evaluateScheme(profile, scheme).status).toBe("potentially-eligible");
    expect(evaluateScheme(profile, scheme).matchScore).toBe(100);
  });

  it("rejects income above ₹2.5 lakh", () => {
    const profile = createProfile({
      occupation: "Student",
      category: "SC",
      annualIncome: "250001",
      postMatricEnrolled: "Yes",
      receivesOtherScholarship: "No",
    });

    expect(evaluateScheme(profile, scheme).status).toBe("not-eligible");
  });

  it("requests missing mandatory information", () => {
    const profile = createProfile({
      occupation: "Student",
      category: "SC",
      annualIncome: "200000",
    });

    expect(evaluateScheme(profile, scheme).status).toBe("needs-information");
  });
});

describe("PM-USP Central Sector Scholarship", () => {
  const scheme = getScheme("pm-usp-csss");

  const eligibleProfile = createProfile({
    occupation: "Student",
    annualIncome: "400000",
    class12Above80thPercentile: "Yes",
    courseMode: "Regular",
    receivesOtherScholarship: "No",
    isDiplomaCourse: "No",
    tookDropAfter12: "No",
  });

  it("matches a student satisfying its screening conditions", () => {
    expect(evaluateScheme(eligibleProfile, scheme).status).toBe(
      "potentially-eligible"
    );
  });

  it("rejects a student who does not meet the percentile condition", () => {
    expect(
      evaluateScheme(
        { ...eligibleProfile, class12Above80thPercentile: "No" },
        scheme
      ).status
    ).toBe("not-eligible");
  });
});

describe("ST Higher Education Scholarship", () => {
  it("matches an ST student at a notified institution", () => {
    const profile = createProfile({
      occupation: "Student",
      category: "ST",
      annualIncome: "500000",
      topClassInstitution: "Yes",
    });

    expect(
      evaluateScheme(profile, getScheme("top-class-scholarship-st")).status
    ).toBe("potentially-eligible");
  });
});

describe("PM-KISAN", () => {
  const scheme = getScheme("pm-kisan-samman-nidhi");

  const farmerProfile = createProfile({
    occupation: "Farmer",
    ownsCultivableLand: "Yes",
    landRecordedInApplicantName: "Yes",
    pmKisanExclusion: "No",
  });

  it("matches a landholding farmer who passes the exclusion screen", () => {
    expect(evaluateScheme(farmerProfile, scheme).status).toBe(
      "potentially-eligible"
    );
  });

  it("rejects a farmer who reports an exclusion condition", () => {
    expect(
      evaluateScheme({ ...farmerProfile, pmKisanExclusion: "Yes" }, scheme)
        .status
    ).toBe("not-eligible");
  });
});

describe("PM-YASASVI", () => {
  const scheme = getScheme("pm-yasasvi-post-matric");

  it.each(["OBC", "EBC", "DNT"])(
    "recognises the %s target group",
    (category: string) => {
      const profile = createProfile({
        occupation: "Student",
        category,
        annualIncome: "200000",
        education: "Undergraduate",
      });

      expect(evaluateScheme(profile, scheme).status).toBe(
        "potentially-eligible"
      );
    }
  );

  it("rejects income above the ₹2.5 lakh screening limit", () => {
    const profile = createProfile({
      occupation: "Student",
      category: "EBC",
      annualIncome: "260000",
      education: "Undergraduate",
    });

    expect(evaluateScheme(profile, scheme).status).toBe("not-eligible");
  });
});

describe("AICTE Pragati", () => {
  const scheme = getScheme("aicte-pragati");

  const eligibleGirl = createProfile({
    occupation: "Student",
    gender: "Female",
    annualIncome: "500000",
    aicteApprovedInstitution: "Yes",
    girlsInFamily: "2",
    courseMode: "Regular",
    isDiplomaCourse: "Yes",
  });

  it("matches an eligible girl student within the family condition", () => {
    expect(evaluateScheme(eligibleGirl, scheme).status).toBe(
      "potentially-eligible"
    );
  });

  it("rejects an applicant where more than two girls are in the family", () => {
    expect(
      evaluateScheme({ ...eligibleGirl, girlsInFamily: "3" }, scheme).status
    ).toBe("not-eligible");
  });

  it("handles the wizard's '5 or more' option as a numeric value", () => {
    expect(
      evaluateScheme({ ...eligibleGirl, girlsInFamily: "5 or more" }, scheme)
        .status
    ).toBe("not-eligible");
  });

  it("rejects an applicant who fails the gender condition", () => {
    expect(
      evaluateScheme({ ...eligibleGirl, gender: "Male" }, scheme).status
    ).toBe("not-eligible");
  });
});

describe("Housing schemes", () => {
  it("matches an urban household that passes the PMAY-U 2.0 screen", () => {
    const profile = createProfile({
      residence: "Urban",
      annualIncome: "500000",
      ownsPuccaHouse: "No",
      receivedHousingAssistance: "No",
    });

    const result = evaluateScheme(profile, getScheme("pmay-urban-2"));
    expect(result.status).toBe("potentially-eligible");
    expect(result.matchScore).toBe(100);
  });

  it("rejects a PMAY-U 2.0 household above the overall income ceiling", () => {
    const profile = createProfile({
      residence: "Urban",
      annualIncome: "950000",
      ownsPuccaHouse: "No",
      receivedHousingAssistance: "No",
    });

    expect(evaluateScheme(profile, getScheme("pmay-urban-2")).status).toBe(
      "not-eligible"
    );
  });

  it("does not penalise a missing optional primary goal", () => {
    const profile = createProfile({
      residence: "Urban",
      annualIncome: "500000",
      ownsPuccaHouse: "No",
      receivedHousingAssistance: "No",
      primaryGoal: "",
    });

    const result = evaluateScheme(profile, getScheme("pmay-urban-2"));
    expect(result.status).toBe("potentially-eligible");
    expect(result.matchScore).toBe(100);
  });

  it("matches a rural household against PMAY-G preliminary rules", () => {
    const profile = createProfile({
      residence: "Rural",
      ownsPuccaHouse: "No",
      receivedHousingAssistance: "No",
    });

    expect(evaluateScheme(profile, getScheme("pmay-gramin")).status).toBe(
      "potentially-eligible"
    );
  });
});

describe("PM-Vidyalaxmi", () => {
  const scheme = getScheme("pm-vidyalaxmi");

  it("requires admission to a listed QHEI", () => {
    const profile = createProfile({
      occupation: "Student",
      education: "Undergraduate",
      qheiAdmission: "Yes",
    });

    expect(evaluateScheme(profile, scheme).status).toBe("potentially-eligible");
  });

  it("requests more information when QHEI admission is unknown", () => {
    const profile = createProfile({
      occupation: "Student",
      education: "Undergraduate",
      qheiAdmission: "Not sure",
    });

    expect(evaluateScheme(profile, scheme).status).toBe("needs-information");
  });

  it("does not use the interest-subvention income ceiling to reject the general loan screen", () => {
    const profile = createProfile({
      occupation: "Student",
      education: "Undergraduate",
      annualIncome: "1200000",
      qheiAdmission: "Yes",
    });

    expect(evaluateScheme(profile, scheme).status).toBe("potentially-eligible");
  });
});

describe("PMEGP", () => {
  const scheme = getScheme("pmegp");

  const eligibleServiceProject = createProfile({
    age: "25",
    proposedEnterpriseIsNew: "Yes",
    proposedProjectCost: "600000",
    pmegpProjectType: "Service / Business",
    pmegpEducationEligible: "Yes",
    pmegpPreviousSubsidy: "No",
    pmegpCapitalExpenditure: "Yes",
  });

  it("matches an adult proposing a new service enterprise with Class VIII education", () => {
    expect(evaluateScheme(eligibleServiceProject, scheme).status).toBe(
      "potentially-eligible"
    );
  });

  it("does not require Class VIII when a service project is exactly ₹5 lakh", () => {
    const profile = {
      ...eligibleServiceProject,
      proposedProjectCost: "500000",
      pmegpEducationEligible: "",
    };

    expect(evaluateScheme(profile, scheme).status).toBe("potentially-eligible");
  });

  it("requires Class VIII above the service project threshold", () => {
    const profile = {
      ...eligibleServiceProject,
      pmegpEducationEligible: "No",
    };

    expect(evaluateScheme(profile, scheme).status).toBe("not-eligible");
  });

  it("requests information if Class VIII status is unknown above the threshold", () => {
    const profile = {
      ...eligibleServiceProject,
      pmegpEducationEligible: "Not sure",
    };

    expect(evaluateScheme(profile, scheme).status).toBe("needs-information");
  });

  it("accepts a manufacturing project within the ₹50 lakh ceiling", () => {
    const profile = createProfile({
      age: "30",
      proposedEnterpriseIsNew: "Yes",
      proposedProjectCost: "1500000",
      pmegpProjectType: "Manufacturing",
      pmegpEducationEligible: "Yes",
      pmegpPreviousSubsidy: "No",
      pmegpCapitalExpenditure: "Yes",
    });

    expect(evaluateScheme(profile, scheme).status).toBe("potentially-eligible");
  });

  it("rejects a service project above the ₹20 lakh ceiling", () => {
    const profile = {
      ...eligibleServiceProject,
      proposedProjectCost: "2000001",
    };

    expect(evaluateScheme(profile, scheme).status).toBe("not-eligible");
  });

  it("rejects a project that does not include capital expenditure", () => {
    const profile = {
      ...eligibleServiceProject,
      pmegpCapitalExpenditure: "No",
    };

    expect(evaluateScheme(profile, scheme).status).toBe("not-eligible");
  });

  it("rejects an applicant younger than 18", () => {
    expect(
      evaluateScheme({ ...eligibleServiceProject, age: "17" }, scheme).status
    ).toBe("not-eligible");
  });
});

describe("PM-KMY", () => {
  const scheme = getScheme("pm-kisan-maan-dhan");

  const eligibleFarmer = createProfile({
    occupation: "Farmer",
    age: "30",
    ownsCultivableLand: "Yes",
    landRecordedInApplicantName: "Yes",
    agriculturalLandHolding: "1.5",
    pmKmyExclusion: "No",
  });

  it("matches a farmer within the entry-age and landholding limits", () => {
    expect(evaluateScheme(eligibleFarmer, scheme).status).toBe(
      "potentially-eligible"
    );
  });

  it("rejects a farmer above the entry age limit", () => {
    expect(
      evaluateScheme({ ...eligibleFarmer, age: "41" }, scheme).status
    ).toBe("not-eligible");
  });

  it("rejects a farmer above the two-hectare landholding limit", () => {
    expect(
      evaluateScheme(
        { ...eligibleFarmer, agriculturalLandHolding: "2.1" },
        scheme
      ).status
    ).toBe("not-eligible");
  });
});

describe("PM-DAKSH", () => {
  const scheme = getScheme("pm-daksh");

  it("matches an OBC applicant below the ₹3 lakh family-income limit", () => {
    const profile = createProfile({
      age: "25",
      dakshTargetGroup: "OBC",
      annualIncome: "299999",
    });

    expect(evaluateScheme(profile, scheme).status).toBe("potentially-eligible");
  });

  it("rejects an OBC applicant at ₹3 lakh", () => {
    const profile = createProfile({
      age: "25",
      dakshTargetGroup: "OBC",
      annualIncome: "300000",
    });

    expect(evaluateScheme(profile, scheme).status).toBe("not-eligible");
  });

  it("applies the income ceiling to EWS applicants", () => {
    const profile = createProfile({
      age: "25",
      dakshTargetGroup: "EWS",
      annualIncome: "350000",
    });

    expect(evaluateScheme(profile, scheme).status).toBe("not-eligible");
  });

  it("does not apply the OBC/EWS income ceiling to SC applicants", () => {
    const profile = createProfile({
      age: "25",
      dakshTargetGroup: "SC",
      annualIncome: "1500000",
    });

    expect(evaluateScheme(profile, scheme).status).toBe("potentially-eligible");
  });

  it("recognises DNT and Safai Karamchari target groups", () => {
    for (const dakshTargetGroup of ["DNT", "Safai Karamchari", "Waste Picker"]) {
      const profile = createProfile({
        age: "25",
        dakshTargetGroup,
        annualIncome: "1500000",
      });

      expect(evaluateScheme(profile, scheme).status).toBe(
        "potentially-eligible"
      );
    }
  });

  it("requests income information for OBC/EWS applicants when it is missing", () => {
    const profile = createProfile({
      age: "25",
      dakshTargetGroup: "OBC",
    });

    expect(evaluateScheme(profile, scheme).status).toBe("needs-information");
  });
});

describe("Eligibility engine safeguards", () => {
  it("handles comma-separated Indian income values", () => {
    const profile = createProfile({
      occupation: "Student",
      category: "SC",
      annualIncome: "2,00,000",
      postMatricEnrolled: "Yes",
      receivesOtherScholarship: "No",
    });

    expect(
      evaluateScheme(profile, getScheme("post-matric-scholarship-sc")).status
    ).toBe("potentially-eligible");
  });

  it("does not treat an invalid numeric value as eligible", () => {
    const profile = createProfile({
      occupation: "Student",
      category: "SC",
      annualIncome: "not a number",
      postMatricEnrolled: "Yes",
      receivesOtherScholarship: "No",
    });

    expect(
      evaluateScheme(profile, getScheme("post-matric-scholarship-sc")).status
    ).toBe("needs-information");
  });

  it("does not treat 'Not sure' as a failed answer", () => {
    const profile = createProfile({
      occupation: "Student",
      category: "SC",
      annualIncome: "200000",
      postMatricEnrolled: "Not sure",
      receivesOtherScholarship: "No",
    });

    expect(
      evaluateScheme(profile, getScheme("post-matric-scholarship-sc")).status
    ).toBe("needs-information");
  });

  it("does not count optional criteria in match score", () => {
    const profile = createProfile({
      residence: "Urban",
      annualIncome: "500000",
      ownsPuccaHouse: "No",
      receivedHousingAssistance: "No",
      primaryGoal: "Education & Scholarships",
    });

    const result = evaluateScheme(profile, getScheme("pmay-urban-2"));

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
      receivesOtherScholarship: "No",
    });

    const results = recommendSchemes(profile, schemes);
    const firstIncomplete = results.findIndex(
      (result) => result.status === "needs-information"
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
