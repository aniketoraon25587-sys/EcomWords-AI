

export enum Template {
  AMAZON = 'Amazon',
  MEESHO = 'Meesho',
  FLIPKART = 'Flipkart',
  SHOPIFY = 'Shopify',
  INSTAGRAM = 'Instagram Caption',
  WEBSITE = 'Website Product Page',
}

export enum Tone {
  PROFESSIONAL = 'Professional',
  MINIMAL = 'Minimal',
  LUXURY = 'Luxury',
  STORYTELLING = 'Storytelling',
  GEN_Z = 'Gen-Z Viral',
  SALES_BOOSTER = 'Sales Booster',
}

export enum Language {
  ENGLISH = 'English',
  HINDI = 'Hindi',
  HINGLISH = 'Hinglish',
}

export enum DescriptionLength {
  SHORT = 'Short',
  LONG = 'Long',
}

export interface GenerationOptions {
  productName: string;
  features: string;
  template: Template;
  tone: Tone;
  language: Language;
  descriptionLength: DescriptionLength;
  image?: string; // base64 string
}

export interface GeneratedContent {
  titles: string[];
  description: string;
  bullets: string[];
  keywords: string[];
}

export interface User {
    id: string;
    email: string;
    name: string;
    picture?: string;
    plan: 'Free' | 'Pro' | 'Business';
    credits: number; // -1 for unlimited
}

export interface PlanDetails {
  name: string;
  price: string;
  pricePeriod: string;
  yearlyPrice?: string;
  description: string;
  features: string[];
  isFeatured: boolean;
}

export interface PaymentRecord {
  id: string;
  userEmail: string;
  mobileNumber: string;
  planName: string;
  amount: string;
  utr: string;
  screenshotName: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
}

export interface SavedListing extends GeneratedContent {
  id: string;
  savedAt: string;
  productName: string;
}