export type MessageStatus = "Nova" | "Lida" | "Respondida";

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: MessageStatus;
  createdAt: string;
  updatedAt?: string;
  readAt?: string | null;
  respondedAt?: string | null;
};
