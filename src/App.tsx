import { useState } from "react";

import {
  Landmark,
  LayoutDashboard,
  Search,
  Bookmark,
  FileText,
  UserRound,
  Bell,
  ChevronDown,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  MapPin,
  CircleHelp,
  Menu,
  X,
  CheckCircle2,
  FilePlus2,
  ClipboardCheck,
  GitCompareArrows,
  BadgeCheck,
  Bot,
  Calculator,
  Globe,
  BellRing,
} from "lucide-react";

import ProfileWizard, {
  type UserProfile,
} from "./components/ProfileWizard";

import Recommendations from "./components/Recommendations";
import SavedSchemes from "./components/SavedSchemes";
import SchemeDetails from "./components/SchemeDetails";
import ApplicationTracker from "./components/ApplicationTracker";
import SchemeManager from "./components/SchemeManager";
import DocumentReadinessChecker from "./components/DocumentReadinessChecker";
import SchemeComparison from "./components/SchemeComparison";
import SourceVerification from "./components/SourceVerification";
import AISchemeAssistant from "./components/AISchemeAssistant";
import BenefitCalculator from "./components/BenefitCalculator";
import StateSchemeExplorer from "./components/StateSchemeExplorer";
import SmartAlerts from "./components/SmartAlerts";

import { schemes } from "./data/schemes";
import { recommendSchemes, evaluateScheme } from "./lib/eligibility";
import { storage } from "./lib/storage";

import type { Scheme } from "./types/scheme";

import type {
  ApplicationStatus,
  SchemeApplication,
} from "./types/application";

type Page =
  | "Overview"
  | "Find Schemes"
  | "My Profile"
  | "Saved Schemes"
  | "Applications"
  | "Document Readiness"
  | "Compare Schemes"
  | "Source Verification"
  | "AI Scheme Assistant"
  | "Benefit Calculator"
  | "State Explorer"
  | "Smart Alerts"
  | "Scheme Details"
  | "Manage Schemes";

const navigation: {
  label: Exclude<Page, "Scheme Details">;
  icon: typeof LayoutDashboard;
}[] = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Find Schemes", icon: Search },
  { label: "My Profile", icon: UserRound },
  { label: "Saved Schemes", icon: Bookmark },
  { label: "Applications", icon: FileText },
  { label: "Document Readiness", icon: ClipboardCheck },
  { label: "Compare Schemes", icon: GitCompareArrows },
  { label: "Source Verification", icon: BadgeCheck },
  { label: "AI Scheme Assistant", icon: Bot },
  { label: "Benefit Calculator", icon: Calculator },
  { label: "State Explorer", icon: Globe },
  { label: "Smart Alerts", icon: BellRing },
  { label: "Manage Schemes", icon: FilePlus2 },
];

