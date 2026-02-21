import { ReactNode } from "react";

export interface IconProps {
  className?: string;
}

export interface StatsCardProps {
  number: string;
  label: string;
  index: number;
}

export interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  features: string[];
  index: number;
}

export interface TeamMemberProps {
  name: string;
  role: string;
  bio: string;
  image: string;
  index: number;
}

export interface TimelineItemProps {
  year: string;
  title: string;
  description: string;
  index: number;
}

export interface ValueItem {
  title: string;
  desc: string;
}