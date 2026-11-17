
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
} from "lucide-react";

import ProfileWizard, {
  type UserProfile,
} from "./components/ProfileWizard";

import Recommendations from "./components/Recommendations";
import { schemes } from "./data/schemes";
import { recommendSchemes } from "./lib/eligibility";

type Page =
  | "Overview"
  | "Find Schemes"
  | "My Profile"
  | "Saved Schemes"
  | "Applications";

const navigation: { label: Page; icon: typeof LayoutDashboard }[] = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Find Schemes", icon: Search },
  { label: "My Profile", icon: UserRound },
  { label: "Saved Schemes", icon: Bookmark },
  { label: "Applications", icon: FileText },
];

function App() {
  const [activePage, setActivePage] = useState<Page>("Overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const descriptions: Record<Page, string> = {
    Overview: "Your personalized government scheme discovery space.",
    "Find Schemes":
      "Discover government opportunities relevant to your profile.",
    "My Profile":
      "Your information helps us identify relevant schemes.",
    "Saved Schemes":
      "Keep track of opportunities you want to explore.",
    Applications:
      "Track the progress of your scheme applications.",
  };

  // Calculate recommendations whenever a profile is available.
  const results = profile
    ? recommendSchemes(profile, schemes)
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

  const navigate = (page: Page) => {
    setActivePage(page);
    setMobileOpen(false);
  };

  return (
    <div className="app-shell">
      {/* Mobile navigation overlay */}
      {mobileOpen && (
        <button
          className="mobile-overlay"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}
      >
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

        <div className="sidebar-label">WORKSPACE</div>

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
              <span>{label}</span>

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
              <strong>Need assistance?</strong>
              <span>Understand how it works.</span>
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

      {/* Main application */}
      <main className="main-area">
        <header className="topbar">
          <button
            className="mobile-menu"
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={21} />
          </button>

          <div className="breadcrumb">
            Workspace <span>/</span>{" "}
            <strong>{activePage}</strong>
          </div>

          <div className="topbar-actions">
            <div className="location-tag">
              <MapPin size={15} />
              India
            </div>

            <button
              className="notification-button"
              aria-label="Notifications"
            >
              <Bell size={19} />
            </button>

            <div className="top-avatar">G</div>
          </div>
        </header>

        <div className="page-container">
          {/* Page heading */}
          <div className="page-heading">
            <div>
              <div className="eyebrow">
                SCHEMESEARCH AI / WORKSPACE
              </div>

              <h1>
                {activePage === "Overview"
                  ? "Welcome to SchemeSearch AI"
                  : activePage}
              </h1>

              <p>{descriptions[activePage]}</p>
            </div>

            {activePage !== "Overview" && (
              <span className="page-status">
                {activePage === "Find Schemes"
                  ? "Eligibility discovery"
                  : profile
                    ? "Profile completed"
                    : "Getting started"}
              </span>
            )}
          </div>

          {/* OVERVIEW PAGE */}
          {activePage === "Overview" ? (
            <>
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
                    <Landmark
                      size={78}
                      strokeWidth={1.1}
                    />
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

              {/* Dynamic statistics */}
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

                  <div className="stat-number">0</div>

                  <div className="stat-title">
                    Saved opportunities
                  </div>

                  <div className="stat-note">
                    Your saved schemes will appear here
                  </div>
                </div>
              </section>

              {/* Dashboard content */}
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

                      <h4>
                        Your recommendations are waiting
                      </h4>

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
                              <strong>
                                {result.matchScore}%
                              </strong>
                              <span>Profile match</span>
                            </div>

                            <span
                              className={`result-status ${result.status}`}
                            >
                              {result.status ===
                              "potentially-eligible"
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
                        mandatory conditions in our available
                        prototype records.
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
                        {profile ? (
                          <CheckCircle2 size={16} />
                        ) : (
                          <UserRound size={16} />
                        )}
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
                        {profile ? (
                          <CheckCircle2 size={16} />
                        ) : (
                          <CheckCircle2 size={16} />
                        )}
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
                      navigate(
                        profile ? "Find Schemes" : "My Profile"
                      )
                    }
                  >
                    {profile
                      ? "View recommendations"
                      : "Start your journey"}
                    <ArrowRight size={16} />
                  </button>
                </section>
              </div>

              <div className="trust-note">
                <ShieldCheck size={17} />
                <span>
                  Informational assistance only. Final scheme
                  eligibility and approval are determined by the
                  respective government authorities.
                </span>
              </div>
            </>
          ) : activePage === "My Profile" ? (
            /* PROFILE PAGE */
            <ProfileWizard
              initialProfile={profile}
              onSave={(savedProfile) => {
                setProfile(savedProfile);
                navigate("Overview");
              }}
            />
          ) : activePage === "Find Schemes" ? (
            /* RECOMMENDATION PAGE */
            <Recommendations
              profile={profile}
              onCompleteProfile={() => navigate("My Profile")}
            />
          ) : (
            /* OTHER PAGES */
            <section className="panel placeholder-panel">
              <div className="empty-icon">
                {activePage === "Saved Schemes" ? (
                  <Bookmark size={25} />
                ) : (
                  <FileText size={25} />
                )}
              </div>

              <h3>{activePage} is being prepared</h3>

              <p>{descriptions[activePage]}</p>

              <button
                className="primary-button"
                onClick={() => navigate("Overview")}
              >
                Back to overview
                <ArrowRight size={16} />
              </button>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
