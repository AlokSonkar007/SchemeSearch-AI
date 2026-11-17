import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  XCircle,
  CircleHelp,
  ExternalLink,
  FileText,
  ShieldCheck,
} from "lucide-react";

import type { Scheme, EligibilityResult } from "../types/scheme";

type Props = {
  scheme: Scheme;
  result: EligibilityResult | null;
  isSaved: boolean;
  isTracked: boolean;
  onBack: () => void;
  onToggleSave: () => void;
  onTrack: () => void;
};

export default function SchemeDetails({
  scheme,
  result,
  isSaved,
  isTracked,
  onBack,
  onToggleSave,
  onTrack,
}: Props) {
  return (
    <div className="scheme-detail-page">
      <button className="back-link" onClick={onBack}>
        <ArrowLeft size={16} /> Back to schemes
      </button>

      <section className="panel scheme-detail-hero">
        <div className="detail-category">{scheme.category}</div>

        <div className="detail-title-row">
          <div>
            <h2>{scheme.name}</h2>
            <p>{scheme.description}</p>
          </div>

          <div className="detail-icon">
            <FileText size={30} />
          </div>
        </div>

        <div className="detail-benefit">
          <span>Listed benefit</span>
          <strong>{scheme.benefit || "See official scheme details"}</strong>
        </div>

        <div className="detail-actions">
          <button className="primary-button" onClick={onTrack}>
            {isTracked ? "Already tracking" : "Track this scheme"}
            <CheckCircle2 size={16} />
          </button>

          <button className="secondary-button" onClick={onToggleSave}>
            {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            {isSaved ? "Saved" : "Save scheme"}
          </button>

          {scheme.sourceUrl && (
            <a
              className="secondary-button official-link"
              href={scheme.sourceUrl}
              target="_blank"
              rel="noreferrer"
            >
              Official source <ExternalLink size={14} />
            </a>
          )}
        </div>
      </section>

      <div className="detail-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h3>Eligibility assessment</h3>
              <p>How your profile compares with the listed criteria</p>
            </div>
          </div>

          {result ? (
            <>
              <div className="detail-assessment">
                <strong>{result.matchScore}%</strong>
                <span>Profile match score</span>
                <div className="match-progress">
                  <div style={{ width: `${result.matchScore}%` }} />
                </div>
              </div>

              <div className="detail-criteria">
                {result.criteria.map((item, index) => (
                  <div className="criteria-row" key={`${scheme.id}-${index}`}>
                    {item.status === "met" ? (
                      <CheckCircle2 className="criterion-met" size={17} />
                    ) : item.status === "not-met" ? (
                      <XCircle className="criterion-failed" size={17} />
                    ) : (
                      <CircleHelp className="criterion-missing" size={17} />
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

              <p className="detail-explanation">
                {result.status === "potentially-eligible"
                  ? "All currently evaluated mandatory conditions are satisfied. Official verification is still required."
                  : result.status === "needs-information"
                    ? "Some mandatory information is missing. Complete your profile to evaluate this scheme further."
                    : "At least one mandatory condition is not satisfied under the current test criteria."}
              </p>
            </>
          ) : (
            <p className="detail-explanation">
              Complete your profile to evaluate this scheme against your
              circumstances.
            </p>
          )}
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <h3>Scheme information</h3>
              <p>Dataset and verification details</p>
            </div>
            <ShieldCheck size={21} color="#6b9b83" />
          </div>

          <div className="detail-information">
            <div>
              <span>Category</span>
              <strong>{scheme.category}</strong>
            </div>
            <div>
              <span>Data status</span>
              <strong>
                {scheme.dataStatus === "verified"
                  ? "Verified"
                  : "Prototype data"}
              </strong>
            </div>
            <div>
              <span>Criteria recorded</span>
              <strong>{scheme.criteria.length}</strong>
            </div>
            <div>
              <span>Mandatory conditions</span>
              <strong>
                {scheme.criteria.filter((rule) => rule.mandatory).length}
              </strong>
            </div>
          </div>

          {scheme.dataStatus === "prototype" && (
            <div className="prototype-warning detail-warning">
              <CircleHelp size={17} />
              <span>
                This is illustrative test data, not an official government
                scheme record. Do not use it to make application decisions.
              </span>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
