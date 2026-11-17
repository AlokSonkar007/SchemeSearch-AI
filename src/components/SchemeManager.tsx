import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  FilePlus2,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";

import type {
  EligibilityRule,
  RuleOperator,
  Scheme,
} from "../types/scheme";

import type { UserProfile } from "./ProfileWizard";

type Props = {
  schemes: Scheme[];
  onSave: (scheme: Scheme) => void;
  onDelete: (id: string) => void;
};

const profileFields: {
  value: keyof UserProfile;
  label: string;
}[] = [
  { value: "age", label: "Age" },
  { value: "gender", label: "Gender" },
  { value: "state", label: "State" },
  { value: "district", label: "District" },
  { value: "residence", label: "Residence type" },
  { value: "annualIncome", label: "Annual family income" },
  { value: "education", label: "Education" },
  { value: "category", label: "Social category" },
  { value: "occupation", label: "Occupation" },
  { value: "primaryGoal", label: "Primary goal" },
];

const educationLevels = [
  "Below 10th",
  "10th Pass",
  "12th Pass",
  "Diploma",
  "Undergraduate",
  "Graduate",
  "Postgraduate",
  "Doctorate",
];

const categories = [
  "Education",
  "Employment",
  "Agriculture",
  "Business",
  "Housing",
  "Healthcare",
  "Women & Child",
  "Social Welfare",
  "Financial Assistance",
  "Other",
];

const createRule = (): EligibilityRule => ({
  field: "age",
  operator: "min",
  value: "",
  mandatory: true,
  weight: 20,
  label: "",
});

const createScheme = (): Scheme => ({
  id: "",
  name: "",
  category: "Education",
  description: "",
  benefit: "",
  criteria: [createRule()],
  dataStatus: "prototype",
  sourceUrl: null,
  lastVerifiedAt: null,
});

const getOperators = (
  field: keyof UserProfile
): { value: RuleOperator; label: string }[] => {
  if (field === "age" || field === "annualIncome") {
    return [
      { value: "min", label: "At least" },
      { value: "max", label: "At most" },
      { value: "equals", label: "Exactly" },
    ];
  }

  if (field === "education") {
    return [
      { value: "equals", label: "Is" },
      { value: "oneOf", label: "Is one of" },
      { value: "educationAtLeast", label: "At least this level" },
    ];
  }

  return [
    { value: "equals", label: "Is" },
    { value: "oneOf", label: "Is one of" },
  ];
};

const formatDate = (value?: string | null) => {
  if (!value) return "Not recorded";

  const date = new Date(`${value}T00:00:00`);

  return Number.isNaN(date.getTime())
    ? "Not recorded"
    : date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
};

