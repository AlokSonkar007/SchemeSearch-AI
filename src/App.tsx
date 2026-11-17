import { useState } from "react";
import {
  Landmark, LayoutDashboard, Search, Bookmark, FileText,
  UserRound, Bell, ChevronDown, ArrowRight, Sparkles,
  ShieldCheck, MapPin, CircleHelp, Menu, X, CheckCircle2
} from "lucide-react";

type Page = "Overview" | "Find Schemes" | "My Profile" | "Saved Schemes" | "Applications";

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

  const descriptions: Record<Page, string> = {
    "Overview": "Your personalized government scheme discovery space.",
    "Find Schemes": "Discover government opportunities relevant to your profile.",
    "My Profile": "Your information helps us identify relevant schemes.",
    "Saved Schemes": "Keep track of opportunities you want to explore.",
    "Applications": "Track the progress of your scheme applications.",
  };

  const navigate = (page: Page) => {
    setActivePage(page);
    setMobileOpen(false);
  };

  return (
    <div className="app-shell">
      {mobileOpen && (
        <button
          className="mobile-overlay"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon"><Landmark size={23} /></div>
          <div>
            <h2>SchemeSearch AI</h2>
            <span>OPPORTUNITY DISCOVERY</span>
          </div>
          <button className="mobile-close" onClick={() => setMobileOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-label">WORKSPACE</div>
        <nav className="navigation">
          {navigation.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${activePage === label ? "active" : ""}`}
              onClick={() => navigate(label)}
            >
              <Icon size={19} />
              <span>{label}</span>
              {activePage === label && <span className="active-dot" />}
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
              <span>Profile not completed</span>
            </div>
            <ChevronDown size={16} />
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileOpen(true)}>
            <Menu size={21} />
          </button>
          <div className="breadcrumb">
            Workspace <span>/</span> <strong>{activePage}</strong>
          </div>
          <div className="topbar-actions">
            <div className="location-tag"><MapPin size={15} /> India</div>
            <button className="notification-button" aria-label="Notifications">
              <Bell size={19} />
            </button>
            <div className="top-avatar">G</div>
          </div>
        </header>

        <div className="page-container">
          <div className="page-heading">
            <div>
              <div className="eyebrow">SCHEMESEARCH AI / WORKSPACE</div>
              <h1>{activePage === "Overview" ? "Welcome to YojanaLens" : activePage}</h1>
              <p>{descriptions[activePage]}</p>
            </div>
            {activePage !== "Overview" && (
              <span className="page-status">Getting started</span>
            )}
          </div>

          {activePage === "Overview" ? (
            <>
              <section className="hero-banner">
                <div className="hero-content">
                  <div className="hero-tag"><Sparkles size={14} /> YOUR OPPORTUNITY STARTS HERE</div>
                  <h2>Government benefits,<br />matched to <em>you.</em></h2>
                  <p>
                    Tell us a little about yourself. We'll help you discover
                    government schemes that align with your circumstances.
                  </p>
                  <button className="primary-button" onClick={() => navigate("My Profile")}>
                    Build my profile <ArrowRight size={17} />
                  </button>
                </div>
                <div className="hero-art">
                  <div className="hero-art-circle">
                    <Landmark size={78} strokeWidth={1.1} />
                  </div>
                  <div className="floating-card">
                    <ShieldCheck size={19} />
                    <div><strong>Transparent matching</strong><span>Every result explained</span></div>
                  </div>
                </div>
              </section>

              <section className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon blue"><UserRound size={20} /></div>
                  <div className="stat-number">0%</div>
                  <div className="stat-title">Profile readiness</div>
                  <div className="stat-note">Complete your profile to begin</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon violet"><Search size={20} /></div>
                  <div className="stat-number">—</div>
                  <div className="stat-title">Potential matches</div>
                  <div className="stat-note">Awaiting profile assessment</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon green"><Bookmark size={20} /></div>
                  <div className="stat-number">0</div>
                  <div className="stat-title">Saved opportunities</div>
                  <div className="stat-note">Your saved schemes will appear here</div>
                </div>
              </section>

              <div className="content-grid">
                <section className="panel recommendations-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Recommended for you</h3>
                      <p>Opportunities selected for your profile</p>
                    </div>
                    <button className="text-button" onClick={() => navigate("Find Schemes")}>
                      Explore <ArrowRight size={15} />
                    </button>
                  </div>
                  <div className="empty-state">
                    <div className="empty-icon"><Search size={25} /></div>
                    <h4>Your recommendations are waiting</h4>
                    <p>Complete your profile to see schemes that may match your eligibility.</p>
                    <button className="secondary-button" onClick={() => navigate("My Profile")}>
                      Complete profile <ArrowRight size={15} />
                    </button>
                  </div>
                </section>

                <section className="panel progress-panel">
                  <div className="panel-heading">
                    <div>
                      <h3>Getting started</h3>
                      <p>Your journey to discovering opportunities</p>
                    </div>
                  </div>
                  <div className="journey-list">
                    <div className="journey-item">
                      <div className="journey-marker current"><UserRound size={16} /></div>
                      <div><strong>Build your profile</strong><span>Share basic details about yourself</span></div>
                      <span className="step-label">01</span>
                    </div>
                    <div className="journey-item">
                      <div className="journey-marker"><CheckCircle2 size={16} /></div>
                      <div><strong>Check eligibility</strong><span>Evaluate relevant scheme conditions</span></div>
                      <span className="step-label">02</span>
                    </div>
                    <div className="journey-item">
                      <div className="journey-marker"><Sparkles size={16} /></div>
                      <div><strong>Explore opportunities</strong><span>Review your recommendations</span></div>
                      <span className="step-label">03</span>
                    </div>
                  </div>
                  <button className="journey-button" onClick={() => navigate("My Profile")}>
                    Start your journey <ArrowRight size={16} />
                  </button>
                </section>
              </div>

              <div className="trust-note">
                <ShieldCheck size={17} />
                <span>Informational assistance only. Final scheme eligibility and approval are determined by the respective government authorities.</span>
              </div>
            </>
          ) : (
            <section className="panel placeholder-panel">
              <div className="empty-icon"><Sparkles size={25} /></div>
              <h3>{activePage} is being prepared</h3>
              <p>{descriptions[activePage]}</p>
              <button className="primary-button" onClick={() => navigate("Overview")}>
                Back to overview <ArrowRight size={16} />
              </button>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
