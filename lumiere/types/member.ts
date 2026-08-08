export type MemberStatus = "Ativo" | "Inativo";

export type MemberPayload = {
  name: string;
  role: string;
  group: string;
  bio: string;
  email: string;
  photoUrl: string;
  lattesUrl: string;
  linkedinUrl: string;
  status: MemberStatus;
  order: number;
};

export type Member = MemberPayload & {
  id: string;
  createdAt?: string;
  updatedAt?: string;
};