export default function SchemeManager({
  schemes,
  onSave,
  onDelete,
}: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Scheme>(createScheme);
  const [error, setError] = useState("");

  const filteredSchemes = useMemo(() => {
    const query = search.trim().toLowerCase();

    return schemes
      .filter((scheme) => {
        const matchesSearch =
          !query ||
          scheme.name.toLowerCase().includes(query) ||
          scheme.category.toLowerCase().includes(query) ||
          scheme.description.toLowerCase().includes(query);

        const matchesStatus =
          statusFilter === "all" ||
          scheme.dataStatus === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [schemes, search, statusFilter]);

  const verifiedCount = schemes.filter(
    (scheme) => scheme.dataStatus === "verified"
  ).length;

  const openNewEditor = () => {
    setDraft(createScheme());
    setEditingId(null);
    setError("");
    setEditorOpen(true);
  };

  const openEditEditor = (scheme: Scheme) => {
    setDraft({
      ...scheme,
      sourceUrl: scheme.sourceUrl ?? null,
      lastVerifiedAt: scheme.lastVerifiedAt ?? null,
      criteria: scheme.criteria.map((rule) => ({
        ...rule,
        value: Array.isArray(rule.value)
          ? [...rule.value]
          : rule.value,
      })),
    });

    setEditingId(scheme.id);
    setError("");
    setEditorOpen(true);
  };

  const updateDraft = <K extends keyof Scheme>(
    key: K,
    value: Scheme[K]
  ) => {
    setDraft((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const updateRule = (
    index: number,
    updates: Partial<EligibilityRule>
  ) => {
    setDraft((previous) => ({
      ...previous,
      criteria: previous.criteria.map((rule, currentIndex) =>
        currentIndex === index
          ? { ...rule, ...updates }
          : rule
      ),
    }));
  };

  const changeRuleField = (
    index: number,
    field: keyof UserProfile
  ) => {
    const operator = getOperators(field)[0].value;

    updateRule(index, {
      field,
      operator,
      value: "",
    });
  };

  const parseRuleValue = (
    rule: EligibilityRule,
    rawValue: string
  ): string | number | string[] => {
    if (rule.operator === "oneOf") {
      return rawValue
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
    }

    if (rule.field === "age" || rule.field === "annualIncome") {
        return rawValue.trim() === "" ? "" : Number(rawValue);
    }

    return rawValue;
  };

  const getRuleValue = (rule: EligibilityRule): string => {
    return Array.isArray(rule.value)
      ? rule.value.join(", ")
      : String(rule.value);
  };

  const validateAndSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const name = draft.name.trim();
    const description = draft.description.trim();
    const benefit = draft.benefit.trim();

    if (!name || !description || !benefit) {
      setError("Please complete the scheme name, description and benefit.");
      return;
    }

    if (draft.criteria.length === 0) {
      setError("Add at least one eligibility criterion.");
      return;
    }

    for (let index = 0; index < draft.criteria.length; index++) {
      const rule = draft.criteria[index];

      if (!rule.label.trim() || getRuleValue(rule).trim() === "") {
        setError(`Please complete eligibility rule ${index + 1}.`);
        return;
      }

      const numericField =
        rule.field === "age" ||
        rule.field === "annualIncome";

      if (
        numericField &&
        rule.operator !== "oneOf" &&
        !Number.isFinite(Number(rule.value))
      ) {
        setError(`Rule ${index + 1} needs a valid number.`);
        return;
      }

      if (
        !Number.isFinite(rule.weight) ||
        rule.weight < 0 ||
        rule.weight > 100
      ) {
        setError(`Rule ${index + 1} must have a weight from 0 to 100.`);
        return;
      }

      if (
        rule.operator === "oneOf" &&
        (!Array.isArray(rule.value) || rule.value.length === 0)
      ) {
        setError(`Rule ${index + 1} needs at least one allowed value.`);
        return;
      }
    }

    let sourceUrl: string | null = null;

    if (draft.sourceUrl?.trim()) {
      try {
        const parsedUrl = new URL(draft.sourceUrl.trim());

        if (
          parsedUrl.protocol !== "https:" &&
          parsedUrl.protocol !== "http:"
        ) {
          throw new Error("Invalid protocol");
        }

        sourceUrl = parsedUrl.toString();
      } catch {
        setError("Enter a valid source URL starting with https:// or http://.");
        return;
      }
    }

    if (draft.dataStatus === "verified" && !sourceUrl) {
      setError("A source URL is required before marking a scheme as verified.");
      return;
    }

    const id =
      editingId ??
      `${name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")}-${Date.now().toString(36)}`;

    const schemeToSave: Scheme = {
      ...draft,
      id,
      name,
      description,
      benefit,
      category: draft.category.trim(),
      sourceUrl,
      lastVerifiedAt:
        draft.dataStatus === "verified"
          ? draft.lastVerifiedAt || null
          : null,
      criteria: draft.criteria.map((rule) => ({
        ...rule,
        label: rule.label.trim(),
        value:
          rule.operator === "oneOf"
            ? (Array.isArray(rule.value)
                ? rule.value
                : String(rule.value)
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean))
            : rule.field === "age" ||
                rule.field === "annualIncome"
              ? Number(rule.value)
              : String(rule.value),
      })),
    };

    onSave(schemeToSave);
    setEditorOpen(false);
    setEditingId(null);
    setDraft(createScheme());
  };

  const removeScheme = (scheme: Scheme) => {
    const confirmed = window.confirm(
      `Delete "${scheme.name}"? This cannot be undone.`
    );

    if (!confirmed) return;

    onDelete(scheme.id);
  };

  return (
    <div className="scheme-manager">

      {/* Inventory header */}
      <div className="sm-overview">
        <div className="sm-overview-copy">
          <div className="sm-eyebrow">ADMINISTRATION</div>
          <h2>Scheme Manager</h2>
          <p>
            Maintain your scheme catalogue, eligibility conditions
            and source information.
          </p>
        </div>

        <button
          type="button"
          className="sm-primary-button"
          onClick={openNewEditor}
        >
          <Plus size={17} />
          Add scheme
        </button>
      </div>

      {/* Summary */}
      <div className="sm-stat-grid">
        <div className="sm-stat">
          <span>Total schemes</span>
          <strong>{schemes.length}</strong>
          <small>Records in catalogue</small>
        </div>

        <div className="sm-stat">
          <span>Verified records</span>
          <strong>{verifiedCount}</strong>
          <small>Marked as verified</small>
        </div>

        <div className="sm-stat">
          <span>Prototype records</span>
          <strong>{schemes.length - verifiedCount}</strong>
          <small>Awaiting verification</small>
        </div>
      </div>

      {/* Inventory */}
      <section className="sm-panel">
        <div className="sm-panel-heading">
          <div>
            <h3>Scheme catalogue</h3>
            <p>Search, review and manage your records.</p>
          </div>
          <span className="sm-record-count">
            {filteredSchemes.length} records
          </span>
        </div>

        <div className="sm-toolbar">
          <div className="sm-search">
            <Search size={17} />
            <input
              aria-label="Search schemes"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, category or description..."
            />
          </div>

          <select
            aria-label="Filter by verification status"
            className="sm-filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">All records</option>
            <option value="verified">Verified</option>
            <option value="prototype">Prototype</option>
          </select>
        </div>

        {filteredSchemes.length === 0 ? (
          <div className="sm-empty">
            <FilePlus2 size={28} />
            <h3>No schemes found</h3>
            <p>Try another search or add a new scheme.</p>
          </div>
        ) : (
          <div className="sm-scheme-list">
            {filteredSchemes.map((scheme) => (
              <article className="sm-scheme-row" key={scheme.id}>
                <div className="sm-scheme-icon">
                  <FilePlus2 size={20} />
                </div>

                <div className="sm-scheme-info">
                  <div className="sm-scheme-title-line">
                    <h4>{scheme.name}</h4>

                    <span
                      className={`sm-status ${
                        scheme.dataStatus === "verified"
                          ? "verified"
                          : "prototype"
                      }`}
                    >
                      {scheme.dataStatus === "verified" ? (
                        <ShieldCheck size={13} />
                      ) : (
                        <AlertCircle size={13} />
                      )}
                      {scheme.dataStatus === "verified"
                        ? "Verified"
                        : "Prototype"}
                    </span>
                  </div>

                  <p>{scheme.description}</p>

                  <div className="sm-scheme-meta">
                    <span>{scheme.category}</span>
                    <span>{scheme.criteria.length} criteria</span>
                    {scheme.lastVerifiedAt && (
                      <span>
                        <CalendarDays size={12} />
                        Verified {formatDate(scheme.lastVerifiedAt)}
                      </span>
                    )}
                    {scheme.sourceUrl && (
                      <a
                        href={scheme.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(event) => event.stopPropagation()}
                      >
                        Official source <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>

                <div className="sm-row-actions">
                  <button
                    type="button"
                    className="sm-icon-button"
                    title="Edit scheme"
                    aria-label={`Edit ${scheme.name}`}
                    onClick={() => openEditEditor(scheme)}
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    type="button"
                    className="sm-icon-button danger"
                    title="Delete scheme"
                    aria-label={`Delete ${scheme.name}`}
                    onClick={() => removeScheme(scheme)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Editor modal */}
      {editorOpen && (
        <div
          className="sm-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setEditorOpen(false);
            }
          }}
        >
          <section
            className="sm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sm-editor-title"
          >
            <div className="sm-modal-header">
              <div>
                <div className="sm-eyebrow">
                  {editingId ? "EDIT RECORD" : "NEW RECORD"}
                </div>
                <h2 id="sm-editor-title">
                  {editingId ? "Update scheme" : "Add a scheme"}
                </h2>
                <p>
                  Enter the scheme details and define its eligibility rules.
                </p>
              </div>

              <button
                type="button"
                className="sm-icon-button"
                aria-label="Close editor"
                onClick={() => setEditorOpen(false)}
              >
                <X size={19} />
              </button>
            </div>

            <form className="sm-editor-form" onSubmit={validateAndSave}>
              <div className="sm-form-section">
                <h3>Basic information</h3>

                <div className="sm-form-grid">
                  <label className="sm-form-field sm-span-two">
                    Scheme name
                    <input
                      required
                      value={draft.name}
                      onChange={(event) =>
                        updateDraft("name", event.target.value)
                      }
                      placeholder="e.g. Scholarship scheme"
                    />
                  </label>

                  <label className="sm-form-field">
                    Category
                    <input
                      required
                      list="sm-categories"
                      value={draft.category}
                      onChange={(event) =>
                        updateDraft("category", event.target.value)
                      }
                      placeholder="Select or enter category"
                    />
                    <datalist id="sm-categories">
                      {categories.map((category) => (
                        <option key={category} value={category} />
                      ))}
                    </datalist>
                  </label>

                  <label className="sm-form-field">
                    Benefit
                    <input
                      required
                      value={draft.benefit}
                      onChange={(event) =>
                        updateDraft("benefit", event.target.value)
                      }
                      placeholder="What does the applicant receive?"
                    />
                  </label>

                  <label className="sm-form-field sm-span-two">
                    Description
                    <textarea
                      required
                      rows={3}
                      value={draft.description}
                      onChange={(event) =>
                        updateDraft("description", event.target.value)
                      }
                      placeholder="Describe the scheme and its purpose..."
                    />
                  </label>
                </div>
              </div>

              <div className="sm-form-section">
                <div className="sm-rule-heading">
                  <div>
                    <h3>Eligibility criteria</h3>
                    <p>
                      Define the conditions used by the eligibility engine.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="sm-add-rule"
                    onClick={() =>
                      updateDraft("criteria", [
                        ...draft.criteria,
                        createRule(),
                      ])
                    }
                  >
                    <Plus size={15} />
                    Add rule
                  </button>
                </div>

                <div className="sm-rules">
                  {draft.criteria.map((rule, index) => (
                    <div className="sm-rule-card" key={index}>
                      <div className="sm-rule-card-top">
                        <strong>RULE {index + 1}</strong>

                        <button
                          type="button"
                          className="sm-remove-rule"
                          disabled={draft.criteria.length === 1}
                          title="Remove rule"
                          aria-label={`Remove rule ${index + 1}`}
                          onClick={() =>
                            updateDraft(
                              "criteria",
                              draft.criteria.filter(
                                (_, ruleIndex) => ruleIndex !== index
                              )
                            )
                          }
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className="sm-rule-grid">
                        <label className="sm-form-field">
                          Profile field
                          <select
                            value={rule.field}
                            onChange={(event) =>
                              changeRuleField(
                                index,
                                event.target.value as keyof UserProfile
                              )
                            }
                          >
                            {profileFields.map((field) => (
                              <option
                                key={field.value}
                                value={field.value}
                              >
                                {field.label}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="sm-form-field">
                          Condition
                          <select
                            value={rule.operator}
                            onChange={(event) =>
                              updateRule(index, {
                                operator: event.target.value as RuleOperator,
                                value: "",
                              })
                            }
                          >
                            {getOperators(rule.field).map((operator) => (
                              <option
                                key={operator.value}
                                value={operator.value}
                              >
                                {operator.label}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="sm-form-field sm-span-two">
                          Required value
                          {rule.field === "education" &&
                          rule.operator === "educationAtLeast" ? (
                            <select
                              value={String(rule.value)}
                              onChange={(event) =>
                                updateRule(index, {
                                  value: event.target.value,
                                })
                              }
                            >
                              <option value="">Select minimum education</option>
                              {educationLevels.map((level) => (
                                <option key={level} value={level}>
                                  {level}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type={
                                (rule.field === "age" ||
                                  rule.field === "annualIncome") &&
                                rule.operator !== "oneOf"
                                  ? "number"
                                  : "text"
                              }
                              value={getRuleValue(rule)}
                              onChange={(event) =>
                                updateRule(index, {
                                  value: parseRuleValue(
                                    rule,
                                    event.target.value
                                  ),
                                })
                              }
                              placeholder={
                                rule.operator === "oneOf"
                                  ? "Enter comma-separated values"
                                  : "Enter required value"
                              }
                            />
                          )}
                          {rule.operator === "oneOf" && (
                            <small>
                              Separate multiple accepted values with commas.
                            </small>
                          )}
                        </label>

                        <label className="sm-form-field sm-span-two">
                          Rule description
                          <input
                            value={rule.label}
                            onChange={(event) =>
                              updateRule(index, {
                                label: event.target.value,
                              })
                            }
                            placeholder="e.g. Applicant must be at least 18 years old"
                          />
                        </label>

                        <label className="sm-form-field">
                          Weight (0–100)
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={rule.weight}
                            onChange={(event) =>
                              updateRule(index, {
                                weight: Number(event.target.value),
                              })
                            }
                          />
                        </label>

                        <label className="sm-mandatory">
                          <input
                            type="checkbox"
                            checked={rule.mandatory}
                            onChange={(event) =>
                              updateRule(index, {
                                mandatory: event.target.checked,
                              })
                            }
                          />
                          <span>
                            <strong>Mandatory rule</strong>
                            <small>
                              Failure can disqualify an applicant.
                            </small>
                          </span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sm-form-section">
                <h3>Source and verification</h3>

                <div className="sm-form-grid">
                  <label className="sm-form-field sm-span-two">
                    Official source URL
                    <input
                      type="url"
                      value={draft.sourceUrl ?? ""}
                      onChange={(event) =>
                        updateDraft("sourceUrl", event.target.value || null)
                      }
                      placeholder="https://official-government-website.gov.in"
                    />
                  </label>

                  <label className="sm-form-field">
                    Data status
                    <select
                      value={draft.dataStatus}
                      onChange={(event) =>
                        updateDraft(
                          "dataStatus",
                          event.target.value as Scheme["dataStatus"]
                        )
                      }
                    >
                      <option value="prototype">
                        Prototype — unverified
                      </option>
                      <option value="verified">
                        Verified
                      </option>
                    </select>
                  </label>

                  <label className="sm-form-field">
                    Last verified date
                    <input
                      type="date"
                      value={draft.lastVerifiedAt ?? ""}
                      onChange={(event) =>
                        updateDraft(
                          "lastVerifiedAt",
                          event.target.value || null
                        )
                      }
                    />
                  </label>
                </div>

                {draft.dataStatus === "verified" && (
                  <div className="sm-verification-note">
                    <ShieldCheck size={17} />
                    A source URL is required for a verified record.
                    Only mark a scheme verified after checking the official source.
                  </div>
                )}
              </div>

              {error && (
                <div className="sm-error">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <div className="sm-modal-footer">
                <button
                  type="button"
                  className="sm-cancel-button"
                  onClick={() => setEditorOpen(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="sm-primary-button">
                  <CheckCircle2 size={16} />
                  {editingId ? "Save changes" : "Create scheme"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
