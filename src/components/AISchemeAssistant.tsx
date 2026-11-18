import { useMemo, useState } from "react";
import { Bot, ExternalLink, MessageCircle, Send, Sparkles } from "lucide-react";
import type { UserProfile } from "./ProfileWizard";
import type { Scheme, EligibilityResult } from "../types/scheme";
import { recommendSchemes } from "../lib/eligibility";

type Props = {
  profile: UserProfile | null;
  schemes: Scheme[];
  onViewScheme: (id: string) => void;
};
type Message = { id: string; role: "user" | "assistant"; text: string; schemes?: Scheme[] };
const suggestions = [
  "Show schemes matching my profile",
  "What documents are commonly needed?",
  "Show pension schemes",
  "How do I apply for a scheme?",
];

function getRelevantSchemes(query: string, schemes: Scheme[]): Scheme[] {
  const q = query.toLowerCase();
  const terms = q.split(/[^a-z0-9]+/).filter((word) => word.length > 2 && !["the", "and", "for", "are", "what", "how", "show", "scheme", "schemes", "with", "from", "need", "about"].includes(word));
  return schemes.map((scheme) => {
    const haystack = [scheme.name, scheme.category, scheme.description, scheme.benefit].join(" ").toLowerCase();
    let score = 0;
    if (q.includes(scheme.name.toLowerCase())) score += 20;
    if (q.includes(scheme.category.toLowerCase())) score += 8;
    for (const term of terms) {
      if (scheme.name.toLowerCase().includes(term)) score += 5;
      else if (scheme.category.toLowerCase().includes(term)) score += 4;
      else if (haystack.includes(term)) score += 1;
    }
    return { scheme, score };
  }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 4).map((item) => item.scheme);
}

function suggestedDocuments(scheme?: Scheme): string[] {
  const text = [scheme?.name, scheme?.category].join(" ").toLowerCase();
  const docs = ["Identity proof", "Recent photograph", "Bank account details", "Address / domicile proof"];
  if (/scholarship|education|student|school|college/.test(text)) docs.push("Latest marksheet", "Admission / bonafide certificate", "Fee receipt", "Caste certificate, if applicable");
  else if (/farmer|kisan|agriculture|krishak/.test(text)) docs.push("Land or cultivation records", "Farmer registration details");
  else if (/pension|widow|old age|disability/.test(text)) docs.push("Age proof", "Income certificate", "Relevant pension / disability / widow certificate");
  else if (/business|enterprise|udyami|msme|odop|swarojgar/.test(text)) docs.push("Income certificate, if required", "Project report", "Skill / education proof, if applicable");
  else docs.push("Income certificate, if required", "Scheme-specific supporting certificate");
  return docs;
}

function buildAnswer(query: string, profile: UserProfile | null, schemes: Scheme[]) {
  const q = query.toLowerCase();
  const relevant = getRelevantSchemes(query, schemes);
  if (/eligible|eligibility|match|recommend|suitable|for me|my profile/.test(q)) {
    if (!profile) return { text: "Complete and save your profile first. Then I can compare it with the eligibility rules currently stored for each scheme.", schemes: [] as Scheme[] };
    const results: EligibilityResult[] = recommendSchemes(profile, schemes);
    const likely = results.filter((item) => item.status === "potentially-eligible");
    const incomplete = results.filter((item) => item.status === "needs-information");
    const picks = [...likely, ...incomplete].slice(0, 4).map((item) => item.scheme);
    return {
      text: "I checked " + results.length + " scheme records against your saved profile. " + likely.length + " are potential matches and " + incomplete.length + " need more information. Here are the strongest records to review. A potential match is not an official eligibility decision.",
      schemes: picks,
    };
  }

  if (/document|paper|certificate|documents/.test(q)) {
    const selected = relevant[0];
    const docs = suggestedDocuments(selected);
    return {
      text: (selected ? "For " + selected.name + ", these are common preparation items:\n" : "Common preparation items include:\n") + docs.map((item) => "• " + item).join("\n") + "\n\nThe exact list may differ by portal, state and applicant category. Check the scheme's official instructions before applying.",
      schemes: selected ? [selected] : relevant.slice(0, 3),
    };
  }

  if (/apply|application|portal|official|website|link/.test(q)) {
    if (!relevant.length) return { text: "Search for a scheme by its name or topic, and I can show the source link recorded in this catalogue. Not every prototype record has a source link.", schemes: [] as Scheme[] };
    return {
      text: "These are the matching catalogue entries and the source links recorded for them. Open the scheme card to visit its listed source. Please confirm that the page is the correct current application portal.",
      schemes: relevant,
    };
  }

  if (/benefit|amount|money|financial|subsidy|pension|scholarship|how much/.test(q)) {
    if (!relevant.length) return { text: "Tell me the scheme name or a topic such as scholarship, pension, farming or housing. I’ll look for benefit information in the current catalogue.", schemes: [] as Scheme[] };
    return {
      text: relevant.map((scheme) => scheme.name + ": " + (scheme.benefit || "Benefit details are not recorded.") ).join("\n\n") + "\n\nAmounts and conditions may change. Treat these as catalogue summaries and verify the current notice before applying.",
      schemes: relevant,
    };
  }

  if (relevant.length) {
    return {
      text: "I found these catalogue entries related to your question. Open a card for the recorded eligibility criteria, benefit summary and source link. You can also ask about eligibility, benefits, documents or application steps.",
      schemes: relevant,
    };
  }
  return {
    text: "I couldn't find a close match in the current catalogue. Try a scheme name or a topic such as education, pension, farmer, housing, women empowerment or business. I can also check your saved profile against the catalogue.",
    schemes: [] as Scheme[],
  };
}

