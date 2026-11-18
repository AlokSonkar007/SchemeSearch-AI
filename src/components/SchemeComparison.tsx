import { useMemo, useState } from "react";
import { GitCompareArrows, Search, X } from "lucide-react";
import type { UserProfile } from "./ProfileWizard";
import type { Scheme } from "../types/scheme";
import { evaluateScheme } from "../lib/eligibility";

type Props = { profile: UserProfile | null; schemes: Scheme[]; onViewScheme: (id: string) => void; };
const statusLabel = { "potentially-eligible": "Potential match", "needs-information": "More information needed", "not-eligible": "Mandatory condition failed" };

export default function SchemeComparison({ profile, schemes, onViewScheme }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const filteredSchemes = useMemo(() => schemes.filter((scheme) => [scheme.name, scheme.category].join(" ").toLowerCase().includes(query.toLowerCase())), [schemes, query]);
  const selectedSchemes = selectedIds.map((id) => schemes.find((scheme) => scheme.id === id)).filter((scheme): scheme is Scheme => Boolean(scheme));
  const results = selectedSchemes.map((scheme) => ({ scheme, result: profile ? evaluateScheme(profile, scheme) : null }));

  const toggleScheme = (id: string) => {
    setMessage("");
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
      return;
    }
    if (selectedIds.length >= 3) {
      setMessage("You can compare up to 3 schemes at a time.");
      return;
    }
    setSelectedIds([...selectedIds, id]);
  };

  return <div className="feature-page">
    <section className="feature-hero"><div className="feature-hero-icon"><GitCompareArrows size={25} /></div><div><span className="feature-eyebrow">SIDE-BY-SIDE VIEW</span><h2>Compare Schemes</h2><p>Choose up to three schemes and compare their benefits, categories and profile match.</p></div></section>
    <section className="panel feature-panel">
      <div className="feature-toolbar"><div><h3>Choose schemes to compare</h3><p>{selectedIds.length} of 3 selected</p></div><label className="feature-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search schemes..." /></label></div>
      {message && <div className="feature-inline-message">{message}</div>}
      <div className="feature-choice-grid">
        {filteredSchemes.map((scheme) => {
          const selected = selectedIds.includes(scheme.id);
          const limitReached = selectedIds.length >= 3 && !selected;
          return <button type="button" key={scheme.id} className={["feature-choice", selected && "is-selected"].filter(Boolean).join(" ")} onClick={() => toggleScheme(scheme.id)} disabled={limitReached}>
            <span className="feature-choice-check">{selected ? "✓" : "+"}</span><span><strong>{scheme.name}</strong><small>{scheme.category}</small></span>
          </button>;
        })}
      </div>
      {selectedSchemes.length > 0 && <div className="feature-comparison">
        <div className="feature-comparison-heading"><div><h3>Comparison overview</h3><p>Match scores are calculated using your saved profile.</p></div><button className="feature-clear-button" onClick={() => setSelectedIds([])}><X size={15} /> Clear selection</button></div>
        <div className="feature-table-wrap"><table className="feature-table">
          <thead><tr><th>Details</th>{results.map(({ scheme }) => <th key={scheme.id}>{scheme.name}</th>)}</tr></thead>
          <tbody>
            <tr><th>Category</th>{results.map(({ scheme }) => <td key={scheme.id}>{scheme.category}</td>)}</tr>
            <tr><th>Listed benefit</th>{results.map(({ scheme }) => <td key={scheme.id}>{scheme.benefit || "Refer to official source"}</td>)}</tr>
            <tr><th>Profile match</th>{results.map(({ scheme, result }) => <td key={scheme.id}>{result ? String(result.matchScore) + "%" : "Complete profile"}</td>)}</tr>
            <tr><th>Eligibility status</th>{results.map(({ scheme, result }) => <td key={scheme.id}>{result ? <span className={["feature-status", result.status].join(" ")}>{statusLabel[result.status]}</span> : "Not assessed"}</td>)}</tr>
            <tr><th>Information coverage</th>{results.map(({ scheme, result }) => <td key={scheme.id}>{result ? String(result.informationCoverage) + "%" : "—"}</td>)}</tr>
            <tr><th>Dataset status</th>{results.map(({ scheme }) => <td key={scheme.id}>{scheme.dataStatus === "verified" ? "Verified record" : "Prototype record"}</td>)}</tr>
            <tr><th>Official source</th>{results.map(({ scheme }) => <td key={scheme.id}>{scheme.sourceUrl ? <a href={scheme.sourceUrl} target="_blank" rel="noopener noreferrer">Open source ↗</a> : "Not provided"}</td>)}</tr>
            <tr><th>Action</th>{results.map(({ scheme }) => <td key={scheme.id}><button className="secondary-button" onClick={() => onViewScheme(scheme.id)}>View details</button></td>)}</tr>
          </tbody>
        </table></div>
      </div>}
      {selectedSchemes.length === 0 && <div className="feature-empty compact"><GitCompareArrows size={25} /><strong>Select at least two schemes</strong><span>The comparison table will appear here. You can also compare a single scheme's details.</span></div>}
    </section>
    <div className="feature-note"><span>Comparison is based on the information currently stored in this prototype. Benefit descriptions and eligibility are not a final government determination.</span></div>
  </div>;
}
