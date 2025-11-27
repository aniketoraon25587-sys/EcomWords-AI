import React from 'react';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { LanguageIcon } from './icons/LanguageIcon';
import { SeoIcon } from './icons/SeoIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { TemplateIcon } from './icons/TemplateIcon';
import { PLANS } from '../constants';
import type { PlanDetails } from '../types';


interface HomePageProps {
    onSelectPlan: (plan: PlanDetails) => void;
}

const SectionTitle: React.FC<{ children: React.ReactNode, subtitle: string }> = ({ children, subtitle }) => (
    <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white">{children}</h2>
        <p className="text-lg text-gray-400 mt-2 max-w-2xl mx-auto">{subtitle}</p>
    </div>
);

const HomePage: React.FC<HomePageProps> = ({ onSelectPlan }) => {
  return (
    <div className="space-y-24 md:space-y-32">
        {/* Platform Logos */}
        <section className="text-center">
            <p className="text-gray-500 font-semibold mb-6 tracking-widest">TRUSTED BY SELLERS ON EVERY MAJOR PLATFORM</p>
            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-gray-600">
                {['Amazon', 'Shopify', 'Meesho', 'Flipkart', 'Instagram', 'WhatsApp'].map(platform => (
                    <span key={platform} className="text-xl font-bold tracking-wider">{platform.toUpperCase()}</span>
                ))}
            </div>
        </section>

        {/* Key Features */}
        <section id="features">
            <SectionTitle subtitle="From titles that grab attention to descriptions that convert, we've got you covered.">
                All-in-One Listing Toolkit
            </SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <FeatureCard icon={<SparklesIcon />} title="AI Description Generator" description="Creates long & short SEO-rich product descriptions in seconds." />
                <FeatureCard icon={<SeoIcon />} title="SEO Keyword Generator" description="Find highly searched keywords and meta tags to rank higher." />
                <FeatureCard icon={<TemplateIcon />} title="Platform Templates" description="Optimized formats for Amazon, Shopify, Instagram, and more." />
                <FeatureCard icon={<LanguageIcon />} title="Multi-Language Support" description="Generate listings in English, Hindi, and Hinglish effortlessly." />
            </div>
        </section>

        {/* How it works */}
        <section>
            <SectionTitle subtitle="Three simple steps to a perfect product listing. It’s that easy.">
                Get Started in 60 Seconds
            </SectionTitle>
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-brand-gray-light hidden md:block"></div>
                <div className="absolute top-1/2 left-0 w-full flex justify-around hidden md:flex">
                  <div className="w-4 h-4 rounded-full bg-royal-blue"></div>
                  <div className="w-4 h-4 rounded-full bg-royal-blue"></div>
                  <div className="w-4 h-4 rounded-full bg-royal-blue"></div>
                </div>
                <HowItWorksStep number="1" title="Enter Product Info" description="Add your product name and key features, or just upload an image." />
                <HowItWorksStep number="2" title="Choose Your Style" description="Select your e-commerce platform, tone of voice, and language." />
                <HowItWorksStep number="3" title="Generate & Export" description="Instantly get your complete listing. Copy, download, or save it." />
            </div>
        </section>
        
        {/* Pricing */}
        <section id="pricing">
            <SectionTitle subtitle="Choose a plan that scales with your business. Start for free, upgrade anytime.">
                Simple, Transparent Pricing
            </SectionTitle>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
                {PLANS.map(plan => (
                    <PricingCard key={plan.name} plan={plan} onSelect={onSelectPlan} />
                ))}
            </div>
        </section>

        {/* Testimonials */}
         <section>
            <SectionTitle subtitle="See what our users are saying about EcomWords AI.">
                Loved by Thousands of Sellers
            </SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <TestimonialCard quote="This tool is a game-changer. I cut my listing time by 90% and my sales have increased." author="Rohan Mehta, Amazon Seller" />
                <TestimonialCard quote="The Gen-Z tone is perfect for my Instagram store. The captions are fire!" author="Priya Sharma, D2C Brand Owner" />
                <TestimonialCard quote="As a freelancer, EcomWords AI lets me serve more clients with higher quality listings. Absolutely essential." author="Aarav Singh, Freelancer" />
            </div>
        </section>

        {/* Contact Us */}
        <section>
            <SectionTitle subtitle="We're here to help. Reach out to us with any questions or feedback.">
                Get in Touch
            </SectionTitle>
            <div className="text-center">
                <a 
                    href="mailto:ecomwordsai@gmail.com"
                    className="text-lg md:text-xl text-electric-cyan hover:text-royal-blue font-semibold underline transition-colors"
                >
                    ecomwordsai@gmail.com
                </a>
            </div>
        </section>
    </div>
  );
};

// Sub-components for HomePage

// FIX: Changed icon prop type to be more specific to fix cloneElement type error.
const FeatureCard: React.FC<{ icon: React.ReactElement<{ className?: string }>; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-brand-gray-medium p-6 rounded-xl border border-brand-gray-light text-center transform hover:-translate-y-2 transition-transform duration-300">
        <div className="mx-auto bg-brand-gray-dark w-16 h-16 rounded-full flex items-center justify-center text-royal-blue mb-4">
            {React.cloneElement(icon, { className: "w-8 h-8" })}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
    </div>
);

const HowItWorksStep: React.FC<{ number: string; title: string; description:string; }> = ({ number, title, description }) => (
    <div className="bg-brand-gray-medium p-6 rounded-xl border border-brand-gray-light z-10">
        <div className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-electric-cyan to-royal-blue mb-4">{number}</div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
    </div>
);

const PricingCard: React.FC<{ plan: PlanDetails, onSelect: (plan: PlanDetails) => void }> = ({ plan, onSelect }) => (
    <div className={`p-8 rounded-xl border relative overflow-hidden flex flex-col ${plan.isFeatured ? 'bg-brand-gray-medium border-royal-blue' : 'bg-brand-gray-dark border-brand-gray-light'}`}>
        {plan.isFeatured && <div className="absolute top-0 right-0 bg-royal-blue text-white text-xs font-bold px-4 py-1 rounded-bl-lg">MOST POPULAR</div>}
        <h3 className="text-xl font-bold text-white">{plan.name}</h3>
        <p className="text-gray-400 mt-1 h-10">{plan.description}</p>
        <div className="my-6">
          <span className="text-4xl font-extrabold text-white">{plan.price}</span>
          <span className="text-lg font-medium text-gray-400">{plan.pricePeriod}</span>
          {plan.yearlyPrice && <p className="text-sm text-electric-cyan mt-1">{plan.yearlyPrice}</p>}
        </div>
        <ul className="space-y-3 mb-8 flex-grow">
            {plan.features.map(feat => (
                <li key={feat} className="flex items-start text-gray-300">
                    <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-1"/>
                    <span>{feat}</span>
                </li>
            ))}
        </ul>
        <button onClick={() => onSelect(plan)} className={`block text-center w-full py-3 rounded-lg font-bold ${plan.isFeatured ? 'bg-royal-blue text-white hover:opacity-90' : 'bg-brand-gray-light text-white hover:bg-opacity-80'} transition-all`}>
            {plan.name === 'Free' ? 'Start for Free' : 'Choose Plan'}
        </button>
    </div>
);

const TestimonialCard: React.FC<{ quote: string, author: string }> = ({ quote, author }) => (
    <div className="bg-brand-gray-medium p-6 rounded-xl border border-brand-gray-light">
        <p className="text-gray-300 italic mb-4">"{quote}"</p>
        <p className="font-bold text-white">{author}</p>
    </div>
);

export default HomePage;