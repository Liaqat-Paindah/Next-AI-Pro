import {
  TrendingUp,
  Target,
  Send,
  Mail,
  UserCheck,
  FileCheck,
  Sparkles,
} from "lucide-react";

export interface Stage {
  key: string;
  title: string;
  description: string;
  shortDescription: string;
  icon: React.ElementType;
  fileAvailable?: boolean;
  estimatedTime?: string;
  recommendation?: string;
}

export const stages: Stage[] = [
  {
    key: "information_submission",
    title: "Information Submission",
    shortDescription: "Submit your academic details",
    description:
      "Submit all required information based on your education level (High School, Bachelor's, Master's, or PhD)",
    icon: FileCheck,
    fileAvailable: true,
    estimatedTime: "30 Min-2 Hours",
    recommendation:
      "Ensure all academic transcripts and identification documents are ready before starting this stage.",
  },
  {
    key: "eligibility_assessment",
    title: "Eligibility Assessment",
    shortDescription: "Check your qualification",
    description:
      "Your profile will be evaluated against international scholarship requirements and criteria",
    icon: UserCheck,
    fileAvailable: true,
    estimatedTime: "2-3 days",
    recommendation:
      "Review scholarship criteria carefully and highlight achievements that match their requirements.",
  },
  {
    key: "eligibility_alignment",
    title: "Eligibility Alignment",
    shortDescription: "Match requirements",
    description:
      "Align your qualifications with minimum scholarship requirements through targeted improvements",
    icon: Target,
    fileAvailable: true,
    estimatedTime: "3-5 days",
    recommendation:
      "Focus on addressing any gaps in your qualifications and strengthen key areas.",
  },
  {
    key: "competitive_enhancement",
    title: "Competitive Enhancement",
    shortDescription: "Boost your profile",
    description:
      "Strengthen your profile to increase competitiveness for international scholarships",
    icon: TrendingUp,
    fileAvailable: true,
    estimatedTime: "1-2 weeks",
    recommendation:
      "Consider adding new achievements or improving language test scores to stand out.",
  },
  {
    key: "application_customization",
    title: "Application Customization",
    shortDescription: "Personalize applications",
    description:
      "Customize your applications to align with each scholarship's specific goals and values",
    icon: Sparkles,
    fileAvailable: true,
    estimatedTime: "3-4 days",
  },
  {
    key: "application_submission",
    title: "Application Submission",
    shortDescription: "Submit applications",
    description:
      "Submit your completed scholarship applications through the official portals",
    icon: Send,
    fileAvailable: true,
    estimatedTime: "1-2 hours",
  },
  {
    key: "post_submission_followup",
    title: "Post-Submission Follow-Up",
    shortDescription: "Track and follow up",
    description:
      "Engage in follow-up actions to increase visibility and demonstrate continued interest",
    icon: Mail,
    fileAvailable: true,
    estimatedTime: "Ongoing",
  },
];
