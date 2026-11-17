
import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, UserRound } from "lucide-react";

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

type Props = {
  initialProfile: UserProfile | null;
  onSave: (profile: UserProfile) => void;
};

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

const steps = ["Personal details", "Financial & education", "Occupation & goals"];

export default function ProfileWizard({ initialProfile, onSave }: Props) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>(
    initialProfile ?? emptyProfile
  );
  const [error, setError] = useState("");

  const update = (key: keyof UserProfile, value: string) => {
    setProfile((previous) => ({ ...previous, [key]: value }));
    setError("");
  };

  const next = () => {
    if (step === 0) {
      const age = Number(profile.age);
      if (!profile.age || age < 15 || age > 100 || !profile.state.trim()) {
        setError("Enter a valid age and your state.");
        return;
      }
    }

    if (step === 1) {
      if (
        profile.annualIncome === "" ||
        !Number.isFinite(Number(profile.annualIncome)) ||
        Number(profile.annualIncome) < 0 ||
        !profile.education
      ) {
        setError("Enter your annual family income and education level.");
        return;
      }
    }

    if (step === 2) {
      if (!profile.occupation || !profile.primaryGoal) {
        setError("Select your occupation and primary objective.");
        return;
      }
      onSave(profile);
      return;
    }

    setStep((previous) => previous + 1);
    setError("");
  };

  const field = (
    label: string,
    key: keyof UserProfile,
    placeholder: string,
    type = "text"
  ) => (
    <label className="profile-field">
      <span>{label}</span>
      <input
        type={type}
        value={profile[key]}
        placeholder={placeholder}
        onChange={(e) => update(key, e.target.value)}
        min={type === "number" ? 0 : undefined}
        required
      />
    </label>
  );

  const select = (
    label: string,
    key: keyof UserProfile,
    options: string[]
  ) => (
    <label className="profile-field">
      <span>{label}</span>
      <select
        value={profile[key]}
        onChange={(e) => update(key, e.target.value)}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option value={option} key={option}>{option}</option>
        ))}
      </select>
    </label>
  );

  return (
    <section className="profile-builder panel">
      <div className="builder-header">
        <div className="stat-icon blue"><UserRound size={21} /></div>
        <div>
          <div className="eyebrow">PERSONALIZED DISCOVERY</div>
          <h2>Build your profile</h2>
          <p>Help us understand your circumstances to find relevant schemes.</p>
        </div>
      </div>

      <div className="wizard-progress">
        <div className="progress-track">
          <div style={{ width: `${((step + 1) / 3) * 100}%` }} />
        </div>
        <div className="step-indicators">
          {steps.map((name, index) => (
            <div className={index <= step ? "step-active" : ""} key={name}>
              <span>{index < step ? <CheckCircle2 size={15} /> : `0${index + 1}`}</span>
              <small>{name}</small>
            </div>
          ))}
        </div>
      </div>

      <div className="wizard-body">
        {step === 0 && (
          <>
            <h3>Let's start with the basics.</h3>
            <p className="wizard-description">A few personal details help establish your eligibility.</p>
            <div className="profile-grid">
              {field("Age *", "age", "e.g. 21", "number")}
              {select("Gender", "gender", ["Male", "Female", "Other", "Prefer not to say"])}
              {field("State *", "state", "e.g. Uttar Pradesh")}
              {field("District", "district", "e.g. Lucknow")}
              {select("Area of residence", "residence", ["Rural", "Urban", "Prefer not to say"])}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h3>Tell us about your financial and educational background.</h3>
            <p className="wizard-description">These details help identify education and financial assistance.</p>
            <div className="profile-grid">
              {field("Annual family income (₹) *", "annualIncome", "e.g. 300000", "number")}
              {select("Highest education *", "education", [
                "Below 10th",
                "10th pass",
                "12th pass",
                "Diploma",
                "Undergraduate",
                "Postgraduate",
                "Doctorate",
                "Other"
              ])}
              {select("Social category (optional)", "category", [
                "General", "OBC", "SC", "ST", "EWS", "Prefer not to say"
              ])}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h3>What describes you best?</h3>
            <p className="wizard-description">We'll use your occupation and objective to personalize recommendations.</p>
            <div className="profile-grid">
              {select("Current occupation *", "occupation", [
                "Student",
                "Salaried Employee",
                "Self-employed",
                "Business Owner",
                "Farmer",
                "Unemployed",
                "Homemaker",
                "Other"
              ])}
              {select("Primary objective *", "primaryGoal", [
                "Education & Scholarships",
                "Employment & Skill Development",
                "Business & Entrepreneurship",
                "Agriculture",
                "Housing",
                "Healthcare",
                "Financial Assistance",
                "Other"
              ])}
            </div>
          </>
        )}

        {error && <div className="form-error">{error}</div>}

        <div className="wizard-actions">
          {step > 0 ? (
            <button className="secondary-button" onClick={() => {
              setStep((previous) => previous - 1);
              setError("");
            }}>
              <ArrowLeft size={15} /> Back
            </button>
          ) : <span />}

          <button className="primary-button wizard-next" onClick={next}>
            {step === 2 ? "Save profile" : "Continue"}
            {step === 2 ? <CheckCircle2 size={16} /> : <ArrowRight size={16} />}
          </button>
        </div>
      </div>

      <div className="privacy-note">
        Your information is used to evaluate scheme relevance. Final eligibility
        depends on official scheme requirements and verification.
      </div>
    </section>
  );
}
