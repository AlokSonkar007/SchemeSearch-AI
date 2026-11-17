import type { Scheme, EligibilityRule } from "../types/scheme";

const rule = (
  field: EligibilityRule["field"],
  operator: EligibilityRule["operator"],
  value: EligibilityRule["value"],
  weight: number,
  label: string,
  mandatory = true
): EligibilityRule => ({
  field,
  operator,
  value,
  mandatory,
  weight,
  label,
});

const prototype = (
  id: string,
  name: string,
  category: string,
  description: string,
  benefit: string,
  criteria: EligibilityRule[],
  sourceUrl: string
): Scheme => ({
  id,
  name,
  category,
  description,
  benefit,
  criteria,
  dataStatus: "prototype",
  sourceUrl,
  lastVerifiedAt: null,
});

export const schemes: Scheme[] = [
  prototype(
    "post-matric-scholarship-sc",
    "Post-Matric Scholarship for SC Students (PMS-SC)",
    "Education",
    "Scholarship support for eligible Scheduled Caste students pursuing post-matriculation or post-secondary education. Domicile, recognised-course and institutional requirements also apply.",
    "Eligible compulsory non-refundable fees and academic allowance, subject to the applicable scheme and State/UT rules.",
    [
      rule("occupation", "equals", "Student", 15, "Applicant is pursuing education"),
      rule("category", "equals", "SC", 25, "Applicant belongs to the Scheduled Caste community recognised by their State/UT"),
      rule("annualIncome", "max", 250000, 25, "Annual parental/guardian income does not exceed ₹2.5 lakh"),
      rule("postMatricEnrolled", "equals", "Yes", 20, "Applicant is enrolled in an eligible post-matric course"),
      rule("receivesOtherScholarship", "equals", "No", 15, "No conflicting scholarship or fee reimbursement is being received"),
    ],
    "https://socialjustice.gov.in/schemes/25"
  ),

  prototype(
    "pm-usp-csss",
    "PM-USP Central Sector Scheme of Scholarship (CSSS)",
    "Education",
    "Merit-cum-means scholarship for eligible college and university students. Fresh applicants must satisfy the Class XII percentile, regular-course, income and other prescribed conditions.",
    "Annual scholarship assistance towards educational and day-to-day expenses. Amount depends on course and year of study.",
    [
      rule("occupation", "equals", "Student", 10, "Applicant is pursuing higher education"),
      rule("annualIncome", "max", 450000, 20, "Gross family income does not exceed ₹4.5 lakh per annum"),
      rule("class12Above80thPercentile", "equals", "Yes", 25, "Fresh applicant was above the 80th percentile in the relevant Class XII board stream"),
      rule("courseMode", "equals", "Regular", 15, "Applicant is pursuing a regular course"),
      rule("receivesOtherScholarship", "equals", "No", 10, "Applicant is not receiving another scholarship or fee reimbursement"),
      rule("isDiplomaCourse", "equals", "No", 10, "Applicant is not enrolled in a diploma course"),
      rule("tookDropAfter12", "equals", "No", 10, "Applicant did not take a gap year after Class XII before starting the current course"),
    ],
    "https://www.education.gov.in/sites/upload_files/mhrd/files/upload_document/PM_USP_CSSS_guidelines_updated.pdf"
  ),

  prototype(
    "top-class-scholarship-st",
    "National Scholarship for Higher Education of ST Students",
    "Education",
    "Central scholarship support for Scheduled Tribe students pursuing prescribed higher-education courses in institutions identified by the Ministry of Tribal Affairs.",
    "Eligible tuition and admission fees, non-refundable fees, stipend and allowances, subject to scheme provisions.",
    [
      rule("occupation", "equals", "Student", 10, "Applicant is pursuing higher education"),
      rule("category", "equals", "ST", 25, "Applicant belongs to the Scheduled Tribe community"),
      rule("annualIncome", "max", 600000, 25, "Annual family income does not exceed ₹6 lakh"),
      rule("topClassInstitution", "equals", "Yes", 40, "Applicant is admitted to an institution on the Ministry's notified Top Class list"),
    ],
    "https://tribal.nic.in/Scholarship.aspx"
  ),

  prototype(
    "pm-kisan-samman-nidhi",
    "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    "Agriculture",
    "Income support for eligible landholding farmer families. Land records, family eligibility and exclusion conditions must be verified by State/UT authorities.",
    "₹6,000 per year, transferred directly to eligible beneficiary bank accounts in three equal instalments.",
    [
      rule("occupation", "equals", "Farmer", 15, "Applicant belongs to an eligible farmer family"),
      rule("ownsCultivableLand", "equals", "Yes", 25, "Farmer family holds cultivable agricultural land"),
      rule("landRecordedInApplicantName", "equals", "Yes", 25, "Land ownership is supported by applicable State/UT land records"),
      rule("pmKisanExclusion", "equals", "No", 35, "Farmer family does not fall under the PM-KISAN exclusion categories"),
    ],
    "https://pmkisan.gov.in/"
  ),

  prototype(
    "pm-yasasvi-post-matric",
    "PM-YASASVI Post-Matric Scholarship",
    "Education",
    "Post-matric scholarship support for eligible students from OBC, EBC and DNT communities. Detailed selection and course rules are administered under applicable guidelines.",
    "Scholarship assistance towards eligible educational expenses according to the applicable course group and guidelines.",
    [
      rule("occupation", "equals", "Student", 10, "Applicant is pursuing post-matric education"),
      rule("category", "oneOf", ["OBC", "EBC", "DNT"], 25, "Applicant belongs to an eligible OBC, EBC or DNT category"),
      rule("annualIncome", "max", 250000, 30, "Annual family income does not exceed ₹2.5 lakh"),
      rule(
        "education",
        "oneOf",
        ["10th Pass", "12th Pass", "Diploma", "Undergraduate", "Graduate", "Postgraduate", "Doctorate"],
        20,
        "Applicant has reached the post-matriculation education stage"
      ),
    ],
    "https://socialjustice.gov.in/schemes/101"
  ),

  prototype(
    "aicte-pragati",
    "AICTE Pragati Scholarship for Girl Students",
    "Education",
    "Scholarship support for eligible girl students pursuing technical degree or diploma programmes at AICTE-approved institutions. The notified family and admission conditions also apply.",
    "Tuition fee assistance up to the prescribed limit and incidentals allowance, subject to current guidelines.",
    [
      rule("occupation", "equals", "Student", 10, "Applicant is pursuing technical education"),
      rule("gender", "equals", "Female", 20, "Applicant is a girl student"),
      rule("annualIncome", "max", 800000, 15, "Annual family income does not exceed ₹8 lakh"),
      rule("aicteApprovedInstitution", "equals", "Yes", 20, "Institution is AICTE-approved"),
      rule("girlsInFamily", "max", 2, 15, "Applicant is within the two-girl-child family condition"),
      rule("courseMode", "equals", "Regular", 10, "Applicant meets the prescribed regular-course conditions"),
      rule("isDiplomaCourse", "oneOf", ["Yes", "No"], 10, "Applicant is enrolled in an eligible technical degree or diploma programme"),
    ],
    "https://aicte-qa.aicte-india.org/sites/default/files/pragatisaksham.pdf"
  ),

  prototype(
    "pmay-urban-2",
    "Pradhan Mantri Awas Yojana - Urban 2.0",
    "Housing",
    "Housing assistance for eligible urban households under the EWS, LIG and MIG categories. Household income, pucca-house ownership and previous housing assistance conditions apply.",
    "Assistance through applicable housing components. The Interest Subsidy Scheme provides a maximum subsidy of up to ₹1.80 lakh, subject to its separate conditions.",
    [
      rule("residence", "equals", "Urban", 20, "Applicant belongs to an eligible urban household"),
      rule("annualIncome", "max", 900000, 20, "Annual household income is within the ₹9 lakh overall screening ceiling"),
      rule("ownsPuccaHouse", "equals", "No", 30, "Beneficiary family does not own a pucca house anywhere in India"),
      rule("receivedHousingAssistance", "equals", "No", 30, "Household has not received disqualifying government housing assistance in the last 20 years"),
      rule("primaryGoal", "equals", "Housing & Basic Needs", 5, "Applicant is seeking housing-related assistance", false),
    ],
    "https://pmaymis.gov.in/PMAYMIS2_2024/PmayFAQ.aspx"
  ),

  prototype(
    "pmay-gramin",
    "Pradhan Mantri Awaas Yojana - Gramin (PMAY-G)",
    "Housing",
    "Rural housing programme for eligible rural households identified through the applicable deprivation, exclusion and beneficiary-selection process.",
    "Financial assistance for construction of an eligible pucca house, subject to current government guidelines.",
    [
      rule("residence", "equals", "Rural", 25, "Applicant belongs to a rural household"),
      rule("ownsPuccaHouse", "equals", "No", 35, "Household satisfies the applicable housing deprivation conditions"),
      rule("receivedHousingAssistance", "equals", "No", 25, "Household does not have disqualifying previous housing assistance"),
      rule("primaryGoal", "equals", "Housing & Basic Needs", 5, "Applicant is seeking housing assistance", false),
    ],
    "https://pmayg.nic.in/"
  ),

  prototype(
    "pm-vidyalaxmi",
    "PM-Vidyalaxmi Education Loan Scheme",
    "Education",
    "Education-loan support for students admitted to eligible Quality Higher Educational Institutions (QHEIs). Interest subvention has separate income and other conditions.",
    "Collateral-free and guarantor-free education loans. Eligible students with annual family income up to ₹8 lakh may receive 3% interest subvention on education loans up to ₹10 lakh, subject to scheme conditions.",
    [
      rule("occupation", "equals", "Student", 20, "Applicant is pursuing higher education"),
      rule(
        "education",
        "oneOf",
        ["12th Pass", "Diploma", "Undergraduate", "Graduate", "Postgraduate"],
        20,
        "Applicant meets the qualifying higher-education stage"
      ),
      rule("qheiAdmission", "equals", "Yes", 60, "Applicant is admitted to an eligible Quality Higher Educational Institution"),
      rule("primaryGoal", "equals", "Education & Scholarships", 5, "Applicant is seeking education support", false),
    ],
    "https://www.education.gov.in/sites/upload_files/mhrd/files/upload_document/Citizen_Charter_HE_2025.pdf"
  ),

  prototype(
    "pmegp",
    "Prime Minister's Employment Generation Programme (PMEGP)",
    "Business & Entrepreneurship",
    "Credit-linked subsidy programme supporting eligible individuals setting up new viable micro-enterprises in non-farm sectors. Certain project sizes require at least Class VIII education.",
    "Margin-money subsidy based on applicant category and project location, subject to bank appraisal and scheme rules.",
    [
      rule("age", "min", 18, 15, "Individual applicant is at least 18 years old"),
      rule("proposedEnterpriseIsNew", "equals", "Yes", 20, "Proposed enterprise qualifies as a new unit"),
      rule("proposedProjectCost", "min", 1, 15, "Proposed project cost is greater than zero"),
      rule("pmegpProjectType", "oneOf", ["Manufacturing", "Service / Business"], 10, "Project type is specified"),
      rule("pmegpPreviousSubsidy", "equals", "No", 15, "Applicant/unit has not received a disqualifying previous government subsidy"),
      rule("pmegpCapitalExpenditure", "equals", "Yes", 10, "Project includes capital expenditure"),
      rule("proposedProjectCost", "pmegpEducationThreshold", 0, 10, "Meets the Class VIII qualification condition when the project-cost threshold applies"),
      rule("proposedProjectCost", "pmegpProjectCostLimit", 0, 5, "Project cost is within the PMEGP ceiling for the selected project type"),
    ],
    "https://www.kviconline.gov.in/pmegpeportal/dashboard/notification/Revised_PMEGP_Scheme_Guidelines_07122023_compressed.pdf"
  ),

  prototype(
    "pm-kisan-maan-dhan",
    "Pradhan Mantri Kisan Maan-Dhan Yojana (PM-KMY)",
    "Agriculture",
    "Voluntary contributory pension scheme for eligible small and marginal landholding farmers. Entry age is 18 to 40 years and exclusion conditions also apply.",
    "Assured monthly pension of ₹3,000 after attaining 60 years, subject to regular contributions and scheme conditions.",
    [
      rule("occupation", "equals", "Farmer", 10, "Applicant is an eligible farmer"),
      rule("age", "min", 18, 15, "Applicant is at least 18 years old at entry"),
      rule("age", "max", 40, 15, "Applicant is not older than 40 years at entry"),
      rule("ownsCultivableLand", "equals", "Yes", 15, "Applicant holds eligible cultivable agricultural land"),
      rule("landRecordedInApplicantName", "equals", "Yes", 15, "Landholding is recorded in the applicant's name"),
      rule("agriculturalLandHolding", "max", 2, 20, "Landholding does not exceed 2 hectares"),
      rule("pmKmyExclusion", "equals", "No", 10, "No known PM-KMY exclusion condition applies"),
    ],
    "https://maandhan.in/"
  ),

  prototype(
    "pm-daksh",
    "Pradhan Mantri DAKSH Yojana",
    "Skill Development",
    "Skill development and training support for specified groups, including SC, OBC, EWS, DNT communities and Safai Karamcharis (including waste pickers).",
    "Skill training and related support under the applicable programme and current guidelines.",
    [
      rule("age", "min", 18, 20, "Applicant is at least 18 years old"),
      rule("age", "max", 45, 20, "Applicant is not older than 45 years"),
      rule(
        "dakshTargetGroup",
        "oneOf",
        ["SC", "OBC", "EWS", "DNT", "Safai Karamchari", "Waste Picker"],
        35,
        "Applicant belongs to a PM-DAKSH target group"
      ),
      rule("dakshTargetGroup", "pmDakshIncomeThreshold", 0, 25, "Meets the income condition applicable to the selected target group"),
      rule("primaryGoal", "equals", "Employment & Skill Development", 5, "Applicant is seeking skill development or employment support", false),
    ],
    "https://socialjustice.gov.in/schemes/100"
  ),
];
