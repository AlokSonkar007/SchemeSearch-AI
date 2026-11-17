import {
  Search,
  CheckCircle2,
  XCircle,
  CircleHelp,
  ArrowRight,
  ShieldCheck,
  Bookmark,
  BookmarkCheck,
  Eye,
} from "lucide-react";

import type { UserProfile } from "./ProfileWizard";
import type { Scheme } from "../types/scheme";
import { recommendSchemes } from "../lib/eligibility";

type Props = {
  profile: UserProfile | null;
  schemes: Scheme[];
  savedSchemeIds: string[];
  onCompleteProfile: () => void;
  onToggleSave: (id: string) => void;
  onViewScheme: (id: string) => void;
};

const statusLabels = {
  "potentially-eligible": "Potentially eligible",
  "needs-information": "More information needed",
  "not-eligible": "Mandatory condition failed",
};

export default function Recommendations({
  profile,
  schemes,
  savedSchemeIds,
  onCompleteProfile,
  onToggleSave,
  onViewScheme,
}: Props) {
  if (!profile) {
    return (
      <section className="panel recommendation-empty">
        <div className="empty-icon">
          <Search size={26} />
        </div>
        <h3>Build your profile first</h3>
        <p>
          We need your personal, financial and educational information
          before evaluating relevant schemes.
        </p>
        <button className="primary-button" onClick={onCompleteProfile}>
          Complete my profile <ArrowRight size={16} />
        </button>
      </section>
    );
  }

  if (schemes.length === 0) {
    return (
      <section className="panel recommendation-empty">
        <div className="empty-icon">
          <Search size={26} />
        </div>
        <h3>No schemes available</h3>
        <p>
          There are currently no schemes to evaluate. Add schemes through
          the Manage Schemes section.
        </p>
      </section>
    );
  }

  const results = recommendSchemes(profile, schemes);

  const eligible = results.filter(
    (item) => item.status === "potentially-eligible"
  ).length;

  const needsInformation = results.filter(
    (item) => item.status === "needs-information"
  ).length;

  return (
    <div className="recommendation-page">
      <div className="prototype-warning">
        <ShieldCheck size={18} />
        <div>
          <strong>Scheme data notice</strong>
          <span>
            Scheme records may be illustrative or unverified. Always
            confirm eligibility and details through official sources.
          </span>
        </div>
      </div>

      <div className="recommendation-summary">
        <div className="summary-card">
          <span>Schemes evaluated</span>
          <strong>{results.length}</strong>
        </div>
        <div className="summary-card">
          <span>Potential matches</span>
          <strong>{eligible}</strong>
        </div>
        <div className="summary-card">
          <span>Need more information</span>
          <strong>{needsInformation}</strong>
        </div>
      </div>

      <div className="results-heading">
        <div>
          <h2>Your scheme matches</h2>
          <p>
            Ranked using mandatory eligibility and weighted criteria.
          </p>
        </div>
        <button className="secondary-button" onClick={onCompleteProfile}>
          Edit profile
        </button>
      </div>

      <div className="scheme-results">
        {results.map((result, index) => {
          const saved = savedSchemeIds.includes(result.scheme.id);

          return (
            <article className="scheme-result-card" key={result.scheme.id}>
              <div className="result-top">
                <div className="result-category">
                  {result.scheme.category}
                </div>

                {index === 0 &&
                  result.status === "potentially-eligible" && (
                    <span className="top-match">TOP MATCH</span>
                  )}
              </div>

              <h3>{result.scheme.name}</h3>

              <p className="result-description">
                {result.scheme.description}
              </p>

              <div className="result-score-row">
                <div>
                  <strong>{result.matchScore}%</strong>
                  <span>Profile match</span>
                </div>

                <span className={`result-status ${result.status}`}>
                  {statusLabels[result.status]}
                </span>
              </div>

              <div className="match-progress">
                <div style={{ width: `${result.matchScore}%` }} />
              </div>

              <div className="coverage-note">
                Information coverage: {result.informationCoverage}%
              </div>

              <div className="criteria-list">
                {result.criteria.map((item, i) => (
                  <div
                    className="criteria-row"
                    key={`${result.scheme.id}-${i}`}
                  >
                    {item.status === "met" ? (
                      <CheckCircle2
                        size={16}
                        className="criterion-met"
                      />
                    ) : item.status === "not-met" ? (
                      <XCircle
                        size={16}
                        className="criterion-failed"
                      />
                    ) : (
                      <CircleHelp
                        size={16}
                        className="criterion-missing"
                      />
                    )}

                    <span>{item.rule.label}</span>

                    <small>
                      {item.status === "met"
                        ? "Met"
                        : item.status === "not-met"
                          ? "Not met"
                          : "Unknown"}
                    </small>
                  </div>
                ))}
              </div>

              <div className="scheme-benefit">
                <span>Indicative benefit</span>
                <strong>{result.scheme.benefit}</strong>
              </div>

              <div className="result-footer">
                <span>
                  {result.scheme.dataStatus === "verified"
                    ? "Verified record"
                    : "Sample record · Not verified"}
                </span>
              </div>

              <div className="recommendation-card-actions">
                <button
                  className="secondary-button"
                  onClick={() => onViewScheme(result.scheme.id)}
                >
                  <Eye size={15} /> Details
                </button>

                <button
                  className={`secondary-button ${
                    saved ? "saved-action" : ""
                  }`}
                  onClick={() => onToggleSave(result.scheme.id)}
                >
                  {saved ? (
                    <BookmarkCheck size={15} />
                  ) : (
                    <Bookmark size={15} />
                  )}
                  {saved ? "Saved" : "Save scheme"}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="recommendation-disclaimer">
        <ShieldCheck size={17} />
        Match scores indicate profile alignment only. They do not guarantee
        eligibility, application acceptance or government approval.
      </div>
    </div>
  );
}
