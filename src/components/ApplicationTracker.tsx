import {
  FileText,
  Clock3,
  ClipboardList,
  AlertCircle,
} from "lucide-react";

import type { Scheme } from "../types/scheme";
import type {
  SchemeApplication,
  ApplicationStatus,
} from "../types/application";

type Props = {
  applications: SchemeApplication[];
  schemes: Scheme[];
  onUpdateStatus: (id: string, status: ApplicationStatus) => void;
  onUpdateNotes: (id: string, notes: string) => void;
};

const statusOptions: ApplicationStatus[] = [
  "interested",
  "preparing",
  "submitted",
  "approved",
  "rejected",
];

const statusLabels: Record<ApplicationStatus, string> = {
  interested: "Interested",
  preparing: "Preparing",
  submitted: "Submitted",
  approved: "Approved",
  rejected: "Rejected",
};

export default function ApplicationTracker({
  applications,
  schemes,
  onUpdateStatus,
  onUpdateNotes,
}: Props) {
  const getScheme = (id: string) =>
    schemes.find((scheme) => scheme.id === id);

  if (applications.length === 0) {
    return (
      <section className="panel recommendation-empty">
        <div className="empty-icon">
          <ClipboardList size={25} />
        </div>
        <h3>No applications being tracked</h3>
        <p>
          Open a scheme and select Track this scheme to start
          managing your opportunities.
        </p>
      </section>
    );
  }

  const counts = {
    active: applications.filter(
      (app) => !["approved", "rejected"].includes(app.status)
    ).length,
    approved: applications.filter(
      (app) => app.status === "approved"
    ).length,
    submitted: applications.filter(
      (app) => app.status === "submitted"
    ).length,
  };

  return (
    <div className="application-page">
      <div className="application-stats">
        <div className="summary-card">
          <span>Active opportunities</span>
          <strong>{counts.active}</strong>
        </div>
        <div className="summary-card">
          <span>Applications submitted</span>
          <strong>{counts.submitted}</strong>
        </div>
        <div className="summary-card">
          <span>Approved</span>
          <strong>{counts.approved}</strong>
        </div>
      </div>

      <div className="application-list">
        {applications.map((application) => {
          const scheme = getScheme(application.schemeId);

          return (
            <article
              className="panel application-card"
              key={application.id}
            >
              <div className="application-card-heading">
                <div className="application-icon">
                  <FileText size={21} />
                </div>

                <div className="application-title">
                  <h3>
                    {scheme?.name ?? "Scheme no longer available"}
                  </h3>
                  <span>
                    {scheme?.category ?? "Deleted or unavailable scheme"}
                  </span>
                </div>

                <span
                  className={`application-status ${application.status}`}
                >
                  {statusLabels[application.status]}
                </span>
              </div>

              {!scheme && (
                <div className="prototype-warning">
                  <AlertCircle size={17} />
                  <span>
                    This scheme is no longer in your managed dataset.
                    Your application history and notes are preserved.
                  </span>
                </div>
              )}

              <div className="application-meta">
                <span>
                  <Clock3 size={14} />
                  Added{" "}
                  {new Date(application.createdAt).toLocaleDateString()}
                </span>
              </div>

              <label className="application-field">
                <span>Update application status</span>
                <select
                  value={application.status}
                  onChange={(event) =>
                    onUpdateStatus(
                      application.id,
                      event.target.value as ApplicationStatus
                    )
                  }
                >
                  {statusOptions.map((status) => (
                    <option value={status} key={status}>
                      {statusLabels[status]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="application-field">
                <span>Personal notes</span>
                <textarea
                  rows={2}
                  value={application.notes}
                  onChange={(event) =>
                    onUpdateNotes(application.id, event.target.value)
                  }
                  placeholder="Add reminders, document requirements or other notes..."
                />
              </label>
            </article>
          );
        })}
      </div>
    </div>
  );
}