export default function AISchemeAssistant({ profile, schemes, onViewScheme }: Props) {
  const [messages, setMessages] = useState<Message[]>([{
    id: "welcome",
    role: "assistant",
    text: "Hi! Ask me about government schemes, profile matching, listed benefits, common documents or application links. I use the scheme information stored in this prototype.",
  }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const starterCards = useMemo(() => schemes.slice(0, 3), [schemes]);

  const sendMessage = (value: string) => {
    const question = value.trim();
    if (!question || busy) return;
    setBusy(true);
    const answer = buildAnswer(question, profile, schemes);
    setMessages((current) => [
      ...current,
      { id: "u-" + Date.now(), role: "user", text: question },
      { id: "a-" + (Date.now() + 1), role: "assistant", text: answer.text, schemes: answer.schemes },
    ]);
    setInput("");
    setBusy(false);
  };

  return <div className="feature-page">
    <section className="feature-hero"><div className="feature-hero-icon"><Bot size={25} /></div><div><span className="feature-eyebrow">CATALOGUE-POWERED GUIDE</span><h2>AI Scheme Assistant</h2><p>Ask questions about schemes, benefits, eligibility, documents and application sources.</p></div></section>
    <section className="panel assistant-panel">
      <div className="assistant-header"><div className="assistant-avatar"><Sparkles size={19} /></div><div><strong>SchemeSearch Assistant</strong><span><i /> Available · uses your scheme catalogue</span></div><span className="assistant-prototype-tag">Prototype</span></div>
      <div className="assistant-messages" aria-live="polite">
        {messages.map((message) => <div className={"assistant-message " + message.role} key={message.id}>
          <div className="assistant-message-icon">{message.role === "assistant" ? <Bot size={16} /> : <MessageCircle size={15} />}</div>
          <div className="assistant-message-body"><p>{message.text}</p>
            {message.schemes && message.schemes.length > 0 && <div className="assistant-result-list">
              {message.schemes.map((scheme) => <article className="assistant-result" key={scheme.id}>
                <div><strong>{scheme.name}</strong><span>{scheme.category} · {scheme.dataStatus === "verified" ? "Verified record" : "Prototype record"}</span><small>{scheme.benefit}</small></div>
                <div className="assistant-result-actions"><button className="secondary-button" onClick={() => onViewScheme(scheme.id)}>Details</button>{scheme.sourceUrl && <a href={scheme.sourceUrl} target="_blank" rel="noopener noreferrer" aria-label={"Open source for " + scheme.name}><ExternalLink size={15} /></a>}</div>
              </article>)}
            </div>}
          </div>
        </div>)}
      </div>
      <div className="assistant-suggestions">{suggestions.map((suggestion) => <button key={suggestion} onClick={() => sendMessage(suggestion)}>{suggestion}</button>)}</div>
      <form className="assistant-input-row" onSubmit={(event) => { event.preventDefault(); sendMessage(input); }}>
        <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask something about government schemes..." aria-label="Ask the scheme assistant" />
        <button type="submit" disabled={!input.trim() || busy} aria-label="Send message"><Send size={17} /></button>
      </form>
      <div className="assistant-disclaimer">This demo assistant searches and summarizes the local scheme catalogue; it does not use a live AI model or verify current government rules. Do not share sensitive personal information in chat.</div>
    </section>
    <div className="feature-note"><Sparkles size={16} /><span>Try asking: “Which scholarships can match me?”, “What documents are needed?” or “How much assistance does PM-KISAN list?”</span></div>
    {starterCards.length === 0 && <div className="feature-empty compact">No scheme records are available yet.</div>}
  </div>;
}
