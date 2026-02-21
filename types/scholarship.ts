export interface Scholarship {
  _id: string;
  title: string;
  slug: string;
  description: string;
  type: "fully funded" | "partial" | "paid" | "self funded";
  value?: number;
  currency?: string;
  level: string;
  fieldOfStudy: string[];  // This is an array in your schema
  universities: string[];   // This is an array in your schema
  country: string[];        // This is an array in your schema
  region?: string;
  requirements: string;
  eligibleCountries?: string[];
  minGPA?: number;
  ageLimit?: string;
  deadline: string;
  startDate?: string;
  durationMonths?: number;
  applicationLink?: string;
  applicationFee?: number;
  documentsRequired?: string[];
  image: string;
  brochureFile?: string;
  isActive: boolean;
  views: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FilterOptions {
  levels: string[];
  countries: string[];
  fields: string[];
  types: string[];
}

export interface Filters {
  type: string;
  level: string;
  country: string;
  fieldOfStudy: string;
}

export interface ActiveFilter {
  key: string;
  label: string;
}