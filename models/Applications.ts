import mongoose from "mongoose";

const ScholarshipApplicationSchema = new mongoose.Schema(
  {
    userId: { type: String }, // Link to user account
    status: {
      type: String,
      enum: ["draft", "submitted", "under_review", "approved", "rejected"],
      default: "draft",
    },

    stage: {
      type: String,
      enum: [
        "information_submission",
        "eligibility_assessment",
        "eligibility_alignment",
        "competitive_enhancement",
        "application_customization",
        "application_submission",
        "post_submission_followup",
      ],
      default: "information_submission",
    },

    personal: {
      mother_name: {
        type: String,
        required: true,
      },

      siblings: {
        type: Number,
        required: true,
      },
      dependents: {
        type: Number,
        required: true,
      },
      children: {
        type: Number,
      },

      gender: {
        type: String,
        required: true,
        enum: ["Male", "Female", "Other"],
      },

      maritalStatus: {
        type: String,
        required: true,
        enum: ["Single", "Married", "Engaged"],
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
        },
        fieldOfStudy: { type: String },
        institutionName: { type: String },
        gpa: { type: Number },
        academicRank: { type: String }, // Optional rank
        startDate: { type: Date },
        graduationDate: { type: Date },
        educationGapExplanation: { type: String },
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
      steps: { type: String, default: "false" },
      hasArticles: { type: Boolean, default: false },
      hasProjects: { type: Boolean, default: false },
      hasConferences: { type: Boolean, default: false },
      hasLabs: { type: Boolean, default: false },
      hasResearchSkills: { type: Boolean, default: false },
      hasAcademicAwards: { type: Boolean, default: false },

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

      laboratoryActivities: [
        {
          title: { type: String },
          fileUrl: { type: String },
        },
      ],
      academicAwards: [
        {
          title: { type: String },
          fileUrl: { type: String },
        },
      ],

      researchSkills: [
        {
          title: { type: String },
          fileUrl: { type: String },
        },
      ],
    },

    skills: {
      steps: { type: String, default: "false" },
      computerSkills: {
        hasSkill: {
          type: Boolean,
          default: false,
        },
        fileUrl: {
          type: String,
        },
      },
      communicationSkills: {
        type: Boolean,
        default: false,
      },
      mediaContentCreation: {
        hasSkill: {
          type: Boolean,
          default: false,
        },
        youtubeLink: {
          type: String,
          trim: true,
        },
      },
      teamworkSkills: {
        type: Boolean,
        default: false,
      },
      leadershipSkills: {
        type: Boolean,
        default: false,
      },
      problemSolving: {
        type: Boolean,
        default: false,
      },
      timeManagement: {
        type: Boolean,
        default: false,
      },
      presentationSkills: {
        type: Boolean,
        default: false,
      },
    },

    languages: {
      nativeLanguage: {
        language: {
          type: String,
        },
        level: {
          type: String,
        },
      },

      english: {
        level: {
          type: String,
          enum: ["Basic", "Intermediate", "Advanced", "Fluent"],
        },
        test: {
          type: String,
          enum: ["None", "IELTS", "TOEFL", "Duolingo"],
          default: "None",
        },
        score: {
          type: String,
        },
        certificateUrl: {
          type: String,
        },
      },

      foreignLanguage: {
        language: {
          type: String,
          trim: true,
        },
        level: {
          type: String,
          enum: ["Basic", "Intermediate", "Advanced", "Fluent"],
        },
        documentType: {
          type: String,
          enum: ["Certificate", "Diploma", "Transcript", "Other"],
        },
        certificateUrl: {
          type: String,
        },
      },

      localLanguage: {
        language: {
          type: String,
          trim: true,
        },
        level: {
          type: String,
          enum: ["Basic", "Intermediate", "Advanced", "Fluent"],
        },
      },
    },

    activities: [
      {
        type: {
          type: String,
        },

        fileUrl: {
          type: String,
          default: null,
        },
      },
    ],

    health: {
      specialDiseases: String,
      disabilityNeeds: String,
    },

    financial: {
      familyIncome: { type: Number },
      canPayTuition: {
        type: String,
      },
      canPayTravel: { type: String, default: "No" },
    },

    hobbies: {
      sports: String,
      freeTimeActivities: String,
    },

    goals: {
      purposeOfEducation: String,
      postStudyPlan: String,
    },

    preferences: {
      preferredFields: {
        type: [String],
      },
      preferredCountries: {
        type: [String],
      },
      preferredUniversities: {
        type: [String],
      },
      preferredStudyLevel: {
        type: String,
      },
    },

    supportingDocuments: {
      sop: Boolean,
      recommendationLetter: Boolean,
      cv: Boolean,
      researchProposal: Boolean,
      portfolio: Boolean,
    },

    contact: {
      permanentAddress: {
        province: String,
        district: String,
        area: String,
      },

      currentAddress: {
        province: String,
        district: String,
        area: String,
      },

      detailedAddress: String,

      phone: String,
      whatsapp: String,
      email: String,
      relativePhone: String,
    },

    studyType: {
      scholarshipOnly: {
        type: Boolean,
        default: false,
      },
      privateStudyOption: {
        type: Boolean,
        default: false,
      },
    },

    distinction: {
      specialSkills: {
        type: String,
      },
      achievements: {
        type: String,
      },
    },

    files: {
      sopUrl: {
        type: String,
        default: null,
      },
      recommendationLettersUrl: {
        type: String,
        default: null,
      },
      cvUrl: {
        type: String,
        default: null,
      },
      researchProposalUrl: {
        type: String,
        default: null,
      },
      portfolioUrl: {
        type: String,
        default: null,
      },
      nidUrl: {
        type: String,
        default: null,
      },
      passportUrl: {
        type: String,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.ScholarshipApplication ||
  mongoose.model("ScholarshipApplication", ScholarshipApplicationSchema);