function App() {
  const [activePage, setActivePage] = useState<Page>("Overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi">(() => {
    try { return localStorage.getItem("schemesearch_language") === "hi" ? "hi" : "en"; }
    catch { return "en"; }
  });

  // User profile
  const [profile, setProfile] = useState<UserProfile | null>(
    () => storage.getProfile<UserProfile>()
  );

  // Dynamically managed scheme collection
  const [managedSchemes, setManagedSchemes] = useState<Scheme[]>(
    () => storage.getSchemes<Scheme>(schemes)
  );

  // Saved schemes
  const [savedSchemeIds, setSavedSchemeIds] = useState<string[]>(
    () => storage.getSavedSchemes()
  );

  // Application tracker
  const [applications, setApplications] = useState<SchemeApplication[]>(
    () => storage.getApplications<SchemeApplication>()
  );

  // Selected scheme
  const [selectedSchemeId, setSelectedSchemeId] = useState<string | null>(
    null
  );

  // Page descriptions
  const descriptions: Record<Page, string> = {
    Overview:
      "Your personalized government scheme discovery space.",

    "Find Schemes":
      "Discover government opportunities relevant to your profile.",

    "My Profile":
      "Your information helps us identify relevant schemes.",

    "Saved Schemes":
      "Keep track of opportunities you want to explore.",

    Applications:
      "Track your scheme application progress.",

    "Document Readiness":
      "Prepare the documents you may need before applying.",

    "Compare Schemes":
      "Compare scheme benefits and profile alignment side by side.",

    "Source Verification":
      "Review scheme references and keep track of source checks.",

    "AI Scheme Assistant":
      "Ask questions about schemes using the current catalogue and your profile.",

    "Benefit Calculator":
      "Explore illustrative benefit scenarios using listed figures.",

    "State Explorer":
      "Explore nationwide and state-specific scheme records.",

    "Smart Alerts":
      "Keep track of important application steps and reminder dates.",

    "Scheme Details":
      "Explore scheme information and your eligibility assessment.",

    "Manage Schemes":
      "Manage scheme records, eligibility rules and verification information.",
  };

  const hindiPageLabels: Record<Page, string> = {
    Overview: "डैशबोर्ड",
    "Find Schemes": "योजनाएँ खोजें",
    "My Profile": "मेरी प्रोफ़ाइल",
    "Saved Schemes": "सेव की गई योजनाएँ",
    Applications: "आवेदन",
    "Document Readiness": "दस्तावेज़ तैयारी",
    "Compare Schemes": "योजनाओं की तुलना",
    "Source Verification": "स्रोत सत्यापन",
    "AI Scheme Assistant": "योजना सहायक",
    "Benefit Calculator": "लाभ कैलकुलेटर",
    "State Explorer": "राज्यवार योजनाएँ",
    "Smart Alerts": "स्मार्ट रिमाइंडर",
    "Scheme Details": "योजना विवरण",
    "Manage Schemes": "योजनाएँ प्रबंधित करें",
  };

  const hindiPageDescriptions: Record<Page, string> = {
    Overview: "आपका व्यक्तिगत सरकारी योजना खोज कार्यक्षेत्र।",
    "Find Schemes": "अपनी प्रोफ़ाइल के अनुसार सरकारी योजनाएँ खोजें।",
    "My Profile": "आपकी जानकारी उपयुक्त योजनाएँ खोजने में मदद करती है।",
    "Saved Schemes": "अपनी पसंदीदा योजनाओं को यहाँ रखें।",
    Applications: "अपने योजना आवेदनों की प्रगति देखें।",
    "Document Readiness": "आवेदन से पहले ज़रूरी दस्तावेज़ तैयार करें।",
    "Compare Schemes": "योजनाओं के लाभ और प्रोफ़ाइल मिलान की तुलना करें।",
    "Source Verification": "योजना स्रोतों की समीक्षा करें।",
    "AI Scheme Assistant": "योजनाओं के बारे में प्रश्न पूछें।",
    "Benefit Calculator": "योजनाओं के संभावित लाभ का अनुमान लगाएँ।",
    "State Explorer": "राज्य और राष्ट्रीय योजनाओं को खोजें।",
    "Smart Alerts": "आवेदन के चरणों और तारीखों के रिमाइंडर रखें।",
    "Scheme Details": "योजना की जानकारी और पात्रता मूल्यांकन देखें।",
    "Manage Schemes": "योजना रिकॉर्ड और पात्रता नियम प्रबंधित करें।",
  };

  // Navigation
  const navigate = (page: Page) => {
    setActivePage(page);
    setMobileOpen(false);
  };

  // ==========================================
  // ELIGIBILITY AND RECOMMENDATIONS
  // ==========================================

  const results = profile
    ? recommendSchemes(profile, managedSchemes)
    : [];

  const potentialMatches = results.filter(
    (result) => result.status === "potentially-eligible"
  );

  const informationNeeded = results.filter(
    (result) => result.status === "needs-information"
  );

  const dashboardRecommendations = results
    .filter((result) => result.status !== "not-eligible")
    .slice(0, 2);

  // ==========================================
  // SAVED SCHEMES
  // ==========================================

  const savedSchemes = managedSchemes.filter((scheme) =>
    savedSchemeIds.includes(scheme.id)
  );

  const toggleSavedScheme = (id: string) => {
    const updated = savedSchemeIds.includes(id)
      ? savedSchemeIds.filter((savedId) => savedId !== id)
      : [...savedSchemeIds, id];

    const success = storage.saveSavedSchemes(updated);

    if (!success) {
      window.alert("Could not update your saved schemes. Please try again.");
      return;
    }

    setSavedSchemeIds(updated);
  };

  // ==========================================
  // SCHEME MANAGEMENT
  // ==========================================

  const saveManagedScheme = (scheme: Scheme) => {
    const exists = managedSchemes.some(
      (item) => item.id === scheme.id
    );

    const updated = exists
      ? managedSchemes.map((item) =>
          item.id === scheme.id ? scheme : item
        )
      : [...managedSchemes, scheme];

    const success = storage.saveSchemes(updated);

    if (!success) {
      window.alert(
        "Could not save the scheme. Please check your browser storage."
      );
      return;
    }

    setManagedSchemes(updated);
  };

  const deleteManagedScheme = (id: string) => {
    const linkedApplications = applications.filter(
      (application) => application.schemeId === id
    );

    const isSaved = savedSchemeIds.includes(id);

    if (isSaved || linkedApplications.length > 0) {
      const confirmed = window.confirm(
        `This scheme has ${
          isSaved ? "a saved bookmark" : "no saved bookmark"
        } and ${linkedApplications.length} tracked application record(s).\n\n` +
          "Deleting it will remove the scheme and its saved bookmark, " +
          "but your application-tracking history will be preserved. " +
          "The scheme will appear as unavailable in your tracker. Continue?"
      );

      if (!confirmed) return;
    }

    const updatedSchemes = managedSchemes.filter(
      (scheme) => scheme.id !== id
    );

    const updatedSavedIds = savedSchemeIds.filter(
      (savedId) => savedId !== id
    );

    if (!storage.saveSchemes(updatedSchemes)) {
      window.alert("Could not delete the scheme. Please try again.");
      return;
    }

    if (!storage.saveSavedSchemes(updatedSavedIds)) {
      storage.saveSchemes(managedSchemes);
      window.alert(
        "Could not update saved schemes. Changes were rolled back."
      );
      return;
    }

    setManagedSchemes(updatedSchemes);
    setSavedSchemeIds(updatedSavedIds);

    if (selectedSchemeId === id) {
      setSelectedSchemeId(null);
    }
  };

  // ==========================================
  // SCHEME DETAILS
  // ==========================================

  const selectedScheme = managedSchemes.find(
    (scheme) => scheme.id === selectedSchemeId
  );

  const selectedResult =
    profile && selectedScheme
      ? evaluateScheme(profile, selectedScheme)
      : null;

  const isSelectedSchemeTracked = applications.some(
    (application) => application.schemeId === selectedSchemeId
  );

  const openScheme = (id: string) => {
    setSelectedSchemeId(id);
    navigate("Scheme Details");
  };

  // ==========================================
  // APPLICATION TRACKING
  // ==========================================

  const trackScheme = (schemeId: string) => {
    const exists = applications.some(
      (application) => application.schemeId === schemeId
    );

    if (exists) {
      navigate("Applications");
      return;
    }

    const now = new Date().toISOString();

    const newApplication: SchemeApplication = {
      id: crypto.randomUUID(),
      schemeId,
      status: "interested",
      notes: "",
      createdAt: now,
      updatedAt: now,
    };

    const updated = [...applications, newApplication];

    if (!storage.saveApplications(updated)) {
      window.alert("Could not track this scheme. Please try again.");
      return;
    }

    setApplications(updated);
    navigate("Applications");
  };

  const updateApplicationStatus = (
    id: string,
    status: ApplicationStatus
  ) => {
    const updated = applications.map((application) =>
      application.id === id
        ? {
            ...application,
            status,
            updatedAt: new Date().toISOString(),
          }
        : application
    );

    if (!storage.saveApplications(updated)) {
      window.alert("Could not update application status.");
      return;
    }

    setApplications(updated);
  };

  const updateApplicationNotes = (id: string, notes: string) => {
    const updated = applications.map((application) =>
      application.id === id
        ? {
            ...application,
            notes,
            updatedAt: new Date().toISOString(),
          }
        : application
    );

    if (!storage.saveApplications(updated)) {
      window.alert("Could not save application notes.");
      return;
    }

    setApplications(updated);
  };

  // ==========================================
  // APPLICATION UI
  // ==========================================

  return (
    <div className="app-shell">

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <button
          className="mobile-overlay"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>

        <div className="brand">
          <div className="brand-icon">
            <Landmark size={23} />
          </div>

          <div>
            <h2>SchemeSearch AI</h2>
            <span>OPPORTUNITY DISCOVERY</span>
          </div>

          <button
            className="mobile-close"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-label">{language === "hi" ? "कार्य क्षेत्र" : "WORKSPACE"}</div>

        <nav className="navigation">
          {navigation.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${
                activePage === label ? "active" : ""
              }`}
              onClick={() => navigate(label)}
            >
              <Icon size={19} />
              <span>{language === "hi" ? hindiPageLabels[label] : label}</span>

              {activePage === label && (
                <span className="active-dot" />
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">

          <div className="sidebar-help">
            <CircleHelp size={19} />
            <div>
              <strong>{language === "hi" ? "सहायता चाहिए?" : "Need assistance?"}</strong>
              <span>{language === "hi" ? "जानें कि यह कैसे काम करता है।" : "Understand how it works."}</span>
            </div>
          </div>

          <div className="sidebar-profile">
            <div className="avatar">G</div>

            <div className="profile-label">
              <strong>Guest User</strong>
              <span>
                {profile
                  ? "Profile completed"
                  : "Profile not completed"}
              </span>
            </div>

            <ChevronDown size={16} />
          </div>

        </div>
      </aside>

      {/* MAIN APPLICATION */}
      <main className="main-area">

        {/* TOPBAR */}
        <header className="topbar">

          <button
            className="mobile-menu"
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={21} />
          </button>

          <div className="breadcrumb">
            {language === "hi" ? "कार्य क्षेत्र" : "Workspace"} <span>/</span>
            <strong>{language === "hi" ? hindiPageLabels[activePage] : activePage}</strong>
          </div>

          <div className="topbar-actions">

            <div className="location-tag">
              <MapPin size={15} />
              India
            </div>

            <button
              className="language-toggle"
              type="button"
              onClick={() => {
                const next = language === "en" ? "hi" : "en";
                setLanguage(next);
                try { localStorage.setItem("schemesearch_language", next); } catch { /* Keep the session toggle working. */ }
              }}
              aria-label={language === "en" ? "Switch to Hindi" : "Switch to English"}
            >
              {language === "en" ? "हिन्दी" : "English"}
            </button>

            <button
              className="notification-button"
              aria-label={language === "hi" ? "स्मार्ट रिमाइंडर" : "Notifications"}
              title={language === "hi" ? "स्मार्ट रिमाइंडर" : "Smart reminders"}
              onClick={() => navigate("Smart Alerts")}
            >
              <Bell size={19} />
            </button>

            <div className="top-avatar">G</div>

          </div>
        </header>

        <div className="page-container">

          {/* PAGE HEADING */}
          <div className="page-heading">

            <div>
              <div className="eyebrow">
                SCHEMESEARCH AI / WORKSPACE
              </div>

              <h1>
                {language === "hi"
                  ? activePage === "Overview" ? "SchemeSearch AI में आपका स्वागत है" : hindiPageLabels[activePage]
                  : activePage === "Overview" ? "Welcome to SchemeSearch AI" : activePage}
              </h1>

              <p>{language === "hi" ? hindiPageDescriptions[activePage] : descriptions[activePage]}</p>
            </div>

            {activePage !== "Overview" && (
              <span className="page-status">
                {language === "hi"
                  ? (profile ? "प्रोफ़ाइल पूरी" : "शुरुआत करें")
                  : activePage === "Find Schemes"
                    ? "Eligibility discovery"
                    : activePage === "Manage Schemes"
                      ? "Prototype administration"
                      : profile
                        ? "Profile completed"
                        : "Getting started"}
              </span>
            )}

          </div>

          {/* ================================== */}
          {/* OVERVIEW */}
          {/* ================================== */}

          {activePage === "Overview" && (
            <>

              {/* HERO */}
              <section className="hero-banner">

                <div className="hero-content">

                  <div className="hero-tag">
                    <Sparkles size={14} />
                    YOUR OPPORTUNITY STARTS HERE
                  </div>

                  <h2>
                    Government benefits,
                    <br />
                    matched to <em>you.</em>
                  </h2>

                  <p>
                    Tell us a little about yourself. We'll help you
                    discover government schemes that align with your
                    circumstances.
                  </p>

                  <button
                    className="primary-button"
                    onClick={() => navigate("My Profile")}
                  >
                    {profile
                      ? "Update my profile"
                      : "Build my profile"}
                    <ArrowRight size={17} />
                  </button>

                </div>

                <div className="hero-art">

                  <div className="hero-art-circle">
                    <Landmark size={78} strokeWidth={1.1} />
                  </div>

                  <div className="floating-card">
                    <ShieldCheck size={19} />
                    <div>
                      <strong>Transparent matching</strong>
                      <span>Every result explained</span>
                    </div>
                  </div>

                </div>
              </section>

              {/* STATISTICS */}
              <section className="stats-grid">

                <div className="stat-card">
                  <div className="stat-icon blue">
                    <UserRound size={20} />
                  </div>

                  <div className="stat-number">
                    {profile ? "100%" : "0%"}
                  </div>

                  <div className="stat-title">
                    Profile readiness
                  </div>

                  <div className="stat-note">
                    {profile
                      ? "Your profile is ready for assessment"
                      : "Complete your profile to begin"}
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon violet">
                    <Search size={20} />
                  </div>

                  <div className="stat-number">
                    {profile ? potentialMatches.length : "—"}
                  </div>

                  <div className="stat-title">
                    Potential matches
                  </div>

                  <div className="stat-note">
                    {profile
                      ? `${informationNeeded.length} need more information`
                      : "Awaiting profile assessment"}
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon green">
                    <Bookmark size={20} />
                  </div>

                  <div className="stat-number">
                    {savedSchemeIds.length}
                  </div>

                  <div className="stat-title">
                    Saved opportunities
                  </div>

                  <div className="stat-note">
                    Your saved schemes will appear here
                  </div>
                </div>

              </section>

              {/* DASHBOARD CONTENT */}
              <div className="content-grid">

                <section className="panel recommendations-panel">

                  <div className="panel-heading">

                    <div>
                      <h3>Recommended for you</h3>
                      <p>
                        Opportunities selected for your profile
                      </p>
                    </div>

                    <button
                      className="text-button"
                      onClick={() => navigate("Find Schemes")}
                    >
                      Explore <ArrowRight size={15} />
                    </button>

                  </div>

                  {!profile ? (

                    <div className="empty-state">

                      <div className="empty-icon">
                        <Search size={25} />
                      </div>

                      <h4>Your recommendations are waiting</h4>

                      <p>
                        Complete your profile to see schemes that
                        may match your eligibility.
                      </p>

                      <button
                        className="secondary-button"
                        onClick={() => navigate("My Profile")}
                      >
                        Complete profile
                        <ArrowRight size={15} />
                      </button>

                    </div>

                  ) : dashboardRecommendations.length > 0 ? (

                    <div className="scheme-results">

                      {dashboardRecommendations.map((result) => (

                        <article
                          className="scheme-result-card"
                          key={result.scheme.id}
                        >

                          <div className="result-top">
                            <div className="result-category">
                              {result.scheme.category}
                            </div>
                          </div>

                          <h3>{result.scheme.name}</h3>

                          <div className="result-score-row">

                            <div>
                              <strong>{result.matchScore}%</strong>
                              <span>Profile match</span>
                            </div>

                            <span
                              className={`result-status ${result.status}`}
                            >
                              {result.status === "potentially-eligible"
                                ? "Potential match"
                                : "Needs information"}
                            </span>

                          </div>

                          <div className="match-progress">
                            <div
                              style={{
                                width: `${result.matchScore}%`,
                              }}
                            />
                          </div>

                          <button
                            className="text-button"
                            onClick={() => openScheme(result.scheme.id)}
                          >
                            View details <ArrowRight size={15} />
                          </button>

                        </article>

                      ))}

                    </div>

                  ) : (

                    <div className="empty-state">

                      <div className="empty-icon">
                        <Search size={25} />
                      </div>

                      <h4>No potential matches yet</h4>

                      <p>
                        Your current profile does not satisfy the
                        mandatory conditions in our scheme records.
                      </p>

                      <button
                        className="secondary-button"
                        onClick={() => navigate("Find Schemes")}
                      >
                        View assessment
                        <ArrowRight size={15} />
                      </button>

                    </div>

                  )}

                </section>

                {/* JOURNEY PANEL */}
                <section className="panel progress-panel">

                  <div className="panel-heading">
                    <div>
                      <h3>Getting started</h3>
                      <p>
                        Your journey to discovering opportunities
                      </p>
                    </div>
                  </div>

                  <div className="journey-list">

                    <div className="journey-item">

                      <div
                        className={`journey-marker ${
                          profile ? "" : "current"
                        }`}
                      >
                        <UserRound size={16} />
                      </div>

                      <div>
                        <strong>Build your profile</strong>
                        <span>
                          {profile
                            ? "Your profile has been completed"
                            : "Share basic details about yourself"}
                        </span>
                      </div>

                      <span className="step-label">01</span>

                    </div>

                    <div className="journey-item">

                      <div
                        className={`journey-marker ${
                          profile ? "current" : ""
                        }`}
                      >
                        <CheckCircle2 size={16} />
                      </div>

                      <div>
                        <strong>Check eligibility</strong>
                        <span>
                          {profile
                            ? "Your schemes have been evaluated"
                            : "Evaluate relevant scheme conditions"}
                        </span>
                      </div>

                      <span className="step-label">02</span>

                    </div>

                    <div className="journey-item">

                      <div className="journey-marker">
                        <Sparkles size={16} />
                      </div>

                      <div>
                        <strong>Explore opportunities</strong>
                        <span>
                          Review your recommendations
                        </span>
                      </div>

                      <span className="step-label">03</span>

                    </div>

                  </div>

                  <button
                    className="journey-button"
                    onClick={() =>
                      navigate(profile ? "Find Schemes" : "My Profile")
                    }
                  >
                    {profile
                      ? "View recommendations"
                      : "Start your journey"}
                    <ArrowRight size={16} />
                  </button>

                </section>

              </div>

              {/* TRUST NOTE */}
              <div className="trust-note">
                <ShieldCheck size={17} />
                <span>
                  Informational assistance only. Final scheme eligibility
                  and approval are determined by the respective government
                  authorities.
                </span>
              </div>

            </>
          )}

          {/* ================================== */}
          {/* PROFILE PAGE */}
          {/* ================================== */}

          {activePage === "My Profile" && (
            <ProfileWizard
              initialProfile={profile}
              onSave={(savedProfile) => {
                const success = storage.saveProfile(savedProfile);

                if (!success) {
                  window.alert("Could not save your profile. Please try again.");
                  return;
                }

                setProfile(savedProfile);
                navigate("Overview");
              }}
            />
          )}

          {/* ================================== */}
          {/* FIND SCHEMES */}
          {/* ================================== */}

          {activePage === "Find Schemes" && (
            <Recommendations
              profile={profile}
              schemes={managedSchemes}
              savedSchemeIds={savedSchemeIds}
              onCompleteProfile={() => navigate("My Profile")}
              onToggleSave={toggleSavedScheme}
              onViewScheme={openScheme}
            />
          )}

          {/* ================================== */}
          {/* SAVED SCHEMES */}
          {/* ================================== */}

          {activePage === "Saved Schemes" && (
            <SavedSchemes
              schemes={savedSchemes}
              onViewScheme={openScheme}
              onRemove={toggleSavedScheme}
              onExplore={() => navigate("Find Schemes")}
            />
          )}

          {/* ================================== */}
          {/* APPLICATION TRACKER */}
          {/* ================================== */}

          {activePage === "Applications" && (
            <ApplicationTracker
              applications={applications}
              schemes={managedSchemes}
              onUpdateStatus={updateApplicationStatus}
              onUpdateNotes={updateApplicationNotes}
            />
          )}

          {/* ================================== */}
          {/* SCHEME DETAILS */}
          {/* ================================== */}

          {activePage === "Scheme Details" && selectedScheme && (
            <SchemeDetails
              scheme={selectedScheme}
              result={selectedResult}
              isSaved={savedSchemeIds.includes(selectedScheme.id)}
              isTracked={isSelectedSchemeTracked}
              onBack={() => navigate("Find Schemes")}
              onToggleSave={() => toggleSavedScheme(selectedScheme.id)}
              onTrack={() => trackScheme(selectedScheme.id)}
            />
          )}

          {/* SCHEME NOT FOUND */}
          {activePage === "Scheme Details" && !selectedScheme && (
            <section className="panel placeholder-panel">
              <h3>Scheme not found</h3>
              <p>
                This scheme does not exist in the current dataset.
              </p>

              <button
                className="primary-button"
                onClick={() => navigate("Find Schemes")}
              >
                Back to schemes <ArrowRight size={16} />
              </button>
            </section>
          )}

          {/* PHASE 1 FEATURES */}
          {activePage === "Document Readiness" && <DocumentReadinessChecker schemes={managedSchemes} />}
          {activePage === "Compare Schemes" && (
            <SchemeComparison profile={profile} schemes={managedSchemes} onViewScheme={openScheme} />
          )}
          {activePage === "Source Verification" && <SourceVerification schemes={managedSchemes} />}

          {/* PHASE 2 FEATURES */}
          {activePage === "AI Scheme Assistant" && (
            <AISchemeAssistant profile={profile} schemes={managedSchemes} onViewScheme={openScheme} />
          )}
          {activePage === "Benefit Calculator" && (
            <BenefitCalculator profile={profile} schemes={managedSchemes} />
          )}

          {/* PHASE 3 FEATURES */}
          {activePage === "State Explorer" && (
            <StateSchemeExplorer schemes={managedSchemes} profile={profile} language={language} onViewScheme={openScheme} />
          )}
          {activePage === "Smart Alerts" && (
            <SmartAlerts schemes={managedSchemes} applications={applications} language={language} />
          )}

          {/* ================================== */}
          {/* SCHEME MANAGER */}
          {/* ================================== */}

          {activePage === "Manage Schemes" && (
            <SchemeManager
              schemes={managedSchemes}
              onSave={saveManagedScheme}
              onDelete={deleteManagedScheme}
            />
          )}

        </div>
      </main>
    </div>
  );
}

export default App;
