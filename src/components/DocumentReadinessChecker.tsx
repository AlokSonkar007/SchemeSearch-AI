import { useMemo, useState } from "react";
import { CheckCircle2, ClipboardCheck, FileText, ShieldCheck } from "lucide-react";
import type { Scheme } from "../types/scheme";

type Props = { schemes: Scheme[] };
type ChecklistState = Record<string, string[]>;
const STORAGE_KEY = "schemesearch_document_checklist_v1";

function readChecklist(): ChecklistState {
  try { const value = localStorage.getItem(STORAGE_KEY); return value ? JSON.parse(value) as ChecklistState : {}; }
  catch { return {}; }
}

function getDocuments(scheme: Scheme): string[] {
  const name = scheme.name.toLowerCase();
  const category = scheme.category.toLowerCase();
  const docs = ["Identity proof (Aadhaar or another accepted ID)", "Recent passport-size photograph", "Bank account proof (passbook or cancelled cheque)", "Address or domicile proof"];
  if (category.includes("education") || /scholarship|student|school|college|tuition/.test(name)) {
    docs.push("Latest marksheet or academic result", "Bonafide certificate / proof of current admission", "Fee receipt or course details");
    if (/sc |st |obc|caste|backward|yasasvi/i.test(name)) docs.push("Valid caste / category certificate");
  } else if (/farmer|kisan|krishak|agriculture|crop/.test(name) || category.includes("agriculture")) {
    docs.push("Land ownership / land record documents", "Farmer registration or cultivation proof");
  } else if (/housing|awas|house/.test(name) || category.includes("housing")) {
    docs.push("Income certificate", "Current house / land ownership details");
  } else if (/pension|widow|old age|disability/.test(name) || category.includes("social security")) {
    docs.push("Age proof", "Income certificate", "Relevant widow / disability / pension supporting certificate");
  } else if (/enterprise|udyami|swarojgar|msme|odop|vishwakarma|employment|business/.test(name) || category.includes("business") || category.includes("employment")) {
    docs.push("Income certificate (where required)", "Project report or proposed business plan", "Education / skill / artisan certificate, if applicable");
  } else {
    docs.push("Income certificate (where required)", "Supporting certificate relevant to this scheme");
  }
  return Array.from(new Set(docs));
}

export default function DocumentReadinessChecker({ schemes }: Props) {
  const [selectedId, setSelectedId] = useState(schemes[0]?.id ?? "");
  const [checkedByScheme, setCheckedByScheme] = useState<ChecklistState>(readChecklist);
  const selectedScheme = schemes.find((scheme) => scheme.id === selectedId) ?? schemes[0];
  const documents = useMemo(() => selectedScheme ? getDocuments(selectedScheme) : [], [selectedScheme]);
  const checked = selectedScheme ? checkedByScheme[selectedScheme.id] ?? [] : [];
  const completed = documents.filter((document) => checked.includes(document)).length;
  const progress = documents.length ? Math.round((completed / documents.length) * 100) : 0;

  const toggleDocument = (document: string) => {
    if (!selectedScheme) return;
    const current = checkedByScheme[selectedScheme.id] ?? [];
    const next = current.includes(document) ? current.filter((item) => item !== document) : [...current, document];
    const updated = { ...checkedByScheme, [selectedScheme.id]: next };
    setCheckedByScheme(updated);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch { /* Current-session checklist remains usable. */ }
  };

  if (!selectedScheme) return <section className="panel feature-empty"><h3>No schemes available</h3><p>Add a scheme first to prepare its document checklist.</p></section>;

  return <div className="feature-page">
    <section className="feature-hero"><div className="feature-hero-icon"><ClipboardCheck size={25} /></div><div><span className="feature-eyebrow">APPLICATION PREPARATION</span><h2>Document Readiness Checker</h2><p>Prepare a simple document checklist for a scheme before starting its application.</p></div></section>
    <section className="panel feature-panel">
      <div className="feature-toolbar"><div><h3>Select a scheme</h3><p>The suggested checklist changes according to the scheme category and name.</p></div>
        <select className="feature-select" value={selectedScheme.id} onChange={(event) => setSelectedId(event.target.value)}>
          {schemes.map((scheme) => <option key={scheme.id} value={scheme.id}>{scheme.name}</option>)}
        </select>
      </div>
      <div className="feature-progress-card"><div className="feature-progress-copy"><div><strong>{completed} of {documents.length} items ready</strong><span>{progress === 100 ? "Checklist completed" : "Tick each item when you have it ready"}</span></div><b>{progress}%</b></div><div className="feature-progress-track"><div style={{ width: progress + "%" }} /></div></div>
      <div className="feature-checklist">
        {documents.map((document) => {
          const isChecked = checked.includes(document);
          return <label className={["feature-document-row", isChecked && "is-checked"].filter(Boolean).join(" ")} key={document}>
            <input type="checkbox" checked={isChecked} onChange={() => toggleDocument(document)} />
            <span className="feature-document-icon">{isChecked ? <CheckCircle2 size={18} /> : <FileText size={18} />}</span>
            <span className="feature-document-name">{document}</span><span className="feature-document-status">{isChecked ? "Ready" : "Pending"}</span>
          </label>;
        })}
      </div>
      <div className="feature-note"><ShieldCheck size={17} /><span>This is a preparation checklist only. No files are uploaded or stored. The final document list may differ by state, portal and applicant category—confirm it on the official scheme portal.</span></div>
    </section>
  </div>;
}
