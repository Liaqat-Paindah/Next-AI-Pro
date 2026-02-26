import { z } from "zod";

export const personalInfoSchema = z.object({
  first_Name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  fatherName: z.string().min(1, "Father name is required"),
  age: z.number({ message: "Age is required" }).min(1, "Age must be at least 1"),
  gender: z.string().min(1, "gender is required"),
  maritalStatus: z.string().min(1, "Marital Status is required"),
  birthDate: z.string().min(1, "Birth date is required"),
  nationality: z.string().min(1, "Nationality is required"),
  nationalId: z.string().min(1, "National ID is required"),
  passportId: z.string().min(1, "Passport number is required"),
  dateofIssue: z.string().min(1, "Passport issue date is required"),
  dataofExpire: z.string().min(1, "Passport expiry date is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
