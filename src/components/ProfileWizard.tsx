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
};

const steps = [
  {
    label: "About you",
    heading: "Let's start with you.",
    description: "A few personal details help us find schemes relevant to your location and circumstances.",
  },
  {
    label: "Your background",
    heading: "Understand your background.",
    description: "These details help us identify financial assistance, scholarships and welfare benefits.",
  },
  {
    label: "Your interests",
    heading: "What are you looking for?",
    description: "Tell us about your current situation and the support that matters most to you.",
  },
];

export default function ProfileWizard({
  initialProfile,
  onSave,
}: Props) {
  const [profile, setProfile] = useState<UserProfile>(
    initialProfile ?? emptyProfile
  );

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

    return profile.occupation !== "" && profile.primaryGoal !== "";
  };

  const next = () => {
    if (step < 2 && canContinue()) {
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

  return (
    <div className="profile-v3-wrapper">
      <div className="profile-v3-container">

        {/* Top heading */}
        <div className="profile-v3-top">
          <div className="profile-v3-brand">
            <div className="profile-v3-brand-icon">
              <Sparkles size={19} />
            </div>
            <span>SCHEMESEARCH <b>AI</b></span>
          </div>

          <span className="profile-v3-secure">
            <CheckCircle2 size={14} />
            Personalised recommendations
          </span>
        </div>

        {/* Main content */}
        <div className="profile-v3-main">

          <div className="profile-v3-intro">
            <div className="profile-v3-kicker">
              PROFILE SETUP <span>·</span> STEP {step + 1} OF 3
            </div>

            <h2>{current.heading}</h2>

            <p>{current.description}</p>
          </div>

          {/* Progress */}
          <div className="profile-v3-progress">
            <div
              className="profile-v3-progress-fill"
              style={{
                width: `${((step + 1) / 3) * 100}%`,
              }}
            />
          </div>

          {/* Form */}
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
                        {profile.state ? "Select district" : "Choose state first"}
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
                      ["General", "OBC", "SC", "ST", "EWS", "Other"],
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

          </div>

          {/* Footer */}
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
                {step + 1} / 3
              </span>

              {step < 2 ? (
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