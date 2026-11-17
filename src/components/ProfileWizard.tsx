import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  MapPin,
  Sparkles,
} from "lucide-react";

import indiaData from "../data/india_states_districts.json";

export type UserProfile = {
  age: string;
  gender: string;
  state: string;
  district: string;
  residence: string;
  annualIncome: string;
  education: string;
  category: string;
  occupation: string;
  primaryGoal: string;

  // Scholarship details
  postMatricEnrolled: string;
  class12Above80thPercentile: string;
  courseMode: string;
  receivesOtherScholarship: string;
  isDiplomaCourse: string;
  tookDropAfter12: string;
  topClassInstitution: string;
  aicteApprovedInstitution: string;
  girlsInFamily: string;
  qheiAdmission: string;

  // PM-KISAN details
  ownsCultivableLand: string;
  landRecordedInApplicantName: string;
  pmKisanExclusion: string;

  // Housing details
  ownsPuccaHouse: string;
  receivedHousingAssistance: string;

  // PMEGP details
  proposedEnterpriseIsNew: string;
  proposedProjectCost: string;
  pmegpProjectType: string;
  pmegpEducationEligible: string;
  pmegpPreviousSubsidy: string;
  pmegpCapitalExpenditure: string;

  // PM-KMY details
  agriculturalLandHolding: string;
  pmKmyExclusion: string;

  // PM-DAKSH details
  dakshTargetGroup: string;

  // Additional household and beneficiary details
  maritalStatus: string;
  disabilityStatus: string;
  disabilityPercentage: string;
  householdSize: string;
  beneficiaryRelationship: string;
  beneficiaryAge: string;
  beneficiaryGender: string;

  // Farmer, accident-claim and artisan details
  farmerRelationship: string;
  accidentClaimType: string;
  artisanTrade: string;
  receivedToolkitBefore: string;
  selfHelpGroupMember: string;
};

type District = {
  code: string;
  name: string;
};

type StateData = {
  code: string;
  name: string;
  districts: District[];
};

type Props = {
  initialProfile: UserProfile | null;
  onSave: (profile: UserProfile) => void;
};

const stateData = indiaData as StateData[];

const emptyProfile: UserProfile = {
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

  maritalStatus: "",
  disabilityStatus: "",
  disabilityPercentage: "",
  householdSize: "",
  beneficiaryRelationship: "Self",
  beneficiaryAge: "",
  beneficiaryGender: "",
  farmerRelationship: "",
  accidentClaimType: "",
  artisanTrade: "",
  receivedToolkitBefore: "",
  selfHelpGroupMember: "",
};

const steps = [
  {
    label: "About you",
    heading: "Let's start with you.",
    description:
      "A few personal details help us find schemes relevant to your location and circumstances.",
  },
  {
    label: "Your background",
    heading: "Understand your background.",
    description:
      "These details help us identify financial assistance, scholarships and welfare benefits.",
  },
  {
    label: "Your interests",
    heading: "What are you looking for?",
    description:
      "Tell us about your current situation and the support that matters most to you.",
  },
  {
    label: "Additional details",
    heading: "A little more about your circumstances.",
    description:
      "These optional details help us narrow down family, social-security, farmer and livelihood schemes.",
  },
];

const yesNoOptions = ["Yes", "No", "Not sure"];

