
import { Template, Tone, Language, PlanDetails } from './types';

export const TEMPLATE_OPTIONS = [
  { value: Template.AMAZON, label: 'Amazon' },
  { value: Template.MEESHO, label: 'Meesho' },
  { value: Template.FLIPKART, label: 'Flipkart' },
  { value: Template.SHOPIFY, label: 'Shopify' },
  { value: Template.INSTAGRAM, label: 'Instagram Caption' },
  { value: Template.WEBSITE, label: 'Website Product Page' },
];

export const TONE_OPTIONS = [
  { value: Tone.PROFESSIONAL, label: 'Professional' },
  { value: Tone.MINIMAL, label: 'Minimal' },
  { value: Tone.LUXURY, label: 'Luxury' },
  { value: Tone.STORYTELLING, label: 'Storytelling' },
  { value: Tone.GEN_Z, label: 'Gen-Z Viral' },
  { value: Tone.SALES_BOOSTER, label: 'Sales Booster' },
];

export const LANGUAGE_OPTIONS = [
  { value: Language.ENGLISH, label: 'English' },
  { value: Language.HINDI, label: 'Hindi' },
  { value: Language.HINGLISH, label: 'Hinglish' },
];

export const PLANS: PlanDetails[] = [
  {
    name: 'Free',
    price: '₹0',
    pricePeriod: '',
    description: 'For individuals starting out and wanting to try the basics.',
    features: [
      '5 descriptions/day',
      'Limited templates',
      'Basic tones',
      'English language only',
    ],
    isFeatured: false,
  },
  {
    name: 'Pro',
    price: '₹299',
    pricePeriod: '/month',
    yearlyPrice: '₹2,499/year (Save 30%)',
    description: 'For sellers & freelancers who need unlimited power & features.',
    features: [
      'Unlimited descriptions',
      'All templates & tones',
      'SEO Keyword Generator',
      'All languages',
      'Export & Save listings',
      'Priority AI speed',
    ],
    isFeatured: true,
  },
  {
    name: 'Business',
    price: '₹999',
    pricePeriod: '/month',
    yearlyPrice: '₹8,999/year (Save 25%)',
    description: 'For agencies and teams managing multiple stores at scale.',
    features: [
      'Everything in Pro',
      '5 team members',
      'Bulk CSV generator',
      'Competitor Analyzer',
      'API Access',
      'Dedicated support',
    ],
    isFeatured: false,
  },
];
