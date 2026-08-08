export type ProjectStatus = "Planejado" | "Em andamento" | "Concluído";

export interface Project {
  id: string;
  title: string;
  slug: string;
  area: string;
  status: ProjectStatus;
  responsible: string;
  summary: string;
  description: string;
  startDate: string;
  endDate?: string;
  imageUrl?: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectPayload {
  title: string;
  area: string;
  status: ProjectStatus;
  responsible: string;
  summary: string;
  description: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  featured: boolean;
}
