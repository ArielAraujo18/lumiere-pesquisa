export type SiteSettings = {
  groupName: string;
  primaryEmail: string;
  secondaryEmail: string;
  instagram: string;
  location: string;
  phone: string;
  website: string;
};

export type PasswordPayload = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};
