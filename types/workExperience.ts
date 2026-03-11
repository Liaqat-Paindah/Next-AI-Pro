// types/activities.ts
export interface Activity {
  type: string;
  file: File | null;
  fileName?: string; 
}

export interface ActivitiesFormData {
  userId: string;
  activities: Activity[];
}

export interface ActivityDocument {
  type: string;
  fileUrl?: string;
  fileName?: string;
}