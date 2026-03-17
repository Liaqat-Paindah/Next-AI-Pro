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
  filePath: string;
  fileAvailable?: boolean;
  estimatedTime?: string;
  recommendation?: string;
}

export const stages: Stage[] = [
  {
    key: "information_submission",
    title: "Information Submission",
    shortDescription: "Providing required information",
    description:
      "At this stage, applicants submit the personal and academic information required for scholarship evaluation and registration.",
    icon: FileCheck,
    filePath: "application_guidlines.pdf",
    fileAvailable: true,
    estimatedTime: "30 Min-2 Hours",
    recommendation:
      "Ensure all academic transcripts and identification documents are ready before starting this stage.",
  },
  {
    key: "eligibility_assessment",
    title: "Eligibility Assessment",
    shortDescription: "Checking qualifications",
    description:
      "At this stage, we assess applicants’ profiles against the minimum criteria of international scholarships.",
    icon: UserCheck,
    filePath: "application_guidlines.pdf",
    fileAvailable: true,
    estimatedTime: "2-3 days",
    recommendation:
      "Review scholarship criteria carefully and highlight achievements that match their requirements.",
  },
  {
    key: "eligibility_alignment",
    title: "Eligibility Alignment",
    shortDescription: "Completing Qualification",
    description:
      "At this stage, we guide applicants in aligning their qualifications with scholarship requirements.",
    icon: Target,
    filePath: "application_guidlines.pdf",
    fileAvailable: true,
    estimatedTime: "3-5 days",
    recommendation:
      "Focus on addressing any gaps in your qualifications and strengthen key areas.",
  },
  {
    key: "competitive_enhancement",
    title: "Competitive Enhancement",
    shortDescription: "Building a strong profile",
    description:
      "At this stage, we help applicants strengthen their profiles to improve their scholarship competitiveness.",
    icon: TrendingUp,
    filePath: "application_guidlines.pdf",
    fileAvailable: true,
    estimatedTime: "1-2 weeks",
    recommendation:
      "Consider adding new achievements or improving language test scores to stand out.",
  },
  {
    key: "application_customization",
    title: "Application Customization",
    shortDescription: "Matching Goals and Values",
    description:
      "At this stage, we tailor each application to the goals and values of the target scholarship.",
    icon: Sparkles,
    filePath: "application_guidlines.pdf",
    fileAvailable: true,
    estimatedTime: "3-4 days",
  },
  {
    key: "application_guidlines",
    title: "Application Submission",
    shortDescription: "Submitting Professionally",
    description:
      "At this stage, we professionally prepare and submit applicants’ scholarship applications.",
    icon: Send,
    filePath: "application_guidlines.pdf",
    fileAvailable: true,
    estimatedTime: "1-2 hours",
  },
  {
    key: "post_submission_followup",
    title: "Post-Submission Follow-Up",
    shortDescription: "Following up effectively",
    description:
      "At this stage, we conduct strategic follow-ups to further support applicants’ chances of success.",
    icon: Mail,
    filePath: "application_guidlines.pdf",
    fileAvailable: true,
    estimatedTime: "Ongoing",
  },
];
