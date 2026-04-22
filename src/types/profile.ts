export enum SystemRole {
  super_admin = "Quản trị cấp cao",
  admin = "Quản trị viên",
  user = "Người dùng",
}

export interface Profile {
  id: string;
  full_name: string;
  phone?: string;
  email?: string;
  role: keyof typeof SystemRole;
}
