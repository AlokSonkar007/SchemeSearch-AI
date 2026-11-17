export type ApplicationStatus =
  | "interested"
  | "preparing"
  | "submitted"
  | "approved"
  | "rejected";

export type SchemeApplication = {
  id: string;
  schemeId: string;
  status: ApplicationStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
};
