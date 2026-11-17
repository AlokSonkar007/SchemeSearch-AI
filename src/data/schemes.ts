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

  // Additional national programmes. These remain prototype records until their
  // live guidelines, state rules and application windows are individually verified.
  prototype("ayushman-bharat-pmjay", "Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (AB PM-JAY)", "Healthcare", "Hospitalisation health-cover programme for eligible families identified through the applicable beneficiary databases and expanded state coverage.", "Health cover of up to ₹5 lakh per eligible family per year for specified secondary and tertiary hospitalisation, subject to package and state rules.", [rule("primaryGoal", "equals", "Healthcare", 10, "Applicant is seeking healthcare support", false)], "https://beneficiary.nha.gov.in/"),
  prototype("pm-surya-ghar", "PM Surya Ghar: Muft Bijli Yojana", "Energy", "Rooftop solar support for eligible residential electricity consumers. DISCOM feasibility, roof suitability and vendor requirements apply.", "Central financial assistance for eligible residential rooftop solar installations; amount depends on system capacity and applicable rules.", [rule("residence", "equals", "Urban", 5, "Urban residence selected", false), rule("primaryGoal", "oneOf", ["Financial Assistance", "Other Benefits"], 5, "Applicant is exploring household energy support", false)], "https://pmsuryaghar.gov.in/"),
  prototype("pm-ujjwala", "Pradhan Mantri Ujjwala Yojana (PMUY)", "Social Welfare", "LPG connection assistance for adult women from eligible poor households that do not already have an LPG connection, subject to prescribed deprivation categories.", "Deposit-free LPG connection support and applicable first-refill or stove assistance under current provisions.", [rule("gender", "equals", "Female", 25, "Applicant is a woman", true)], "https://www.pmuy.gov.in/"),
  prototype("pm-svanidhi", "PM Street Vendor's AtmaNirbhar Nidhi (PM SVANidhi)", "Business & Entrepreneurship", "Working-capital support for eligible street vendors identified under the scheme and urban local body process.", "Collateral-free working-capital loan tranches with applicable incentives for timely repayment and digital transactions.", [rule("occupation", "oneOf", ["Self Employed", "Business Owner", "Daily Wage Worker"], 15, "Occupation may be compatible with street vending", false), rule("primaryGoal", "equals", "Business & Entrepreneurship", 10, "Applicant is seeking business support", false)], "https://pmsvanidhi.mohua.gov.in/"),
  prototype("mudra-yojana", "Pradhan Mantri MUDRA Yojana (PMMY)", "Business & Entrepreneurship", "Institutional credit for eligible non-corporate, non-farm micro and small enterprises engaged in income-generating activities.", "Business loans through participating lenders under Shishu, Kishor, Tarun and applicable Tarun Plus categories; lender appraisal applies.", [rule("age", "min", 18, 10, "Applicant is an adult", false), rule("primaryGoal", "equals", "Business & Entrepreneurship", 20, "Applicant is seeking enterprise finance", false)], "https://www.mudra.org.in/"),
  prototype("stand-up-india", "Stand-Up India Scheme", "Business & Entrepreneurship", "Bank loans for eligible greenfield enterprises promoted by women and SC/ST entrepreneurs, subject to ownership and control requirements.", "Composite bank loan generally from ₹10 lakh to ₹1 crore for eligible greenfield projects, subject to lender appraisal.", [rule("gender", "equals", "Female", 20, "Women entrepreneurs are a target group", false), rule("category", "oneOf", ["SC", "ST"], 20, "SC/ST entrepreneurs are target groups", false), rule("primaryGoal", "equals", "Business & Entrepreneurship", 15, "Applicant is seeking enterprise finance", false)], "https://www.standupmitra.in/"),
  prototype("pm-vishwakarma", "PM Vishwakarma", "Skill Development", "Integrated support for artisans and craftspeople working with their hands and tools in notified traditional trades.", "Recognition, skill training, toolkit incentive, and collateral-free credit support under scheme conditions.", [rule("age", "min", 18, 10, "Applicant is an adult", false), rule("primaryGoal", "oneOf", ["Employment & Skill Development", "Business & Entrepreneurship"], 10, "Applicant is seeking artisan livelihood support", false)], "https://pmvishwakarma.gov.in/"),
  prototype("pm-jandhan", "Pradhan Mantri Jan-Dhan Yojana (PMJDY)", "Financial Inclusion", "National financial-inclusion programme enabling access to basic bank accounts and related financial services.", "Basic savings bank deposit account and eligible linked benefits subject to account, bank and scheme conditions.", [rule("age", "min", 10, 5, "Basic account access can include minors through guardian arrangements", false)], "https://pmjdy.gov.in/"),
  prototype("pmjjby", "Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)", "Insurance", "Renewable life-insurance scheme available through participating banks and post offices to eligible account holders.", "Life cover of ₹2 lakh for death due to any cause during the cover period, subject to premium and enrolment rules.", [rule("age", "min", 18, 20, "Applicant meets the minimum entry age"), rule("age", "max", 50, 20, "Applicant is within the standard entry-age limit")], "https://jansuraksha.gov.in/"),
  prototype("pmsby", "Pradhan Mantri Suraksha Bima Yojana (PMSBY)", "Insurance", "Low-cost renewable personal accident insurance for eligible bank or post-office account holders.", "Accident insurance cover for death and specified disability, subject to policy terms and premium.", [rule("age", "min", 18, 20, "Applicant meets the minimum entry age"), rule("age", "max", 70, 20, "Applicant is within the standard enrolment age")], "https://jansuraksha.gov.in/"),
  prototype("atal-pension-yojana", "Atal Pension Yojana (APY)", "Pension", "Contributory pension scheme primarily aimed at workers in the unorganised sector; tax-payer restrictions apply under current rules.", "Guaranteed monthly pension options after age 60 based on contribution and chosen pension slab.", [rule("age", "min", 18, 20, "Applicant meets the minimum joining age"), rule("age", "max", 40, 20, "Applicant is within the joining-age range")], "https://www.npscra.nsdl.co.in/scheme-details.php"),
  prototype("pm-shram-yogi-maandhan", "Pradhan Mantri Shram Yogi Maandhan (PM-SYM)", "Pension", "Voluntary contributory pension for eligible unorganised workers meeting income and exclusion conditions.", "Assured monthly pension of ₹3,000 after age 60, with matching government contribution under scheme rules.", [rule("age", "min", 18, 15, "Applicant meets the minimum entry age"), rule("age", "max", 40, 15, "Applicant is within the entry-age limit"), rule("occupation", "oneOf", ["Self Employed", "Daily Wage Worker", "Unemployed", "Homemaker"], 10, "Occupation may fit an unorganised-worker profile", false), rule("annualIncome", "max", 180000, 10, "Annual income is a rough proxy for the worker income ceiling; verify the official definition", false)], "https://maandhan.in/"),
  prototype("e-shram", "e-Shram National Database for Unorganised Workers", "Employment & Skill Development", "Registration platform for eligible unorganised workers to create a national worker record and access linked social-security services.", "e-Shram identity and access to relevant linked schemes; registration itself is not a cash benefit.", [rule("age", "min", 16, 15, "Applicant meets the registration minimum age"), rule("age", "max", 59, 15, "Applicant is below the usual upper registration age")], "https://eshram.gov.in/"),
  prototype("mgnrega", "Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)", "Employment & Skill Development", "Rural household employment guarantee for adult members willing to do unskilled manual work, subject to job-card and local demand processes.", "Up to 100 days of guaranteed wage employment per rural household in a financial year, subject to Act and implementation rules.", [rule("residence", "equals", "Rural", 35, "Applicant belongs to a rural household"), rule("age", "min", 18, 25, "Applicant is an adult household member"), rule("primaryGoal", "equals", "Employment & Skill Development", 5, "Applicant is seeking wage employment", false)], "https://nrega.nic.in/"),
  prototype("day-nrlm", "Deendayal Antyodaya Yojana - National Rural Livelihoods Mission (DAY-NRLM)", "Employment & Skill Development", "Rural poverty-reduction mission supporting eligible rural poor households, especially women, through self-help groups and livelihoods.", "SHG mobilisation, capacity building, financial inclusion and livelihood support through state rural livelihood missions.", [rule("residence", "equals", "Rural", 25, "Applicant belongs to a rural household"), rule("gender", "equals", "Female", 10, "Women are a priority for SHG mobilisation", false)], "https://aajeevika.gov.in/"),
  prototype("day-nulm", "Deendayal Antyodaya Yojana - National Urban Livelihoods Mission (DAY-NULM)", "Employment & Skill Development", "Urban livelihoods mission supporting eligible urban poor households through skills, self-employment and street-vendor components.", "Skill training, self-employment and group-enterprise support through urban local bodies, subject to component rules.", [rule("residence", "equals", "Urban", 25, "Applicant belongs to an urban household"), rule("primaryGoal", "equals", "Employment & Skill Development", 10, "Applicant is seeking livelihood support", false)], "https://nulm.gov.in/"),
  prototype("pmkvy", "Pradhan Mantri Kaushal Vikas Yojana (PMKVY)", "Skill Development", "Skill training and certification programme for eligible candidates in approved job roles and training batches.", "Industry-relevant skill training, assessment and certification through authorised centres and current programme components.", [rule("age", "min", 15, 10, "Applicant meets the minimum age for many training tracks", false), rule("primaryGoal", "equals", "Employment & Skill Development", 15, "Applicant is seeking skills or employment support", false)], "https://www.skillindiadigital.gov.in/"),
  prototype("national-apprenticeship-promotion", "National Apprenticeship Promotion Scheme (NAPS)", "Skill Development", "Apprenticeship promotion programme supporting on-the-job training through establishments and registered apprenticeship contracts.", "Apprenticeship opportunities and prescribed stipend support arrangements, subject to employer, trade and contract rules.", [rule("age", "min", 14, 10, "Minimum age varies by trade and hazardous-work restrictions", false), rule("primaryGoal", "equals", "Employment & Skill Development", 10, "Applicant is seeking work-based training", false)], "https://www.apprenticeshipindia.gov.in/"),
  prototype("nmms", "National Means-cum-Merit Scholarship Scheme (NMMS)", "Education", "Merit-cum-means scholarship for selected students from economically weaker sections studying in eligible government, government-aided and local body schools.", "Annual scholarship support for selected students continuing in eligible classes, subject to examination and income criteria.", [rule("occupation", "equals", "Student", 20, "Applicant is a student"), rule("annualIncome", "max", 350000, 20, "Family income is within the scheme ceiling", false)], "https://scholarships.gov.in/"),
  prototype("pm-matru-vandana", "Pradhan Mantri Matru Vandana Yojana (PMMVY)", "Women Empowerment", "Maternity benefit programme for eligible pregnant and lactating women, subject to exclusion categories and prescribed registration conditions.", "Cash maternity benefit for eligible first child and specified second-child girl-child cases under current rules.", [rule("gender", "equals", "Female", 20, "Applicant is a woman", true), rule("age", "min", 19, 5, "Applicant meets the programme's minimum age condition", false), rule("primaryGoal", "equals", "Healthcare", 5, "Applicant is exploring maternity support", false)], "https://pmmvy.wcd.gov.in/"),
  prototype("janani-suraksha-yojana", "Janani Suraksha Yojana (JSY)", "Healthcare", "Safe-motherhood conditional cash assistance programme encouraging institutional delivery among eligible pregnant women, with state-specific eligibility.", "Cash assistance linked to institutional delivery and ASHA support, according to state category and guidelines.", [rule("gender", "equals", "Female", 20, "Applicant is a woman", true), rule("primaryGoal", "equals", "Healthcare", 5, "Applicant is exploring maternal-health support", false)], "https://nhm.gov.in/"),
  prototype("sukanya-samriddhi", "Sukanya Samriddhi Account Scheme", "Women Empowerment", "Small-savings scheme for a girl child, opened by a parent or legal guardian within the prescribed age window.", "Government-backed long-term savings account with notified interest and tax treatment, subject to rules.", [rule("age", "max", 10, 25, "Girl child is within the account-opening age window"), rule("gender", "equals", "Female", 20, "Account is for a girl child")], "https://www.nsiindia.gov.in/"),
  prototype("ignoaps", "Indira Gandhi National Old Age Pension Scheme (IGNOAPS)", "Social Welfare", "Pension assistance for eligible older persons from BPL households under the National Social Assistance Programme and state top-ups.", "Monthly pension assistance; central and state amounts vary by age and state policy.", [rule("age", "min", 60, 30, "Applicant meets the minimum old-age pension age"), rule("annualIncome", "max", 100000, 5, "Income is only a rough screen; official BPL identification governs")], "https://nsap.nic.in/"),
  prototype("ignwps", "Indira Gandhi National Widow Pension Scheme (IGNWPS)", "Social Welfare", "Pension support for eligible widowed women from BPL households within the prescribed age range.", "Monthly pension assistance with possible state supplements, subject to current NSAP and state rules.", [rule("gender", "equals", "Female", 20, "Applicant is a woman"), rule("age", "min", 40, 15, "Applicant meets the central scheme age threshold", false), rule("age", "max", 79, 15, "Applicant is within the central scheme age band", false)], "https://nsap.nic.in/"),
  prototype("igndps", "Indira Gandhi National Disability Pension Scheme (IGNDPS)", "Social Welfare", "Pension support for eligible persons with severe or multiple disabilities from BPL households, subject to certification and state implementation.", "Monthly pension assistance with possible state supplements, subject to disability certification and NSAP rules.", [rule("annualIncome", "max", 100000, 5, "Income is only a rough screen; BPL identification and disability certification govern", false), rule("primaryGoal", "equals", "Social Welfare", 5, "Applicant is exploring social-security support", false)], "https://nsap.nic.in/"),
  prototype("pmfby", "Pradhan Mantri Fasal Bima Yojana (PMFBY)", "Agriculture", "Crop-insurance scheme for notified crops and areas, with enrolment and loan-linked or voluntary farmer processes as applicable.", "Insurance protection against specified crop losses and risks under notified seasonal guidelines.", [rule("occupation", "equals", "Farmer", 20, "Applicant is a farmer"), rule("primaryGoal", "equals", "Agriculture & Farming", 10, "Applicant is seeking agricultural support", false)], "https://pmfby.gov.in/"),
  prototype("kisan-credit-card", "Kisan Credit Card (KCC) Scheme", "Agriculture", "Institutional credit facility for eligible farmers and other notified agricultural and allied-activity borrowers.", "Flexible working-capital credit for crop cultivation and eligible allied needs; limits, interest subvention and security depend on rules and lender assessment.", [rule("occupation", "equals", "Farmer", 20, "Applicant is a farmer"), rule("ownsCultivableLand", "equals", "Yes", 10, "Landholding may support farmer eligibility", false)], "https://www.myscheme.gov.in/schemes/kcc"),
  prototype("soil-health-card", "Soil Health Card Scheme", "Agriculture", "Soil-testing and nutrient-management advisory service for farmers through participating laboratories and state agriculture departments.", "Soil health information and fertiliser recommendations; this is an advisory service rather than a direct cash transfer.", [rule("occupation", "equals", "Farmer", 20, "Applicant is a farmer")], "https://soilhealth.dac.gov.in/"),
  prototype("pm-kusum", "PM-KUSUM", "Agriculture", "Programme supporting decentralised renewable energy and solarisation of agricultural pumps for eligible farmers and implementing entities.", "Capital subsidy and solar pump or feeder support under component-specific state implementation and capacity availability.", [rule("occupation", "equals", "Farmer", 20, "Applicant is a farmer"), rule("primaryGoal", "equals", "Agriculture & Farming", 10, "Applicant is seeking agricultural energy support", false)], "https://pmkusum.mnre.gov.in/"),
  prototype("agri-infrastructure-fund", "Agriculture Infrastructure Fund (AIF)", "Agriculture", "Financing facility for eligible post-harvest management infrastructure and community farming assets through participating lenders.", "Credit support with eligible interest subvention and credit-guarantee provisions, subject to project and borrower eligibility.", [rule("occupation", "oneOf", ["Farmer", "Business Owner", "Self Employed"], 10, "Applicant may be an eligible farmer, entrepreneur or entity representative", false), rule("primaryGoal", "oneOf", ["Agriculture & Farming", "Business & Entrepreneurship"], 10, "Applicant is seeking agriculture infrastructure finance", false)], "https://agriinfra.dac.gov.in/"),
  prototype("pmfme", "PM Formalisation of Micro Food Processing Enterprises Scheme (PMFME)", "Business & Entrepreneurship", "Support for formalisation and upgrading of eligible micro food-processing enterprises, including individual units and groups.", "Credit-linked subsidy, seed capital and common-infrastructure or branding support under component-specific guidelines.", [rule("age", "min", 18, 5, "Applicant is an adult", false), rule("primaryGoal", "equals", "Business & Entrepreneurship", 15, "Applicant is seeking micro-enterprise support", false)], "https://pmfme.mofpi.gov.in/"),
  prototype("pm-matsya-sampada", "Pradhan Mantri Matsya Sampada Yojana (PMMSY)", "Agriculture", "Support for sustainable fisheries and aquaculture development through eligible fishers, fish farmers, groups and enterprises.", "Component-based assistance for fisheries infrastructure, aquaculture, livelihoods and value chains under state implementation.", [rule("occupation", "oneOf", ["Farmer", "Business Owner", "Self Employed"], 10, "Applicant may be a fisher, fish farmer or fisheries entrepreneur", false), rule("primaryGoal", "equals", "Agriculture & Farming", 10, "Applicant is seeking allied-agriculture support", false)], "https://pmmsy.dof.gov.in/"),
  prototype("national-livestock-mission", "National Livestock Mission (NLM)", "Agriculture", "Entrepreneurship and livestock-development support for eligible individuals, FPOs, SHGs and organisations in notified activities.", "Capital subsidy and development support for eligible livestock-sector projects, subject to project appraisal and guidelines.", [rule("occupation", "oneOf", ["Farmer", "Business Owner", "Self Employed"], 10, "Applicant may be a livestock farmer or entrepreneur", false), rule("primaryGoal", "oneOf", ["Agriculture & Farming", "Business & Entrepreneurship"], 10, "Applicant is seeking livestock or allied-enterprise support", false)], "https://nlm.udyamimitra.in/"),
  prototype("one-nation-one-ration-card", "One Nation One Ration Card (ONORC)", "Food Security", "Nationwide portability of eligible NFSA ration entitlements for beneficiaries using ration-card authentication at enabled fair-price shops.", "Access to entitled subsidised foodgrains away from the home location; entitlement depends on NFSA ration-card status.", [rule("primaryGoal", "equals", "Financial Assistance", 5, "Applicant is exploring household food-security support", false)], "https://nfsa.gov.in/"),
  prototype("nfsa-food-security", "National Food Security Act (NFSA) Public Distribution System", "Food Security", "Subsidised foodgrain entitlement for eligible Antyodaya Anna Yojana and priority households identified by state governments.", "Monthly foodgrain entitlement under applicable NFSA categories and current central/state rules.", [rule("residence", "oneOf", ["Rural", "Urban"], 5, "Both rural and urban households may be covered", false)], "https://nfsa.gov.in/"),
  prototype("national-career-service", "National Career Service (NCS)", "Employment & Skill Development", "Government employment and career-services portal connecting jobseekers, employers, counsellors and training opportunities.", "Free registration, job search, career counselling and related employment services; not a guaranteed job or cash benefit.", [rule("primaryGoal", "equals", "Employment & Skill Development", 10, "Applicant is seeking employment services", false)], "https://www.ncs.gov.in/"),
  prototype("pm-dhan-dhaanya", "Pradhan Mantri Dhan-Dhaanya Krishi Yojana", "Agriculture", "Convergence-focused agricultural development programme for selected low-productivity districts, implemented through relevant central and state interventions.", "Improved access to agricultural productivity, irrigation, storage, credit and livelihood interventions in selected districts; district coverage must be checked.", [rule("occupation", "equals", "Farmer", 15, "Applicant is a farmer"), rule("primaryGoal", "equals", "Agriculture & Farming", 10, "Applicant is seeking agricultural development support", false)], "https://agriwelfare.gov.in/"),
  prototype("rashtriya-krishi-vikas", "Rashtriya Krishi Vikas Yojana (RKVY)", "Agriculture", "Umbrella scheme supporting state-led agricultural development projects and innovation across farming and allied sectors.", "Benefits are delivered through state-approved projects and components; individual access depends on state notifications.", [rule("occupation", "equals", "Farmer", 15, "Applicant is a farmer"), rule("primaryGoal", "equals", "Agriculture & Farming", 10, "Applicant is seeking agricultural support", false)], "https://rkvy.nic.in/"),
  prototype("national-family-benefit", "National Family Benefit Scheme (NFBS)", "Social Welfare", "One-time assistance to an eligible BPL household on the death of its primary breadwinner, subject to state verification and current rules.", "Lump-sum financial assistance to the eligible household; event, age and BPL conditions require official verification.", [rule("primaryGoal", "equals", "Financial Assistance", 5, "Applicant is exploring household assistance", false)], "https://nsap.nic.in/"),
  prototype("pmfme-seed-capital-shg", "PMFME Seed Capital Support for SHG Members", "Business & Entrepreneurship", "Seed-capital component under PMFME for eligible self-help-group members engaged in food processing activities.", "Seed capital routed through eligible SHG federations for working capital and small tools, subject to programme conditions.", [rule("gender", "equals", "Female", 10, "Women are a key SHG participant group", false), rule("primaryGoal", "equals", "Business & Entrepreneurship", 10, "Applicant is seeking micro food-processing support", false)], "https://pmfme.mofpi.gov.in/"),
  prototype("pm-poshan", "PM POSHAN Scheme", "Education", "School meal programme for eligible children in government and government-aided schools and specified institutions.", "Hot cooked meals on school days for eligible enrolled children; the benefit is delivered through schools, not as an individual cash scholarship.", [rule("occupation", "equals", "Student", 10, "Applicant is a student", false), rule("primaryGoal", "equals", "Education & Scholarships", 5, "Applicant is exploring education-linked support", false)], "https://pmposhan.education.gov.in/"),
  prototype("national-apprenticeship-training", "National Apprenticeship Training Scheme (NATS)", "Skill Development", "Apprenticeship training for eligible graduate, diploma and vocational certificate holders in participating establishments.", "Practical workplace training and stipend as prescribed in the apprenticeship contract and current rules.", [rule("education", "oneOf", ["Diploma", "Undergraduate", "Graduate"], 20, "Applicant has a potentially eligible qualification"), rule("primaryGoal", "equals", "Employment & Skill Development", 10, "Applicant is seeking apprenticeship experience", false)], "https://nats.education.gov.in/"),
  prototype("pm-jan-aushadhi", "Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP)", "Healthcare", "Affordable generic medicines made available through Pradhan Mantri Bhartiya Janaushadhi Kendras.", "Access to quality-assured generic medicines at lower prices; this is a public access programme, not an individual cash grant.", [rule("primaryGoal", "equals", "Healthcare", 10, "Applicant is seeking affordable healthcare access", false)], "https://janaushadhi.gov.in/"),
  prototype("mission-shakti-sambal", "Mission Shakti - Sambal", "Women Empowerment", "Umbrella support for women's safety and empowerment services, including One Stop Centres and related access points.", "Access to support services for women affected by violence and other eligible needs; service availability varies by location.", [rule("gender", "equals", "Female", 20, "Programme services are focused on women")], "https://missionshakti.wcd.gov.in/"),
  prototype("mission-shakti-samarthya", "Mission Shakti - Samarthya", "Women Empowerment", "Umbrella programme for women's empowerment and care services, including eligible institutional and community support components.", "Access to eligible support services and programme components through designated agencies; not a single universal cash benefit.", [rule("gender", "equals", "Female", 20, "Programme services are focused on women", false), rule("primaryGoal", "equals", "Women Empowerment", 10, "Applicant is seeking women's empowerment support", false)], "https://missionshakti.wcd.gov.in/"),
  prototype("pmfme-common-infrastructure", "PMFME Common Infrastructure Support", "Business & Entrepreneurship", "Support for eligible groups and organisations creating common food-processing infrastructure under PMFME.", "Credit-linked grant support for eligible common infrastructure projects, subject to implementing-agency approval.", [rule("primaryGoal", "equals", "Business & Entrepreneurship", 10, "Applicant is seeking enterprise infrastructure support", false)], "https://pmfme.mofpi.gov.in/")

];
