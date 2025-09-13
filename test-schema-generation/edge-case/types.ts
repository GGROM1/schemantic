export interface APIUserResponse {
  id: number;
  name: string;
  role: APIUserRole;
  profile?: APIUserProfile;
}

export enum APIUserRole {
  ADMIN = "ADMIN",
  EDITOR = "EDITOR",
  VIEWER = "VIEWER"
}
export type APIUserRoleValues = "ADMIN" | "EDITOR" | "VIEWER";

export interface APIUserProfile {
  bio?: string;
  social?: string[];
}

export interface APIBook {
  type: string;
  title: string;
  author: string;
}

export interface APIMovie {
  type: string;
  title: string;
  director: string;
}

export interface APIItem {
  id: number;
  data: APICreateItemRequest;
}