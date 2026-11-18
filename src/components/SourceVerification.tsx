import { useMemo, useState } from "react";
import { BadgeCheck, ExternalLink, Search, ShieldCheck } from "lucide-react";
import type { Scheme } from "../types/scheme";

type Props = { schemes: Scheme[] };
type ReviewState = Record<string, string>;
type Filter = "all" | "pending" | "reviewed" | "missing";
const STORAGE_KEY = "schemesearch_source_reviews_v1";
function readReviews(): ReviewState {
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) as ReviewState : {}; } catch { return {}; }
}
function safeHttpUrl(value: string | null): string | null {
  if (!value) return null;
  try { const url = new URL(value); return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null; } catch { return null; }
}

export default function SourceVerification({ schemes }: Props) {
  const [reviews, setReviews] = useState<ReviewState>(readReviews);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const rows = useMemo(() => schemes.filter((scheme) => {
    const matchesQuery = [scheme.name, scheme.category].join(" ").toLowerCase().includes(query.toLowerCase());
    const hasSource = Boolean(safeHttpUrl(scheme.sourceUrl));
    const reviewed = Boolean(reviews[scheme.id]);
    const matchesFilter = filter === "all" || (filter === "pending" && hasSource && !reviewed) || (filter === "reviewed" && reviewed) || (filter === "missing" && !hasSource);
    return matchesQuery && matchesFilter;
  }), [schemes, reviews, filter, query]);
  const sourceCount = schemes.filter((scheme) => safeHttpUrl(scheme.sourceUrl)).length;
  const reviewedCount = schemes.filter((scheme) => Boolean(reviews[scheme.id])).length;
  const missingCount = schemes.length - sourceCount;

  const markReviewed = (schemeId: string) => {
    const updated = { ...reviews, [schemeId]: new Date().toISOString() };
    setReviews(updated);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch { /* Keep current-session state. */ }
  };
  const undoReview = (schemeId: string) => {
    const updated = { ...reviews }; delete updated[schemeId]; setReviews(updated);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch { /* Keep current-session state. */ }
  };

  return <div className="feature-page">
    <section className="feature-hero"><div className="feature-hero-icon"><ShieldCheck size={25} /></div><div><span className="feature-eyebrow">DATA QUALITY WORKSPACE</span><h2>Official Source Verification</h2><p>Review source links, identify missing references and record which entries you have checked.</p></div></section>
    <div className="feature-stats">
      <div className="feature-stat"><span>Scheme records</span><strong>{schemes.length}</strong></div><div className="feature-stat"><span>With source links</span><strong>{sourceCount}</strong></div><div className="feature-stat"><span>Reviewed by you</span><strong>{reviewedCount}</strong></div><div className="feature-stat"><span>Missing source links</span><strong>{missingCount}</strong></div>
    </div>
    <section className="panel feature-panel">
      <div className="feature-toolbar"><div><h3>Source review register</h3><p>Open the listed link, inspect it, then record your manual review.</p></div><label className="feature-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search scheme..." /></label></div>
      <div className="feature-filter-row">
        {([["all", "All records"], ["pending", "Pending review"], ["reviewed", "Reviewed"], ["missing", "Missing source"]] as [Filter, string][]).map(([value, label]) => <button key={value} className={["feature-filter", filter === value && "active"].filter(Boolean).join(" ")} onClick={() => setFilter(value)}>{label}</button>)}
      </div>
      <div className="feature-source-list">
        {rows.map((scheme) => {
          const url = safeHttpUrl(scheme.sourceUrl);
          const reviewedAt = reviews[scheme.id];
          return <article className="feature-source-row" key={scheme.id}>
            <div className="feature-source-main"><div className="feature-source-icon"><BadgeCheck size={19} /></div><div className="feature-source-copy">
              <strong>{scheme.name}</strong><span>{scheme.category} · {scheme.dataStatus === "verified" ? "Marked verified in dataset" : "Prototype record"}</span>
              {url ? <a href={url} target="_blank" rel="noopener noreferrer">{new URL(url).hostname} <ExternalLink size={12} /></a> : <em>No valid source URL recorded</em>}
            </div></div>
            <div className="feature-source-actions">{reviewedAt ? <><span className="feature-review-done">Reviewed {new Date(reviewedAt).toLocaleDateString()}</span><button className="feature-small-button" onClick={() => undoReview(scheme.id)}>Undo</button></> : url ? <button className="secondary-button" onClick={() => markReviewed(scheme.id)}>Mark reviewed</button> : <span className="feature-missing-label">Source needed</span>}</div>
          </article>;
        })}
        {rows.length === 0 && <div className="feature-empty compact"><Search size={22} /><strong>No records found</strong><span>Try another search or filter.</span></div>}
      </div>
    </section>
    <div className="feature-note"><ShieldCheck size={17} /><span>Manual review only: the app does not automatically verify government ownership, page contents or whether a link is still active. A “Reviewed” label means you recorded that you inspected the link; it does not certify the scheme data.</span></div>
  </div>;
}
