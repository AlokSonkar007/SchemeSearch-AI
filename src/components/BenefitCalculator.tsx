import { useMemo, useState } from "react";
import { Calculator, Info, TrendingUp } from "lucide-react";
import type { UserProfile } from "./ProfileWizard";
import type { Scheme } from "../types/scheme";
import { evaluateScheme } from "../lib/eligibility";

type Props = { profile: UserProfile | null; schemes: Scheme[] };

function getListedAmount(text: string): number | null {
  const matches = Array.from(text.matchAll(/₹\s*([\d,]+(?:\.\d+)?)\s*(lakh|lac|crore|cr)?/gi));
  if (!matches.length) return null;
  const amounts = matches.map((match) => {
    const base = Number((match[1] || "").replace(/,/g, ""));
    const unit = (match[2] || "").toLowerCase();
    if (!Number.isFinite(base)) return 0;
    return Math.round(base * (unit === "lakh" || unit === "lac" ? 100000 : unit === "crore" || unit === "cr" ? 10000000 : 1));
  }).filter((value) => value > 0);
  return amounts.length ? Math.max(...amounts) : null;
}

const money = (value: number) => "₹" + Math.round(value).toLocaleString("en-IN");

export default function BenefitCalculator({ profile, schemes }: Props) {
  const [selectedId, setSelectedId] = useState(schemes[0]?.id ?? "");
  const [percentage, setPercentage] = useState(50);
  const [dailyWage, setDailyWage] = useState("300");
  const [days, setDays] = useState("100");
  const [months, setMonths] = useState("12");
  const selectedScheme = schemes.find((scheme) => scheme.id === selectedId) ?? schemes[0];
  const isMgnrega = Boolean(selectedScheme && /mgnrega|national rural employment guarantee/i.test(selectedScheme.name));
  const isPmKisan = Boolean(selectedScheme && /pm.?kisan/i.test(selectedScheme.name));
  const isPmSym = Boolean(selectedScheme && /shram yogi maandhan|pm-sym/i.test(selectedScheme.name));
  const listedAmount = useMemo(() => selectedScheme ? getListedAmount(selectedScheme.benefit) : null, [selectedScheme]);
  const assessment = profile && selectedScheme ? evaluateScheme(profile, selectedScheme) : null;

  const wageTotal = Math.max(0, Number(dailyWage) || 0) * Math.min(100, Math.max(0, Number(days) || 0));
  const pensionTotal = 3000 * Math.min(12, Math.max(1, Number(months) || 1));
  const estimatedAmount = isMgnrega ? wageTotal : isPmKisan ? 2000 * Math.min(3, Math.max(0, Number(months) || 0)) : isPmSym ? pensionTotal : listedAmount === null ? null : listedAmount * percentage / 100;

  if (!selectedScheme) return <section className="panel feature-empty"><h3>No schemes available</h3><p>Add schemes before using the calculator.</p></section>;

  return <div className="feature-page">
    <section className="feature-hero"><div className="feature-hero-icon"><Calculator size={25} /></div><div><span className="feature-eyebrow">ILLUSTRATIVE ESTIMATOR</span><h2>Benefit Calculator</h2><p>Explore an indicative amount using figures stored in the catalogue or your own scenario assumptions.</p></div></section>
    <section className="panel feature-panel">
      <div className="feature-toolbar"><div><h3>Select a scheme</h3><p>The calculator adapts to benefit details available for that record.</p></div>
        <select className="feature-select" value={selectedScheme.id} onChange={(event) => { setSelectedId(event.target.value); setPercentage(50); setMonths("12"); setDays("100"); }}>
          {schemes.map((scheme) => <option key={scheme.id} value={scheme.id}>{scheme.name}</option>)}
        </select>
      </div>
      <div className="calculator-benefit-card"><span>Benefit listed in catalogue</span><strong>{selectedScheme.benefit || "No amount or benefit details recorded"}</strong><small>{selectedScheme.dataStatus === "verified" ? "Record marked verified" : "Prototype record · confirm current guidelines"}</small></div>

      {isMgnrega ? <div className="calculator-input-grid">
        <label><span>Daily wage assumed (₹)</span><input type="number" min="0" value={dailyWage} onChange={(event) => setDailyWage(event.target.value)} /></label>
        <label><span>Work days (maximum 100)</span><input type="number" min="0" max="100" value={days} onChange={(event) => setDays(event.target.value)} /></label>
      </div> : isPmKisan ? <div className="calculator-input-grid">
        <label><span>Instalments counted (maximum 3)</span><input type="number" min="0" max="3" value={months} onChange={(event) => setMonths(event.target.value)} /></label>
        <div className="calculator-assumption"><strong>₹2,000 per instalment</strong><span>Based on the catalogue's stated ₹6,000 annual benefit in three equal instalments.</span></div>
      </div> : isPmSym ? <div className="calculator-input-grid">
        <label><span>Months of pension projected (1–12)</span><input type="number" min="1" max="12" value={months} onChange={(event) => setMonths(event.target.value)} /></label>
        <div className="calculator-assumption"><strong>₹3,000 per month</strong><span>Projection after the scheme's pension eligibility age; contribution obligations are not deducted here.</span></div>
      </div> : listedAmount !== null ? <div className="calculator-slider-block">
        <div><label htmlFor="benefit-percentage">Scenario percentage of listed amount</label><strong>{percentage}%</strong></div>
        <input id="benefit-percentage" type="range" min="0" max="100" step="5" value={percentage} onChange={(event) => setPercentage(Number(event.target.value))} />
        <div className="calculator-scale"><span>0%</span><span>100% of listed figure</span></div>
        <p>This slider creates an example scenario only; it is not a prediction of your approved benefit.</p>
      </div> : <div className="calculator-no-amount"><Info size={19} /><span>This scheme record does not contain a clear rupee amount. Check the official source for the current benefit before estimating.</span></div>}

      <div className="calculator-result">
        <div><span>Illustrative amount</span><strong>{estimatedAmount === null ? "Not available" : money(estimatedAmount)}</strong><small>{isMgnrega ? "Assumed daily wage × work days" : isPmKisan ? "₹2,000 × instalments counted" : isPmSym ? "₹3,000 × months projected" : "Share of the listed amount"}</small></div>
        <div className="calculator-result-icon"><TrendingUp size={23} /></div>
      </div>
      {assessment && <div className="calculator-match-note"><Info size={16} /><span>Your current profile assessment for this record: <strong>{assessment.status.replace(/-/g, " ")}</strong> ({assessment.matchScore}% match). This does not guarantee payment or approval.</span></div>}
      <div className="feature-note"><Info size={16} /><span>Estimates are for demonstration and planning only. They may omit caps, income rules, instalment conditions, contributions, state-specific rates, deductions and other requirements. Only the scheme authority can confirm the payable amount.</span></div>
    </section>
  </div>;
}
