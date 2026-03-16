export interface DocumentFormData {
  userId?: string

  sop?: File
  recommendationLetters?: File
  cv?: File
  researchProposal?: File
  portfolio?: File
  nid?: File
  passport?: File
}


export type DocumentType =
  | "sop"
  | "recommendationLetters"
  | "cv"
  | "researchProposal"
  | "portfolio"
  | "nid"
  | "passport";

export interface UploadDocumentPayload {
  userId: string;
  type: DocumentType;
  file: File;
}

export interface UploadDocumentResponse {
  success: boolean;
  message: string;
  data?: unknown;
}