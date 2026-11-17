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

export const schemes: Scheme[] = [
  // 1. POST-MATRIC SCHOLARSHIP FOR SC STUDENTS
  {
    id: "post-matric-scholarship-sc",
    name: "Post-Matric Scholarship for SC Students (PMS-SC)",
    category: "Education",
    description:
      "Scholarship for eligible Scheduled Caste students pursuing post-matriculation or post-secondary studies. Domicile, recognised-course and institutional requirements also apply.",
    benefit:
      "Eligible compulsory non-refundable fees, academic allowance and applicable disability allowance, subject to scheme rules.",
    dataStatus: "prototype",
    sourceUrl: "https://socialjustice.gov.in/schemes/25",
    lastVerifiedAt: null,
    criteria: [
      rule("occupation", "equals", "Student", 20, "Applicant must be a student."),
      rule("category", "equals", "SC", 25, "Applicant must belong to the Scheduled Caste community recognised by their State/UT."),
      rule("annualIncome", "max", 250000, 25, "Annual parental/guardian income must not exceed ₹2,50,000."),
      rule("postMatricEnrolled", "equals", "Yes", 20, "Applicant must be enrolled in an eligible post-matric course."),
      rule("receivesOtherScholarship", "equals", "No", 10, "Other scholarship or fee reimbursement may affect eligibility under scheme rules."),
    ],
  },

  // 2. PM-USP CENTRAL SECTOR SCHOLARSHIP
  {
    id: "pm-usp-csss",
    name: "PM-USP Central Sector Scheme of Scholarship (CSSS)",
    category: "Education",
    description:
      "Merit-cum-means scholarship for college and university students. Fresh applicants must satisfy the Class XII percentile, regular-course, income and other prescribed conditions.",
    benefit:
      "Annual scholarship assistance towards educational and day-to-day expenses. Amount depends on course and year of study.",
    dataStatus: "prototype",
    sourceUrl:
      "https://www.education.gov.in/sites/upload_files/mhrd/files/upload_document/PM_USP_CSSS_guidelines_updated.pdf",
    lastVerifiedAt: null,
    criteria: [
      rule("occupation", "equals", "Student", 15, "Applicant must be pursuing higher education."),
      rule("annualIncome", "max", 450000, 20, "Gross parental/family income must not exceed ₹4,50,000 per annum."),
      rule("class12Above80thPercentile", "equals", "Yes", 25, "Fresh applicants must be above the 80th percentile in their relevant Class XII board stream."),
      rule("courseMode", "equals", "Regular", 15, "Applicant must pursue a regular course."),
      rule("receivesOtherScholarship", "equals", "No", 10, "Applicant must satisfy the scheme's restrictions on other scholarships and fee reimbursements."),
      rule("isDiplomaCourse", "equals", "No", 10, "The scheme is intended for eligible regular degree courses, not diploma courses."),
      rule("tookDropAfter12", "equals", "No", 5, "A gap after Class XII may affect eligibility under the cited guidelines."),
    ],
  },

  // 3. TOP CLASS SCHOLARSHIP FOR ST STUDENTS
  {
    id: "top-class-scholarship-st",
    name: "National Scholarship for Higher Education of ST Students",
    category: "Education",
    description:
      "Central scholarship for Scheduled Tribe students pursuing prescribed higher-education courses in institutions identified by the Ministry of Tribal Affairs.",
    benefit:
      "Eligible tuition and admission fees, non-refundable fees, stipend and allowances, subject to scheme provisions.",
    dataStatus: "prototype",
    sourceUrl: "https://tribal.nic.in/Scholarship.aspx",
    lastVerifiedAt: null,
    criteria: [
      rule("occupation", "equals", "Student", 20, "Applicant must be pursuing higher education."),
      rule("category", "equals", "ST", 25, "Applicant must belong to the Scheduled Tribe community."),
      rule("annualIncome", "max", 600000, 25, "Annual family income must satisfy the applicable scheme ceiling."),
      rule("topClassInstitution", "equals", "Yes", 30, "Applicant must be admitted to an institution on the Ministry's notified Top Class list."),
    ],
  },

  // 4. PM-KISAN
  {
    id: "pm-kisan-samman-nidhi",
    name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    category: "Agriculture",
    description:
      "Central Sector Scheme providing income support to eligible landholding farmer families. Land records, family eligibility and exclusion conditions must be verified by State/UT authorities.",
    benefit:
      "Income support of ₹6,000 per year, transferred directly to eligible beneficiary bank accounts in three equal instalments.",
    dataStatus: "prototype",
    sourceUrl: "https://www.pmkisan.gov.in/",
    lastVerifiedAt: null,
    criteria: [
      rule("occupation", "equals", "Farmer", 15, "Applicant must belong to an eligible farmer family."),
      rule("ownsCultivableLand", "equals", "Yes", 25, "Eligible farmer family must hold cultivable agricultural land."),
      rule("landRecordedInApplicantName", "equals", "Yes", 30, "Land ownership must be supported by applicable State/UT land records."),
      rule("pmKisanExclusion", "equals", "No", 30, "Applicant's farmer family must not fall under the scheme's exclusion categories."),
    ],
  },

  // 5. PM-YASASVI POST-MATRIC SCHOLARSHIP
  {
    id: "pm-yasasvi-post-matric",
    name: "PM-YASASVI Post-Matric Scholarship for OBC Students",
    category: "Education",
    description:
      "Scholarship component for eligible OBC students studying at the post-matriculation or post-secondary stage. This profile screens the OBC component only.",
    benefit:
      "Financial assistance towards eligible educational expenses, including academic allowances and applicable compulsory fees.",
    dataStatus: "prototype",
    sourceUrl: "https://socialjustice.gov.in/schemes/101",
    lastVerifiedAt: null,
    criteria: [
      rule("occupation", "equals", "Student", 20, "Applicant must be pursuing post-matric education."),
      rule("category", "equals", "OBC", 30, "This screening covers the OBC component of PM-YASASVI."),
      rule("annualIncome", "max", 250000, 30, "Family income must satisfy the applicable post-matric scholarship ceiling."),
      rule(
        "education",
        "oneOf",
        ["10th Pass", "12th Pass", "Diploma", "Undergraduate", "Graduate", "Postgraduate", "Doctorate"],
        20,
        "Applicant must have reached the post-matriculation education stage."
      ),
    ],
  },

  // 6. AICTE PRAGATI SCHOLARSHIP
  {
    id: "aicte-pragati",
    name: "AICTE Pragati Scholarship for Girl Students",
    category: "Education",
    description:
      "Scholarship supporting girls pursuing eligible technical education in AICTE-approved institutions. Admission-year, course and institutional conditions require verification.",
    benefit:
      "Tuition fee assistance up to the prescribed limit and incidentals allowance, subject to current guidelines.",
    dataStatus: "prototype",
    sourceUrl:
      "https://aicte-qa.aicte-india.org/sites/default/files/pragatisaksham.pdf",
    lastVerifiedAt: null,
    criteria: [
      rule("occupation", "equals", "Student", 15, "Applicant must be pursuing technical education."),
      rule("gender", "equals", "Female", 25, "Applicant must be a girl student."),
      rule("annualIncome", "max", 800000, 25, "Annual family income must not exceed ₹8,00,000."),
      rule("courseMode", "equals", "Regular", 15, "Applicant must meet the prescribed regular-course conditions."),
      rule("receivesOtherScholarship", "equals", "No", 10, "Other scholarship support may affect eligibility under applicable rules."),
      rule("isDiplomaCourse", "oneOf", ["Yes", "No"], 10, "Applicant must be enrolled in an eligible degree or diploma course."),
    ],
  },

  // 7. PMAY URBAN 2.0
  {
    id: "pmay-urban-2",
    name: "Pradhan Mantri Awas Yojana - Urban 2.0",
    category: "Housing",
    description:
      "Housing assistance for eligible urban households under EWS, LIG and MIG categories. Household income, pucca-house ownership and previous housing assistance conditions apply.",
    benefit:
      "Assistance through applicable housing components. The Interest Subsidy Scheme provides a maximum subsidy of up to ₹1.80 lakh, subject to eligibility and guidelines.",
    dataStatus: "prototype",
    sourceUrl: "https://pmaymis.gov.in/PMAYMIS2_2024/index.html",
    lastVerifiedAt: null,
    criteria: [
      rule("residence", "equals", "Urban", 20, "Applicant must belong to an eligible urban household."),
      rule("annualIncome", "max", 900000, 25, "Household income must fall within the applicable EWS, LIG or MIG ceiling."),
      rule("ownsPuccaHouse", "equals", "No", 25, "Beneficiary family must satisfy the scheme's pucca-house ownership restriction."),
      rule("receivedHousingAssistance", "equals", "No", 20, "Previous government housing assistance must satisfy the scheme's restrictions."),
      rule("primaryGoal", "equals", "Housing & Basic Needs", 10, "Applicant is seeking housing-related assistance.", false),
    ],
  },

  // 8. PMAY GRAMIN
  {
    id: "pmay-gramin",
    name: "Pradhan Mantri Awaas Yojana - Gramin (PMAY-G)",
    category: "Housing",
    description:
      "Rural housing programme intended to provide pucca houses with basic amenities to eligible rural households. Selection depends on official deprivation, exclusion and beneficiary-list criteria.",
    benefit:
      "Financial assistance for construction of an eligible pucca house, with amounts and convergence benefits determined by applicable government guidelines.",
    dataStatus: "prototype",
    sourceUrl: "https://pmayg.nic.in/",
    lastVerifiedAt: null,
    criteria: [
      rule("residence", "equals", "Rural", 20, "Applicant must belong to an eligible rural household."),
      rule("ownsPuccaHouse", "equals", "No", 25, "Household must satisfy the applicable housing deprivation conditions."),
      rule("receivedHousingAssistance", "equals", "No", 20, "Previous housing assistance must satisfy applicable exclusion conditions."),
      rule("primaryGoal", "equals", "Housing & Basic Needs", 10, "Applicant is seeking housing assistance.", false),
    ],
  },

  // 9. PM VIDYALAXMI
  {
    id: "pm-vidyalaxmi",
    name: "PM-Vidyalaxmi Education Loan Scheme",
    category: "Education",
    description:
      "Financial support for meritorious students admitted to eligible Quality Higher Educational Institutions. The scheme facilitates collateral-free and guarantor-free education loans. Interest subvention has separate income and other conditions.",
    benefit:
      "Collateral-free and guarantor-free education loans. Eligible students with annual family income up to ₹8 lakh may receive 3% interest subvention on education loans up to ₹10 lakh, subject to scheme conditions.",
    dataStatus: "prototype",
    sourceUrl:
      "https://www.education.gov.in/sites/upload_files/mhrd/files/upload_document/Citizen_Charter_HE_2025.pdf",
    lastVerifiedAt: null,
    criteria: [
      rule("occupation", "equals", "Student", 30, "Applicant must be pursuing higher education."),
      rule(
        "education",
        "oneOf",
        ["12th Pass", "Diploma", "Undergraduate", "Graduate", "Postgraduate"],
        30,
        "Applicant must meet the qualifying education and admission requirements."
      ),
      rule("primaryGoal", "equals", "Education & Scholarships", 20, "Applicant is seeking financial support for higher education.", false),
    ],
  },

  // 10. PMEGP
  {
    id: "pmegp",
    name: "Prime Minister's Employment Generation Programme (PMEGP)",
    category: "Business & Entrepreneurship",
    description:
      "Credit-linked subsidy programme supporting the establishment of new viable micro-enterprises. Applicant age, project cost, educational qualifications for certain project sizes and bank appraisal conditions apply.",
    benefit:
      "Margin-money subsidy linked to approved project cost, applicant category and location, combined with bank finance.",
    dataStatus: "prototype",
    sourceUrl:
      "https://www.kviconline.gov.in/pmegpeportal/pmegpeportaltutorialdoc/PMEGP%20guidelines_pmegpeportal.pdf",
    lastVerifiedAt: null,
    criteria: [
      rule("age", "min", 18, 25, "Individual applicant must be at least 18 years old."),
      rule("proposedEnterpriseIsNew", "equals", "Yes", 30, "The proposed enterprise must qualify as a new unit."),
      rule("proposedProjectCost", "min", 1, 20, "A positive proposed project cost is required."),
      rule("primaryGoal", "equals", "Business & Entrepreneurship", 15, "Applicant is seeking support to establish an enterprise.", false),
    ],
  },

  // 11. PM KISAN MAAN-DHAN YOJANA
  {
    id: "pm-kisan-maan-dhan",
    name: "Pradhan Mantri Kisan Maan-Dhan Yojana (PM-KMY)",
    category: "Agriculture",
    description:
      "Voluntary and contributory pension scheme for eligible small and marginal landholding farmers. Entry age is 18 to 40 years. Landholding and exclusion conditions also apply.",
    benefit:
      "Assured monthly pension of ₹3,000 after attaining 60 years of age, subject to regular contributions and scheme conditions.",
    dataStatus: "prototype",
    sourceUrl: "https://pmkisan.gov.in/Documents/PMKMYFAQs.pdf",
    lastVerifiedAt: null,
    criteria: [
      rule("occupation", "equals", "Farmer", 10, "Applicant must be an eligible farmer."),
      rule("age", "min", 18, 15, "Applicant must be at least 18 years old at entry."),
      rule("age", "max", 40, 15, "Applicant must not be older than 40 years at entry."),
      rule("ownsCultivableLand", "equals", "Yes", 15, "Applicant must hold eligible cultivable agricultural land."),
      rule("landRecordedInApplicantName", "equals", "Yes", 15, "Landholding must be supported by applicable State/UT land records."),
      rule("agriculturalLandHolding", "max", 2, 20, "Applicant must meet the small and marginal farmer landholding limit of up to 2 hectares."),
      rule("pmKmyExclusion", "equals", "No", 10, "Applicant must not fall under the applicable PM-KMY exclusion conditions."),
    ],
  },

  // 12. PM-DAKSH
  {
    id: "pm-daksh",
    name: "Pradhan Mantri DAKSH Yojana",
    category: "Skill Development",
    description:
      "Skill development and training programme offering upskilling, reskilling, short-term training and entrepreneurship development opportunities to eligible target groups. This preliminary screening covers SC, OBC and EWS categories.",
    benefit:
      "Eligible skill development training, with programme-specific assistance and support as prescribed by the scheme.",
    dataStatus: "prototype",
    sourceUrl: "https://www.myscheme.gov.in/schemes/pm-daksh",
    lastVerifiedAt: null,
    criteria: [
      rule("age", "min", 18, 20, "Applicant must be at least 18 years old."),
      rule("age", "max", 45, 20, "Applicant must be no older than 45 years."),
      rule("category", "oneOf", ["SC", "OBC", "EWS"], 30, "This screening covers the SC, OBC and EWS target groups."),
      rule("primaryGoal", "equals", "Employment & Skill Development", 30, "Applicant is seeking skill development or employment support.", false),
    ],
  },
];
