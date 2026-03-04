import mongoose from "mongoose";

const ScholarshipApplicationSchema = new mongoose.Schema(
  {
    userId: { type: String }, // Link to user account
    status: {
      type: String,
      enum: ["draft", "submitted", "under_review", "approved", "rejected"],
      default: "draft",
    },

    personal: {
      age: {
        type: Number,
        required: true,
        min: 1,
        max: 100,
      },

      gender: {
        type: String,
        required: true,
        enum: ["Male", "Female", "Other"],
      },

      maritalStatus: {
        type: String,
        required: true,
        enum: ["Single", "Married"],
      },

      firstName: {
        type: String,
        required: true,
        trim: true,
      },

      lastName: {
        type: String,
        required: true,
        trim: true,
      },

      fatherName: {
        type: String,
        required: true,
        trim: true,
      },

      birthDate: {
        type: Date,
        required: true,
      },

      nationality: {
        type: String,
        required: true,
      },

      nationalId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },

      passportId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },

      dateofIssue: {
        type: Date,
        required: true,
      },

      dataofExpire: {
        type: Date,
        required: true,
      },
    },

    education: [
      {
        level: {
          type: String,
          enum: ["Master", "Bachelor", "PHD", "High School"],
          required: true,
        },
        fieldOfStudy: { type: String, required: true },
        institutionName: { type: String, required: true },
        gpa: { type: Number, required: true },
        academicRank: { type: String }, // Optional rank
        startDate: { type: Date, required: true },
        graduationDate: { type: Date, required: true },
        educationGapExplanation: { type: String }, // optional
        thesisTopic: { type: String }, // optional
        thesisFileUrl: { type: String }, // optional
        diplomaFileUrl: { type: String }, // optional
        transcriptFileUrl: { type: String }, // optional
        finalExamYear: { type: Number }, // for High_School: KanKoor year
        finalExamScore: { type: Number }, // for High_School: KanKoor score
        majorSubjects: [String], // optional
        diplomaFile: { type: String }, // Store relative path
        transcriptFile: { type: String },
        thesisFile: { type: String },
      },
    ],

    




research: {
  hasArticles: { type: Boolean, default: false },
  hasProjects: { type: Boolean, default: false },
  hasConferences: { type: Boolean, default: false },
  hasAwards: { type: Boolean, default: false },
  hasLabs: { type: Boolean, default: false },
  hasSkills: { type: Boolean, default: false },

  articles: [
    {
      title: { type: String },
      citation: { type: String }, // APA citation
      link: { type: String },
    },
  ],

  projects: [
    {
      title: { type: String },
      fileUrl: { type: String }, // stored file path
    },
  ],

  conferences: [
    {
      title: { type: String },
      fileUrl: { type: String },
    },
  ],

  awards: [
    {
      fileUrl: { type: String },
    },
  ],

  laboratoryActivities: [
    {
      fileUrl: { type: String },
    },
  ],

  researchSkills: [
    {
      description: { type: String },
      fileUrl: { type: String },
    },
  ],
},
















    // =========================
    // 3. Language Skills
    // =========================
    languages: {
      nativeLanguage: String,
      englishLevel: String,
      otherLanguages: [
        { language: String, level: String, hasDocument: Boolean },
      ],
    },

    // =========================
    // 4. Professional Skills
    // =========================
    skills: {
      computerSkills: [{ skill: String, hasDocument: Boolean }],
      communicationSkills: String,
      mediaProductionSkills: String,
      teamworkSkills: String,
      problemSolvingSkills: String,
      timeManagementSkills: String,
      presentationSkills: String,
    },

    // =========================
    // 5. Work Experience
    // =========================
    experience: {
      jobs: [
        {
          position: String,
          organization: String,
          duration: String,
          hasDocument: Boolean,
        },
      ],
      internships: [{ title: String, hasDocument: Boolean }],
      volunteerActivities: [{ title: String, hasDocument: Boolean }],
      socialActivities: [{ title: String, hasDocument: Boolean }],
      awarenessPrograms: [{ title: String, hasDocument: Boolean }],
      mediaActivities: [{ title: String, hasDocument: Boolean }],
      leadershipActivities: [{ title: String, hasDocument: Boolean }],
      certificates: [{ title: String, hasDocument: Boolean }],
    },

    // =========================
    // 6. Health Status
    // =========================
    health: {
      specialDiseases: String,
      disabilityNeeds: String,
    },

    // =========================
    // 7. Financial Status
    // =========================
    financial: {
      familyIncome: Number,
      canPayTuition: Boolean,
      canPayTravel: Boolean,
    },

    // =========================
    // 9. Hobbies & Interests
    // =========================
    hobbies: {
      sports: [String],
      freeTimeActivities: String,
    },

    // =========================
    // 10. Goals & Vision
    // =========================
    goals: {
      purposeOfStudy: String,
      futurePlan: String,
    },

    // =========================
    // 11. Study Preferences
    // =========================
    preferences: {
      preferredFields: [String],
      preferredCountries: [String],
      preferredUniversities: [String],
      preferredStudyLevel: String, // Bachelor, Master, PhD
    },

    // =========================
    // 12. Supporting Documents
    // =========================
    supportingDocuments: {
      sop: Boolean,
      recommendationLetter: Boolean,
      cv: Boolean,
      researchProposal: Boolean,
      portfolio: Boolean,
    },

    // =========================
    // 13. Identity Documents
    // =========================
    identityDocuments: {
      tazkira: Boolean,
      passport: Boolean,
    },

    // =========================
    // 14. Contact Information
    // =========================
    contact: {
      permanentAddress: String,
      currentAddress: String,
      detailedAddress: String,
      phone: String,
      whatsapp: String,
      email: String,
      relativePhone: String,
    },

    // =========================
    // 15. Study Type
    // =========================
    studyType: {
      scholarshipOnly: Boolean,
      privateStudyOption: Boolean,
    },

    // =========================
    // 16. Distinction / Unique Skills
    // =========================
    distinction: {
      specialSkills: String,
      achievements: String,
    },

    // =========================
    // 17. Optional: History & Review
    // =========================
    history: [{ action: String, date: Date, user: String }],

    review: [
      {
        reviewerName: String,
        score: Number,
        comments: String,
        decisionDate: Date,
      },
    ],

    files: {
      cvUrl: String,
      sopUrl: String,
      passportUrl: String,
      tazkiraUrl: String,
      portfolioUrl: String,
      researchProposalUrl: String,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.ScholarshipApplication ||
  mongoose.model("ScholarshipApplication", ScholarshipApplicationSchema);
