import { useMemo, useState } from "react";
import { ExternalLink, Globe2, MapPin, Search, ShieldCheck } from "lucide-react";
import type { UserProfile } from "./ProfileWizard";
import type { Scheme } from "../types/scheme";
import { evaluateScheme } from "../lib/eligibility";
import indiaData from "../data/india_states_districts.json";

type Props = { schemes: Scheme[]; profile: UserProfile | null; language: "en" | "hi"; onViewScheme: (id: string) => void };
type StateData = { code: string; name: string; districts: { code: string; name: string }[] };
type Scope = "all" | "national" | "state";
const states = indiaData as StateData[];
const clean = (value: unknown) => String(value ?? "").trim().toLowerCase();

function matchesState(scheme: Scheme, selectedState: string): { included: boolean; national: boolean } {
  const rules = scheme.criteria.filter((rule) => rule.field === "state");
  if (!rules.length) return { included: true, national: true };
  const included = rules.some((rule) => {
    if (rule.operator === "equals") return clean(rule.value) === clean(selectedState);
    if (rule.operator === "oneOf" && Array.isArray(rule.value)) return rule.value.some((value) => clean(value) === clean(selectedState));
    return false;
  });
  return { included, national: false };
}

export default function StateSchemeExplorer({ schemes, profile, language, onViewScheme }: Props) {
  const [selectedState, setSelectedState] = useState(profile?.state || "Uttar Pradesh");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [scope, setScope] = useState<Scope>("all");
  const hi = language === "hi";
  const text = hi ? {
    eyebrow: "राज्य-आधारित खोज", title: "राज्यवार योजना एक्सप्लोरर",
    intro: "राज्य चुनें और अपने क्षेत्र में उपलब्ध राष्ट्रीय तथा राज्य-विशिष्ट योजनाएँ खोजें।",
    choose: "राज्य चुनें", search: "योजना या श्रेणी खोजें...", all: "सभी योजनाएँ",
    national: "राष्ट्रीय योजनाएँ", state: "राज्य-विशिष्ट", category: "श्रेणी",
    count: "योजनाएँ मिलीं", nationalTag: "राष्ट्रीय / केंद्र प्रायोजित",
    stateTag: "राज्य-विशिष्ट योजना", match: "प्रोफ़ाइल मिलान",
    details: "विवरण देखें", source: "आधिकारिक स्रोत", noResults: "कोई योजना नहीं मिली",
    noResultsHint: "खोज या फ़िल्टर बदलकर देखें।", prototype: "प्रोटोटाइप रिकॉर्ड",
    verified: "सत्यापित रिकॉर्ड", notAssessed: "प्रोफ़ाइल का मूल्यांकन नहीं हुआ",
    caveat: "राष्ट्रीय योजनाएँ सभी राज्यों के लिए सूचीबद्ध हैं। राज्य-विशिष्ट पहचान मौजूदा रिकॉर्ड में दिए गए राज्य नियमों पर आधारित है; यह सरकारी पोर्टल पर लाइव उपलब्धता की जाँच नहीं है।"
  } : {
    eyebrow: "STATE-BASED DISCOVERY", title: "State-wise Scheme Explorer",
    intro: "Choose a state to explore nationwide and state-specific government scheme records.",
    choose: "Choose a state", search: "Search scheme or category...", all: "All schemes",
    national: "Nationwide", state: "State-specific", category: "Category",
    count: "schemes found", nationalTag: "National / central scheme",
    stateTag: "State-specific scheme", match: "Profile match",
    details: "View details", source: "Official source", noResults: "No schemes found",
    noResultsHint: "Try changing the search or filters.", prototype: "Prototype record",
    verified: "Verified record", notAssessed: "Profile not assessed",
    caveat: "Nationwide records are shown for every state. State-specific matching uses state rules stored in this catalogue; this is not a live check of government portal availability."
  };
  const categories = useMemo(() => ["All", ...Array.from(new Set(schemes.map((scheme) => scheme.category))).sort()], [schemes]);
  const visible = useMemo(() => schemes.filter((scheme) => {
    const stateMatch = matchesState(scheme, selectedState);
    if (!stateMatch.included) return false;
    if (scope === "national" && !stateMatch.national) return false;
    if (scope === "state" && stateMatch.national) return false;
    if (category !== "All" && scheme.category !== category) return false;
    return [scheme.name, scheme.category, scheme.description].join(" ").toLowerCase().includes(query.toLowerCase());
  }), [schemes, selectedState, scope, category, query]);

  return <div className="feature-page">
    <section className="feature-hero"><div className="feature-hero-icon"><Globe2 size={25} /></div><div><span className="feature-eyebrow">{text.eyebrow}</span><h2>{text.title}</h2><p>{text.intro}</p></div></section>
    <section className="panel feature-panel">
      <div className="state-explorer-toolbar">
        <label className="state-select-label"><span><MapPin size={15} /> {text.choose}</span><select className="feature-select" value={selectedState} onChange={(event) => setSelectedState(event.target.value)}>{states.map((item) => <option key={item.code} value={item.name}>{item.name}</option>)}</select></label>
        <label className="feature-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={text.search} /></label>
      </div>
      <div className="state-explorer-filters">
        {([["all", text.all], ["national", text.national], ["state", text.state]] as [Scope, string][]).map(([value, label]) => <button key={value} className={["feature-filter", scope === value && "active"].filter(Boolean).join(" ")} onClick={() => setScope(value)}>{label}</button>)}
        <label className="state-category-filter"><span>{text.category}</span><select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option value={item} key={item}>{item === "All" ? text.all : item}</option>)}</select></label>
      </div>
      <div className="state-explorer-count"><strong>{visible.length}</strong> {text.count} · {selectedState}</div>
      <div className="state-scheme-grid">
        {visible.map((scheme) => {
          const stateMatch = matchesState(scheme, selectedState);
          const assessment = profile ? evaluateScheme({ ...profile, state: selectedState }, scheme) : null;
          return <article className="state-scheme-card" key={scheme.id}>
            <div className="state-scheme-card-top"><span className="state-scheme-category">{scheme.category}</span><span className={["state-scheme-scope", stateMatch.national ? "national" : "specific"].join(" ")}>{stateMatch.national ? text.nationalTag : text.stateTag}</span></div>
            <h3>{scheme.name}</h3><p>{scheme.description}</p>
            <div className="state-scheme-benefit"><span>{hi ? "सूचीबद्ध लाभ" : "Listed benefit"}</span><strong>{scheme.benefit || (hi ? "विवरण उपलब्ध नहीं" : "Details not recorded")}</strong></div>
            <div className="state-scheme-meta"><span>{scheme.dataStatus === "verified" ? text.verified : text.prototype}</span>{assessment ? <strong>{text.match}: {assessment.matchScore}%</strong> : <span>{text.notAssessed}</span>}</div>
            <div className="state-scheme-actions"><button className="secondary-button" onClick={() => onViewScheme(scheme.id)}>{text.details}</button>{scheme.sourceUrl && <a href={scheme.sourceUrl} target="_blank" rel="noopener noreferrer">{text.source} <ExternalLink size={13} /></a>}</div>
          </article>;
        })}
        {visible.length === 0 && <div className="feature-empty compact"><Search size={22} /><strong>{text.noResults}</strong><span>{text.noResultsHint}</span></div>}
      </div>
    </section>
    <div className="feature-note"><ShieldCheck size={16} /><span>{text.caveat}</span></div>
  </div>;
}
