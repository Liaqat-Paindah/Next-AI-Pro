import { Schema, model, models } from "mongoose";
import { string } from "zod";

const ScholarshipSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["fully funded", "partial", "paid", "self funded"],
      required: true,
    },
    value: {
      type: Number,
      min: 0,
    },

    currency: {
      type: String,
      default: "USD",
    },

    level: {
      type: String,
      required: true,
    },

    fieldOfStudy: {
      type: [String], // Computer Science, Engineering, etc.
      required: true,
    },

    universities: {
      type: [String],
      required: true,
    },

    country: {
      type: [String],
      required: true,
    },

    region: {
      type: String,
    },

    // Eligibility
    requirements: {
      type: String,
      required: true,
    },

    eligibleCountries: {
      type: [String],
    },

    minGPA: {
      type: Number,
      min: 0,
      max: 4,
    },

    ageLimit: {
      type: String,
    },

    // Dates
    deadline: {
      type: Date,
      required: true,
    },

    startDate: {
      type: Date,
    },

    durationMonths: {
      type: Number,
    },

    // Application
    applicationLink: {
      type: String,
    },

    applicationFee: {
      type: Number,
      default: 0,
    },

    documentsRequired: {
      type: [String], // CV, Transcript, IELTS, etc.
    },

    // Image & Media
    image: {
      type: String,
      required: true,
    },

    brochureFile: {
      type: String, // PDF link
    },

    // Status & Control
    isActive: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default models.Scholarship || model("Scholarship", ScholarshipSchema);
