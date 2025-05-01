import { BADGE_CRITERIA } from "@/constants";

export interface SidebarLink {
  imgURL: string;
  route: string;
  label: string;
}

export interface Job {
  id: string;
  application_url: string;
  company_name: string;
  plain_text_description: string;
  html_description: string;
  publication_time: Date;
  source: string;
  title: string;
  location: string;
  salary: {
    currency: string;
    min_salary: number;
    max_salary: number;
    salary_type: string;
  };
}

export interface Country {
  name: {
    common: string;
  };
}

export interface ParamsProps {
  params: Promise<{ id: string }>;
}

export interface SearchParamsProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export interface URLProps extends ParamsProps, SearchParamsProps {}

export interface BadgeCounts {
  GOLD: number;
  SILVER: number;
  BRONZE: number;
}

export type BadgeCriteriaType = keyof typeof BADGE_CRITERIA;

export type ThemeMode = "dark" | "light" | "system";

export interface QuestionProps {
  _id: string;
  title: string;
  content: string;
  tags: { _id: string; name: string }[];
  author: UserProps;
  upvotes: string[];
  downvotes: string[];
  views: number;
  answers: AnswerProps[];
  createdAt: Date;
}

export interface UserProps {
  _id: string;
  clerkId: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  picture: string;
  location?: string;
  portfolioWebsite?: string;
  reputation?: number;
  saved: QuestionProps[];
  joinedAt: Date;
}

export interface TagProps {
  _id: string;
  name: string;
  description: string;
  questions: QuestionProps[];
  followers: UserProps[];
  createdAt: Date;
}

export interface AnswerProps {
  _id: string;
  author: UserProps;
  question: QuestionProps;
  content: string;
  upvotes: string[];
  downvotes: string[];
  createdAt: Date;
}