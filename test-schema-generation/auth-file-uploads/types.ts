export interface APILoginRequest {
  username: string;
  password: string;
}

export interface APILoginResponse {
  token: string;
}

export interface APIFileUploadResponse {
  fileId: string;
  url: string;
}