export interface APIPost {
  id: number;
  title: string;
  author: APIUser;
  tags?: string[];
}

export interface APIUser {
  id: number;
  username: string;
}

export interface APIPostListResponse {
  items: APIPost[];
  total: number;
}