export default function ProfileWizard({
  initialProfile,
  onSave,
}: Props) {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const restored = {
      ...emptyProfile,
      ...(initialProfile ?? {}),
    };

    restored.beneficiaryRelationship =
      restored.beneficiaryRelationship || "Self";

    if (restored.beneficiaryRelationship === "Self") {
      restored.beneficiaryAge = restored.beneficiaryAge || restored.age;
      restored.beneficiaryGender = restored.beneficiaryGender || restored.gender;
    }

    return restored;
  });

  const [step, setStep] = useState(0);

  const selectedState = useMemo(
    () => stateData.find((item) => item.name === profile.state),
    [profile.state]
  );

  const districts = selectedState?.districts ?? [];

  const update = (key: keyof UserProfile, value: string) => {
    setProfile((previous) => ({
      ...previous,
      [key]: value,
      ...(key === "state" ? { district: "" } : {}),
      ...(key === "age" && previous.beneficiaryRelationship === "Self"
        ? { beneficiaryAge: value }
        : {}),
      ...(key === "gender" && previous.beneficiaryRelationship === "Self"
        ? { beneficiaryGender: value }
        : {}),
      ...(key === "beneficiaryRelationship"
        ? value === "Self"
          ? {
              beneficiaryAge: previous.age,
              beneficiaryGender: previous.gender,
            }
          : {
              beneficiaryAge: "",
              beneficiaryGender: "",
            }
        : {}),
    }));
  };

  const canContinue = () => {
    if (step === 0) {
      return (
        profile.age.trim() !== "" &&
        Number(profile.age) > 0 &&
        Number(profile.age) <= 120 &&
        profile.gender !== "" &&
        profile.state !== "" &&
        profile.district !== "" &&
        profile.residence !== ""
      );
    }

    if (step === 1) {
      return (
        profile.annualIncome.trim() !== "" &&
        Number(profile.annualIncome) >= 0 &&
        profile.education !== "" &&
        profile.category !== ""
      );
    }

    if (step === 2) {
      return profile.occupation !== "" && profile.primaryGoal !== "";
    }

    // The additional-information step is deliberately optional.
    return true;
  };

  const next = () => {
    if (step < steps.length - 1 && canContinue()) {
      setStep((current) => current + 1);
    }
  };

  const back = () => {
    if (step > 0) {
      setStep((current) => current - 1);
    }
  };

  const current = steps[step];
  const inputClass = "profile-v3-input";

  const selectOptions = (
    items: string[],
    value: string,
    onChange: (value: string) => void,
    placeholder: string
  ) => (
    <select
      className={inputClass}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {items.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  );

  const field = (
    label: string,
    content: React.ReactNode,
    full = false
  ) => (
    <div className={`profile-v3-field ${full ? "profile-v3-full" : ""}`}>
      <label>{label}</label>
      {content}
    </div>
  );

  const choiceGroup = (
    options: string[],
    value: string,
    onChange: (value: string) => void
  ) => (
    <div className="profile-v3-choices">
      {options.map((option) => (
        <button
          type="button"
          key={option}
          className={`profile-v3-choice ${
            value === option ? "selected" : ""
          }`}
          onClick={() => onChange(option)}
        >
          {option}
          {value === option && <Check size={15} />}
        </button>
      ))}
    </div>
  );

  const isStudent = profile.occupation === "Student";
  const isFarmer = profile.occupation === "Farmer";

  const isSC = profile.category === "SC";
  const isST = profile.category === "ST";

  const wantsHousing =
    profile.primaryGoal === "Housing & Basic Needs";

  const wantsBusiness =
    profile.primaryGoal === "Business & Entrepreneurship";

  const wantsAgriculture =
    profile.primaryGoal === "Agriculture & Farming";

  const wantsEmployment =
    profile.primaryGoal === "Employment & Skill Development";

  const wantsSHGSupport = [
    "Business & Entrepreneurship",
    "Women Empowerment",
    "Social Welfare",
  ].includes(profile.primaryGoal);

  const showUPArtisanDetails =
    profile.state === "Uttar Pradesh" && (wantsEmployment || wantsBusiness);

  return (
    <div className="profile-v3-wrapper">
      <div className="profile-v3-container">
        <div className="profile-v3-top">
          <div className="profile-v3-brand">
            <div className="profile-v3-brand-icon">
              <Sparkles size={19} />
            </div>
            <span>
              SCHEMESEARCH <b>AI</b>
            </span>
          </div>

          <span className="profile-v3-secure">
            <CheckCircle2 size={14} />
            Personalised recommendations
          </span>
        </div>

        <div className="profile-v3-main">
          <div className="profile-v3-intro">
            <div className="profile-v3-kicker">
              PROFILE SETUP <span>·</span> STEP {step + 1} OF {steps.length}
            </div>

            <h2>{current.heading}</h2>
            <p>{current.description}</p>
          </div>

          <div className="profile-v3-progress">
            <div
              className="profile-v3-progress-fill"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>

          <div className="profile-v3-form">
            {step === 0 && (
              <>
                <div className="profile-v3-section-label">
                  PERSONAL INFORMATION
                </div>

                <div className="profile-v3-grid">
                  {field(
                    "Your age",
                    <input
                      className={inputClass}
                      type="number"
                      min="1"
                      max="120"
                      placeholder="Enter age"
                      value={profile.age}
                      onChange={(e) => update("age", e.target.value)}
                    />
                  )}

                  {field(
                    "Gender",
                    choiceGroup(
                      ["Male", "Female", "Other"],
                      profile.gender,
                      (value) => update("gender", value)
                    )
                  )}
                </div>

                <div className="profile-v3-section-label profile-v3-location-label">
                  <MapPin size={14} />
                  YOUR LOCATION
                </div>

                <div className="profile-v3-grid">
                  {field(
                    "State / Union Territory",
                    <select
                      className={inputClass}
                      value={profile.state}
                      onChange={(e) => update("state", e.target.value)}
                    >
                      <option value="">Select state</option>
                      {stateData
                        .slice()
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((item) => (
                          <option key={item.code} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                    </select>
                  )}

                  {field(
                    "District",
                    <select
                      className={inputClass}
                      value={profile.district}
                      disabled={!profile.state}
                      onChange={(e) => update("district", e.target.value)}
                    >
                      <option value="">
                        {profile.state
                          ? "Select district"
                          : "Choose state first"}
                      </option>
                      {districts
                        .slice()
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((district) => (
                          <option key={district.code} value={district.name}>
                            {district.name}
                          </option>
                        ))}
                    </select>
                  )}
                </div>

                {field(
                  "Where do you live?",
                  choiceGroup(
                    ["Rural", "Urban"],
                    profile.residence,
                    (value) => update("residence", value)
                  ),
                  true
                )}
              </>
            )}

            {step === 1 && (
              <>
                <div className="profile-v3-section-label">
                  FINANCIAL INFORMATION
                </div>

                {field(
                  "Annual family income",
                  <div className="profile-v3-income">
                    <span>₹</span>
                    <input
                      className={inputClass}
                      type="number"
                      min="0"
                      placeholder="Enter annual income"
                      value={profile.annualIncome}
                      onChange={(e) =>
                        update("annualIncome", e.target.value)
                      }
                    />
                  </div>,
                  true
                )}

                <p className="profile-v3-helper">
                  Approximate total annual income of your family.
                </p>

                <div className="profile-v3-section-label profile-v3-section-spaced">
                  EDUCATION & CATEGORY
                </div>

                <div className="profile-v3-grid">
                  {field(
                    "Highest education",
                    selectOptions(
                      [
                        "Below 10th",
                        "10th Pass",
                        "12th Pass",
                        "Diploma",
                        "Undergraduate",
                        "Graduate",
                        "Postgraduate",
                        "Doctorate",
                      ],
                      profile.education,
                      (value) => update("education", value),
                      "Select education"
                    )
                  )}

                  {field(
                    "Social category",
                    selectOptions(
                      ["General", "OBC", "EBC", "SC", "ST", "EWS", "DNT", "Other"],
                      profile.category,
                      (value) => update("category", value),
                      "Select category"
                    )
                  )}
                </div>

                <div className="profile-v3-note">
                  <CheckCircle2 size={17} />
                  <span>
                    These details help determine eligibility for
                    income-based and category-specific schemes.
                  </span>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="profile-v3-section-label">
                  CURRENT SITUATION
                </div>

                {field(
                  "What best describes your occupation?",
                  selectOptions(
                    [
                      "Student",
                      "Farmer",
                      "Business Owner",
                      "Self Employed",
                      "Salaried",
                      "Unemployed",
                      "Homemaker",
                      "Daily Wage Worker",
                      "Other",
                    ],
                    profile.occupation,
                    (value) => update("occupation", value),
                    "Select occupation"
                  ),
                  true
                )}

                {isStudent && (
                  <>
                    <div className="profile-v3-section-label profile-v3-section-spaced">
                      SCHOLARSHIP ELIGIBILITY DETAILS
                    </div>

                    <p className="profile-v3-helper">
                      Select "Not sure" if you do not know an answer.
                    </p>

                    <div className="profile-v3-grid">
                      {field(
                        "Did you score above the 80th percentile in your Class 12 board stream?",
                        choiceGroup(
                          yesNoOptions,
                          profile.class12Above80thPercentile,
                          (value) =>
                            update("class12Above80thPercentile", value)
                        ),
                        true
                      )}

                      {field(
                        "What type of course are you pursuing?",
                        selectOptions(
                          [
                            "Regular",
                            "Distance / Correspondence",
                            "Not sure",
                          ],
                          profile.courseMode,
                          (value) => update("courseMode", value),
                          "Select course mode"
                        ),
                        true
                      )}

                      {field(
                        "Are you receiving another scholarship or fee reimbursement?",
                        choiceGroup(
                          yesNoOptions,
                          profile.receivesOtherScholarship,
                          (value) =>
                            update("receivesOtherScholarship", value)
                        ),
                        true
                      )}

                      {field(
                        "Are you enrolled in a diploma course?",
                        choiceGroup(
                          yesNoOptions,
                          profile.isDiplomaCourse,
                          (value) => update("isDiplomaCourse", value)
                        ),
                        true
                      )}

                      {field(
                        "Did you take a gap year after passing Class 12 before starting your current course?",
                        choiceGroup(
                          yesNoOptions,
                          profile.tookDropAfter12,
                          (value) => update("tookDropAfter12", value)
                        ),
                        true
                      )}

                      {isSC &&
                        field(
                          "Are you currently enrolled in a post-matric course?",
                          choiceGroup(
                            yesNoOptions,
                            profile.postMatricEnrolled,
                            (value) => update("postMatricEnrolled", value)
                          ),
                          true
                        )}

                      {isST &&
                        field(
                          "Is your institution on the Ministry's notified Top Class list?",
                          choiceGroup(
                            yesNoOptions,
                            profile.topClassInstitution,
                            (value) => update("topClassInstitution", value)
                          ),
                          true
                        )}

                      {field(
                        "Is your institution approved by AICTE?",
                        choiceGroup(
                          yesNoOptions,
                          profile.aicteApprovedInstitution,
                          (value) =>
                            update("aicteApprovedInstitution", value)
                        ),
                        true
                      )}

                      {profile.gender === "Female" &&
                        field(
                          "How many girl children are there in your family, including you?",
                          selectOptions(
                            ["1", "2", "3", "4", "5 or more"],
                            profile.girlsInFamily,
                            (value) => update("girlsInFamily", value),
                            "Select number"
                          ),
                          true
                        )}

                      {field(
                        "Have you been admitted to an institution listed under the PM-Vidyalaxmi Quality Higher Educational Institutions (QHEI) framework?",
                        choiceGroup(
                          yesNoOptions,
                          profile.qheiAdmission,
                          (value) => update("qheiAdmission", value)
                        ),
                        true
                      )}
                    </div>
                  </>
                )}

                {(isFarmer || wantsAgriculture) && (
                  <>
                    <div className="profile-v3-section-label profile-v3-section-spaced">
                      AGRICULTURAL LAND DETAILS
                    </div>

                    <p className="profile-v3-helper">
                      These questions help assess PM-KISAN and PM-KMY
                      eligibility. PM-KISAN exclusions include certain
                      institutional, public-office, government-service,
                      pension and income-tax categories.
                    </p>

                    <div className="profile-v3-grid">
                      {field(
                        "Do you own cultivable agricultural land?",
                        choiceGroup(
                          yesNoOptions,
                          profile.ownsCultivableLand,
                          (value) => update("ownsCultivableLand", value)
                        ),
                        true
                      )}

                      {field(
                        "Is the agricultural land recorded in your name?",
                        choiceGroup(
                          yesNoOptions,
                          profile.landRecordedInApplicantName,
                          (value) =>
                            update("landRecordedInApplicantName", value)
                        ),
                        true
                      )}

                      {field(
                        "Does any PM-KISAN exclusion condition apply to you?",
                        choiceGroup(
                          yesNoOptions,
                          profile.pmKisanExclusion,
                          (value) => update("pmKisanExclusion", value)
                        ),
                        true
                      )}

                      {field(
                        "What is your total agricultural landholding in hectares?",
                        <input
                          className={inputClass}
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Enter landholding in hectares"
                          value={profile.agriculturalLandHolding}
                          onChange={(e) =>
                            update("agriculturalLandHolding", e.target.value)
                          }
                        />,
                        true
                      )}

                      {field(
                        "Are you covered by another statutory social-security pension scheme or a PM-KMY exclusion condition?",
                        choiceGroup(
                          yesNoOptions,
                          profile.pmKmyExclusion,
                          (value) => update("pmKmyExclusion", value)
                        ),
                        true
                      )}
                    </div>
                  </>
                )}

                {wantsHousing && (
                  <>
                    <div className="profile-v3-section-label profile-v3-section-spaced">
                      HOUSING INFORMATION
                    </div>

                    <p className="profile-v3-helper">
                      For PMAY-U 2.0 screening, consider pucca-house
                      ownership anywhere in India and government housing
                      assistance received during the last 20 years.
                    </p>

                    <div className="profile-v3-grid">
                      {field(
                        "Does anyone in your household own a pucca house anywhere in India?",
                        choiceGroup(
                          yesNoOptions,
                          profile.ownsPuccaHouse,
                          (value) => update("ownsPuccaHouse", value)
                        ),
                        true
                      )}

                      {field(
                        "Has anyone in your household received government housing assistance during the last 20 years?",
                        choiceGroup(
                          yesNoOptions,
                          profile.receivedHousingAssistance,
                          (value) =>
                            update("receivedHousingAssistance", value)
                        ),
                        true
                      )}
                    </div>
                  </>
                )}

                {wantsBusiness && (
                  <>
                    <div className="profile-v3-section-label profile-v3-section-spaced">
                      BUSINESS & PROJECT DETAILS
                    </div>

                    <p className="profile-v3-helper">
                      These questions help screen PMEGP. Final approval
                      depends on project appraisal, bank assessment and
                      official programme conditions.
                    </p>

                    <div className="profile-v3-grid">
                      {field(
                        "Are you planning to establish a completely new business or enterprise?",
                        choiceGroup(
                          yesNoOptions,
                          profile.proposedEnterpriseIsNew,
                          (value) =>
                            update("proposedEnterpriseIsNew", value)
                        ),
                        true
                      )}

                      {field(
                        "Type of proposed project",
                        selectOptions(
                          ["Manufacturing", "Service / Business"],
                          profile.pmegpProjectType,
                          (value) => update("pmegpProjectType", value),
                          "Select project type"
                        ),
                        true
                      )}

                      {field(
                        "Estimated total project cost (₹)",
                        <div className="profile-v3-income">
                          <span>₹</span>
                          <input
                            className={inputClass}
                            type="number"
                            min="0"
                            placeholder="Enter estimated project cost"
                            value={profile.proposedProjectCost}
                            onChange={(e) =>
                              update("proposedProjectCost", e.target.value)
                            }
                          />
                        </div>,
                        true
                      )}

                      {field(
                        "Is your educational qualification at least Class 8?",
                        choiceGroup(
                          yesNoOptions,
                          profile.pmegpEducationEligible,
                          (value) =>
                            update("pmegpEducationEligible", value)
                        ),
                        true
                      )}

                      {field(
                        "Have you or your proposed unit previously received a government subsidy for this project or enterprise?",
                        choiceGroup(
                          yesNoOptions,
                          profile.pmegpPreviousSubsidy,
                          (value) =>
                            update("pmegpPreviousSubsidy", value)
                        ),
                        true
                      )}

                      {field(
                        "Does your project include capital expenditure (fixed assets/equipment)?",
                        choiceGroup(
                          yesNoOptions,
                          profile.pmegpCapitalExpenditure,
                          (value) =>
                            update("pmegpCapitalExpenditure", value)
                        ),
                        true
                      )}
                    </div>

                    <p className="profile-v3-helper">
                      PMEGP's Class 8 qualification condition depends on
                      project cost: above ₹10 lakh for manufacturing or
                      above ₹5 lakh for service/business projects.
                    </p>
                  </>
                )}

                {wantsEmployment && (
                  <>
                    <div className="profile-v3-section-label profile-v3-section-spaced">
                      SKILL DEVELOPMENT DETAILS
                    </div>

                    <p className="profile-v3-helper">
                      PM-DAKSH covers specified target groups. Choose
                      the group that best describes your situation.
                    </p>

                    {field(
                      "Which target group applies to you?",
                      selectOptions(
                        [
                          "SC",
                          "OBC",
                          "EWS",
                          "DNT",
                          "Safai Karamchari",
                          "Waste Picker",
                          "Not sure",
                          "None of these",
                        ],
                        profile.dakshTargetGroup,
                        (value) => update("dakshTargetGroup", value),
                        "Select target group"
                      ),
                      true
                    )}
                  </>
                )}

                <div className="profile-v3-section-label profile-v3-section-spaced">
                  YOUR PRIORITY
                </div>

                {field(
                  "What kind of support are you looking for?",
                  selectOptions(
                    [
                      "Education & Scholarships",
                      "Employment & Skill Development",
                      "Business & Entrepreneurship",
                      "Agriculture & Farming",
                      "Housing & Basic Needs",
                      "Healthcare",
                      "Financial Assistance",
                      "Women Empowerment",
                      "Social Welfare",
                      "Other Benefits",
                    ],
                    profile.primaryGoal,
                    (value) => update("primaryGoal", value),
                    "Select your primary goal"
                  ),
                  true
                )}

                <div className="profile-v3-note">
                  <Sparkles size={17} />
                  <span>
                    Your recommendations will be tailored to your
                    profile. You can update these details anytime.
                  </span>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="profile-v3-section-label">
                  FAMILY & PERSONAL CIRCUMSTANCES
                </div>

                <p className="profile-v3-helper">
                  These answers are optional. Choose "Not sure" whenever you do not know an answer.
                </p>

                <div className="profile-v3-grid">
                  {field(
                    "Marital status",
                    selectOptions(
                      ["Single", "Married", "Widowed", "Divorced", "Separated", "Not sure"],
                      profile.maritalStatus,
                      (value) => update("maritalStatus", value),
                      "Select marital status"
                    )
                  )}

                  {field(
                    "Do you have a disability?",
                    choiceGroup(
                      yesNoOptions,
                      profile.disabilityStatus,
                      (value) => update("disabilityStatus", value)
                    )
                  )}

                  {profile.disabilityStatus === "Yes" &&
                    field(
                      "Disability percentage (if known)",
                      <input
                        className={inputClass}
                        type="number"
                        min="0"
                        max="100"
                        placeholder="Enter percentage"
                        value={profile.disabilityPercentage}
                        onChange={(e) => update("disabilityPercentage", e.target.value)}
                      />
                    )}

                  {field(
                    "Approximate household size",
                    <input
                      className={inputClass}
                      type="number"
                      min="1"
                      max="50"
                      placeholder="Number of family members"
                      value={profile.householdSize}
                      onChange={(e) => update("householdSize", e.target.value)}
                    />
                  )}
                </div>

                <div className="profile-v3-section-label profile-v3-section-spaced">
                  BENEFICIARY DETAILS
                </div>

                <p className="profile-v3-helper">
                  You can search for yourself or for a dependent family member. When you choose yourself, age and gender are copied from your main profile.
                </p>

                <div className="profile-v3-grid">
                  {field(
                    "Who is the person seeking the benefit?",
                    selectOptions(
                      ["Self", "Daughter / Son", "Spouse", "Parent", "Other dependent"],
                      profile.beneficiaryRelationship,
                      (value) => update("beneficiaryRelationship", value),
                      "Select relationship"
                    ),
                    true
                  )}

                  {profile.beneficiaryRelationship !== "Self" && (
                    <>
                      {field(
                        "Beneficiary age",
                        <input
                          className={inputClass}
                          type="number"
                          min="0"
                          max="120"
                          placeholder="Enter beneficiary age"
                          value={profile.beneficiaryAge}
                          onChange={(e) => update("beneficiaryAge", e.target.value)}
                        />
                      )}

                      {field(
                        "Beneficiary gender",
                        choiceGroup(
                          ["Male", "Female", "Other"],
                          profile.beneficiaryGender,
                          (value) => update("beneficiaryGender", value)
                        )
                      )}
                    </>
                  )}
                </div>

                {(isFarmer || wantsAgriculture) && (
                  <>
                    <div className="profile-v3-section-label profile-v3-section-spaced">
                      FARMER & ACCIDENT-CLAIM DETAILS
                    </div>

                    <div className="profile-v3-grid">
                      {field(
                        "Relationship to the farmer",
                        selectOptions(
                          ["Self", "Parent", "Spouse", "Child", "Other eligible family member"],
                          profile.farmerRelationship,
                          (value) => update("farmerRelationship", value),
                          "Select relationship"
                        ),
                        true
                      )}

                      {field(
                        "What is the claim related to?",
                        selectOptions(
                          ["Accidental death", "Permanent disability", "Specified disability", "Not applicable / Not sure"],
                          profile.accidentClaimType,
                          (value) => update("accidentClaimType", value),
                          "Select claim type"
                        ),
                        true
                      )}
                    </div>
                  </>
                )}

                {showUPArtisanDetails && (
                  <>
                    <div className="profile-v3-section-label profile-v3-section-spaced">
                      ARTISAN & LIVELIHOOD DETAILS
                    </div>

                    <div className="profile-v3-grid">
                      {field(
                        "Which trade or craft best describes your work?",
                        selectOptions(
                          ["Carpenter", "Blacksmith", "Cobbler", "Tailor", "Barber", "Mason", "Potter", "Goldsmith", "Basket maker", "Weaver", "Other"],
                          profile.artisanTrade,
                          (value) => update("artisanTrade", value),
                          "Select trade"
                        ),
                        true
                      )}

                      {field(
                        "Have you previously received a government toolkit under an artisan or skill scheme?",
                        choiceGroup(
                          yesNoOptions,
                          profile.receivedToolkitBefore,
                          (value) => update("receivedToolkitBefore", value)
                        ),
                        true
                      )}
                    </div>
                  </>
                )}

                {wantsSHGSupport && (
                  <>
                    <div className="profile-v3-section-label profile-v3-section-spaced">
                      COMMUNITY & GROUP SUPPORT
                    </div>

                    {field(
                      "Are you a member of a Self-Help Group (SHG)?",
                      choiceGroup(
                        yesNoOptions,
                        profile.selfHelpGroupMember,
                        (value) => update("selfHelpGroupMember", value)
                      ),
                      true
                    )}
                  </>
                )}

                <div className="profile-v3-note">
                  <CheckCircle2 size={17} />
                  <span>
                    You can save your profile without answering these optional questions and update them later.
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="profile-v3-footer">
            <button
              type="button"
              className="profile-v3-back"
              onClick={back}
              disabled={step === 0}
            >
              <ArrowLeft size={16} />
              Back
            </button>

            <div className="profile-v3-footer-right">
              <span className="profile-v3-required">
                {step + 1} / {steps.length}
              </span>

              {step < steps.length - 1 ? (
                <button
                  type="button"
                  className="profile-v3-next"
                  onClick={next}
                  disabled={!canContinue()}
                >
                  Continue
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  className="profile-v3-next"
                  onClick={() => onSave(profile)}
                  disabled={!canContinue()}
                >
                  Save profile
                  <Check size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="profile-v3-bottom">
          Your information helps us find relevant government schemes.
        </p>
      </div>
    </div>
  );
}
