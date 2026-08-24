export type ProjectStatus =
  | "Planejado"
  | "Em andamento"
  | "Concluído";

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

  // IDs dos membros vinculados ao projeto
  memberIds: string[];

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
  
  memberIds: string[];
}