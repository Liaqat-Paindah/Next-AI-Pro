export type AcademicPreferencesData = {
  field1: string;
  field2: string;
  field3: string;
  field4: string;
  preferredCountries: string[];
  preferredUniversities: string[];
  studyLevel: string;
};

export type Country = {
  code: string;
  name: string;
};

export type University = {
  id: string;
  name: string;
  country: string;
};