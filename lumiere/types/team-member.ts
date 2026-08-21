export type TeamMember = {
  id: string;
  name: string;
  role: string;
  researchArea: string;
  bio: string | null;
  photo: string;
  photoAlt: string;
  lattesUrl: string | null;
  orcidUrl: string | null;
  category:
    | "coordination"
    | "researcher"
    | "scholarship"
    | "collaborator";
  createdAt: Date;
  updatedAt: Date;
};