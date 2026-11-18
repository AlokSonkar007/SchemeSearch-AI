import { useMemo, useState, type FormEvent } from "react";
import { BellRing, CalendarClock, CheckCircle2, Clock3, Plus, Trash2 } from "lucide-react";
import type { Scheme } from "../types/scheme";
import type { SchemeApplication } from "../types/application";

type Props = { schemes: Scheme[]; applications: SchemeApplication[]; language: "en" | "hi" };
type Reminder = { id: string; title: string; schemeId: string; dueDate: string; type: string; notes: string; done: boolean; createdAt: string };
const STORAGE_KEY = "schemesearch_smart_reminders_v1";
const today = () => new Date().toISOString().slice(0, 10);
const addDays = (source: string, days: number) => {
  const date = new Date(source);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};
function readReminders(): Reminder[] {
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) as Reminder[] : []; }
  catch { return []; }
}
function getId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now());
}

export default function SmartAlerts({ schemes, applications, language }: Props) {
  const [reminders, setReminders] = useState<Reminder[]>(readReminders);
  const [title, setTitle] = useState("");
  const [schemeId, setSchemeId] = useState(schemes[0]?.id ?? "");
  const [dueDate, setDueDate] = useState(addDays(today(), 7));
  const [kind, setKind] = useState("Follow-up");
  const [notes, setNotes] = useState("");
  const hi = language === "hi";
  const text = hi ? {
    eyebrow: "आवेदन और समय-सीमा ट्रैकर", title: "स्मार्ट रिमाइंडर",
    intro: "अपने रिमाइंडर जोड़ें और आवेदन की स्थिति के आधार पर सुझाए गए अगले कदम देखें।",
    auto: "सुझाए गए अगले कदम", manual: "मेरे रिमाइंडर", create: "रिमाइंडर जोड़ें",
    reminderTitle: "रिमाइंडर का नाम", titlePlaceholder: "जैसे आय प्रमाणपत्र बनवाएँ",
    scheme: "योजना", due: "तारीख", type: "प्रकार", notes: "नोट्स (वैकल्पिक)",
    notesPlaceholder: "ज़रूरी विवरण लिखें...", add: "रिमाइंडर सेव करें",
    done: "पूरा हुआ", markDone: "पूरा चिह्नित करें", remove: "हटाएँ",
    overdue: "समय-सीमा निकल गई", today: "आज देय", upcoming: "आगामी",
    emptyAuto: "अभी कोई स्वचालित सुझाव नहीं है। आवेदन ट्रैक करना शुरू करें।",
    emptyManual: "अभी कोई रिमाइंडर नहीं है। ऊपर से एक जोड़ें।",
    preparing: "दस्तावेज़ तैयारी पूरी करें", submitted: "आवेदन की स्थिति जाँचें",
    interested: "योजना की शर्तें और दस्तावेज़ देखें",
    suggestion: "आपके ट्रैकर की स्थिति से सुझाया गया",
    caveat: "ये रिमाइंडर इसी ब्राउज़र में सेव होते हैं। यह डेमो पुश नोटिफ़िकेशन या ईमेल नहीं भेजता; सुझाई गई तारीखें केवल शुरुआती संकेत हैं।"
  } : {
    eyebrow: "APPLICATION & DEADLINE TRACKER", title: "Smart Alerts & Reminders",
    intro: "Create reminders and see suggested next steps based on your application tracker.",
    auto: "Suggested next steps", manual: "My reminders", create: "Create a reminder",
    reminderTitle: "Reminder title", titlePlaceholder: "e.g. Arrange income certificate",
    scheme: "Scheme", due: "Due date", type: "Type", notes: "Notes (optional)",
    notesPlaceholder: "Add useful details...", add: "Save reminder",
    done: "Completed", markDone: "Mark complete", remove: "Remove",
    overdue: "Overdue", today: "Due today", upcoming: "Upcoming",
    emptyAuto: "No automatic suggestions yet. Start tracking a scheme application.",
    emptyManual: "No reminders yet. Create one using the form above.",
    preparing: "Complete document preparation", submitted: "Check application status",
    interested: "Review scheme requirements and documents",
    suggestion: "Suggested from your application status",
    caveat: "Reminders are saved in this browser only. This demo does not send push notifications or emails; suggested dates are starting prompts, not official deadlines."
  };

  const automatic = useMemo(() => applications.filter((item) => ["interested", "preparing", "submitted"].includes(item.status)).map((item) => {
    const scheme = schemes.find((record) => record.id === item.schemeId);
    const dateSource = item.updatedAt || item.createdAt || new Date().toISOString();
    const config = item.status === "submitted"
      ? { title: text.submitted, dueDate: addDays(dateSource, 14), type: "Follow-up" }
      : item.status === "preparing"
        ? { title: text.preparing, dueDate: addDays(dateSource, 3), type: "Documents" }
        : { title: text.interested, dueDate: addDays(dateSource, 7), type: "Preparation" };
    return { id: item.id, schemeId: item.schemeId, schemeName: scheme?.name ?? "Unavailable scheme", ...config };
  }), [applications, schemes, text.preparing, text.submitted, text.interested]);

  const persist = (updated: Reminder[]) => {
    setReminders(updated);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch { /* Current session remains usable. */ }
  };
  const createReminder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !dueDate) return;
    persist([...reminders, { id: getId(), title: title.trim(), schemeId, dueDate, type: kind, notes: notes.trim(), done: false, createdAt: new Date().toISOString() }]);
    setTitle(""); setNotes(""); setDueDate(addDays(today(), 7));
  };
  const dueStatus = (date: string, done: boolean) => done ? text.done : date < today() ? text.overdue : date === today() ? text.today : text.upcoming;
  const statusClass = (date: string, done: boolean) => done ? "done" : date < today() ? "overdue" : date === today() ? "today" : "upcoming";

  return <div className="feature-page">
    <section className="feature-hero"><div className="feature-hero-icon"><BellRing size={25} /></div><div><span className="feature-eyebrow">{text.eyebrow}</span><h2>{text.title}</h2><p>{text.intro}</p></div></section>
    <section className="panel feature-panel">
      <div className="panel-heading"><div><h3>{text.create}</h3><p>{hi ? "योजना से जुड़ी अपनी अगली तारीख याद रखें।" : "Keep important application dates in one place."}</p></div><CalendarClock size={21} color="#7794bf" /></div>
      <form className="reminder-form" onSubmit={createReminder}>
        <label><span>{text.reminderTitle}</span><input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder={text.titlePlaceholder} /></label>
        <label><span>{text.scheme}</span><select value={schemeId} onChange={(event) => setSchemeId(event.target.value)}><option value="">{hi ? "योजना चुनें" : "Choose a scheme"}</option>{schemes.map((scheme) => <option key={scheme.id} value={scheme.id}>{scheme.name}</option>)}</select></label>
        <label><span>{text.due}</span><input required type="date" value={dueDate} min={today()} onChange={(event) => setDueDate(event.target.value)} /></label>
        <label><span>{text.type}</span><select value={kind} onChange={(event) => setKind(event.target.value)}><option value="Follow-up">{hi ? "फ़ॉलो-अप" : "Follow-up"}</option><option value="Documents">{hi ? "दस्तावेज़" : "Documents"}</option><option value="Application">{hi ? "आवेदन" : "Application"}</option><option value="Other">{hi ? "अन्य" : "Other"}</option></select></label>
        <label className="reminder-form-wide"><span>{text.notes}</span><textarea rows={2} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder={text.notesPlaceholder} /></label>
        <button className="primary-button reminder-submit" type="submit"><Plus size={16} /> {text.add}</button>
      </form>
    </section>
    <section className="panel feature-panel">
      <div className="panel-heading"><div><h3>{text.auto}</h3><p>{hi ? "ट्रैकर की मौजूदा स्थिति से बने सुझाव" : "Generated from your current application statuses"}</p></div><BellRing size={20} color="#7794bf" /></div>
      <div className="reminder-list">
        {automatic.map((item) => <article className="reminder-item" key={item.id}><div className="reminder-icon"><Clock3 size={18} /></div><div className="reminder-copy"><strong>{item.title}</strong><span>{item.schemeName}</span><small>{text.suggestion} · {item.type}</small></div><div className="reminder-date-block"><strong>{new Date(item.dueDate + "T00:00:00").toLocaleDateString(hi ? "hi-IN" : "en-IN")}</strong><span className={["reminder-status", statusClass(item.dueDate, false)].join(" ")}>{dueStatus(item.dueDate, false)}</span></div></article>)}
        {automatic.length === 0 && <div className="feature-empty compact"><CalendarClock size={22} /><strong>{text.emptyAuto}</strong></div>}
      </div>
    </section>
    <section className="panel feature-panel">
      <div className="panel-heading"><div><h3>{text.manual}</h3><p>{reminders.length} {hi ? "रिमाइंडर" : reminders.length === 1 ? "reminder" : "reminders"}</p></div><CheckCircle2 size={20} color="#6c987e" /></div>
      <div className="reminder-list">
        {reminders.slice().sort((a, b) => a.dueDate.localeCompare(b.dueDate)).map((item) => {
          const scheme = schemes.find((record) => record.id === item.schemeId);
          return <article className={["reminder-item", item.done && "is-done"].filter(Boolean).join(" ")} key={item.id}>
            <div className="reminder-icon"><CalendarClock size={18} /></div><div className="reminder-copy"><strong>{item.title}</strong><span>{scheme?.name ?? (hi ? "सामान्य रिमाइंडर" : "General reminder")} · {item.type}</span>{item.notes && <small>{item.notes}</small>}</div>
            <div className="reminder-date-block"><strong>{new Date(item.dueDate + "T00:00:00").toLocaleDateString(hi ? "hi-IN" : "en-IN")}</strong><span className={["reminder-status", statusClass(item.dueDate, item.done)].join(" ")}>{dueStatus(item.dueDate, item.done)}</span><div className="reminder-actions">{!item.done && <button onClick={() => persist(reminders.map((record) => record.id === item.id ? { ...record, done: true } : record))}>{text.markDone}</button>}<button className="remove" onClick={() => persist(reminders.filter((record) => record.id !== item.id))}><Trash2 size={13} /> {text.remove}</button></div></div>
          </article>;
        })}
        {reminders.length === 0 && <div className="feature-empty compact"><CalendarClock size={22} /><strong>{text.emptyManual}</strong></div>}
      </div>
    </section>
    <div className="feature-note"><BellRing size={16} /><span>{text.caveat}</span></div>
  </div>;
}
