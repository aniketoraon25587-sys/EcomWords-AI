
import React, { useState, useCallback, useEffect } from 'react';
import { type GeneratedContent, type GenerationOptions, type User, Template, Tone, Language, DescriptionLength } from '../types';
import { TEMPLATE_OPTIONS, TONE_OPTIONS, LANGUAGE_OPTIONS } from '../constants';
import { SparklesIcon } from './icons/SparklesIcon';
import { UploadIcon } from './icons/UploadIcon';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface GeneratorProps {
  onGenerate: (options: GenerationOptions) => void;
  isLoading: boolean;
  content: GeneratedContent | null;
  error: string | null;
  isAuthenticated: boolean;
  currentUser: User | null;
  onSave: (content: GeneratedContent, productName: string) => void;
}

const Generator: React.FC<GeneratorProps> = ({ onGenerate, isLoading, content, error, isAuthenticated, currentUser, onSave }) => {
  const [productName, setProductName] = useState('');
  const [features, setFeatures] = useState('');
  const [template, setTemplate] = useState<Template>(Template.AMAZON);
  const [tone, setTone] = useState<Tone>(Tone.PROFESSIONAL);
  const [language, setLanguage] = useState<Language>(Language.ENGLISH);
  const [descriptionLength, setDescriptionLength] = useState<DescriptionLength>(DescriptionLength.LONG);
  const [image, setImage] = useState<string | undefined>(undefined);
  const [imageName, setImageName] = useState('');

  const isFreePlan = isAuthenticated && currentUser?.plan === 'Free';
  const creditsRemaining = currentUser?.credits ?? 0;
  const noCredits = isFreePlan && creditsRemaining <= 0;

  useEffect(() => {
    // If user is on free plan, force language to English
    if (isFreePlan) {
      setLanguage(Language.ENGLISH);
    }
  }, [isFreePlan]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setImageName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
        // This case is handled by the overlay, but as a fallback
        alert("Please log in to generate content.");
        return;
    }
    if (!productName.trim()) {
        alert("Please provide a product name.");
        return;
    }
    onGenerate({ productName, features, template, tone, language, image, descriptionLength });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Form Section */}
      <div className={`bg-brand-gray-medium p-6 rounded-xl border border-brand-gray-light relative`}>
         {!isAuthenticated && <div className="absolute inset-0 bg-brand-gray-medium/70 z-10 flex items-center justify-center rounded-xl backdrop-blur-sm"><p className="text-white font-bold text-lg">Login to get started</p></div>}
        <form onSubmit={handleSubmit} className={`space-y-6 ${!isAuthenticated && 'opacity-50 pointer-events-none'}`}>
          <h2 className="text-2xl font-bold text-white mb-4">1. Enter Product Details</h2>
          
          <div>
            <label htmlFor="productName" className="block text-sm font-medium text-gray-300 mb-2">Product Name</label>
            <input
              id="productName"
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g., Ergonomic Office Chair"
              className="w-full bg-brand-gray-dark border border-brand-gray-light rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-royal-blue focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="features" className="block text-sm font-medium text-gray-300 mb-2">Key Features / Description (Optional)</label>
            <textarea
              id="features"
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder="e.g., Adjustable lumbar support, breathable mesh, 360-degree swivel, holds up to 300 lbs..."
              rows={5}
              className="w-full bg-brand-gray-dark border border-brand-gray-light rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-royal-blue focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description Length</label>
            <div className="flex bg-brand-gray-dark border border-brand-gray-light rounded-lg p-1">
              <button
                type="button"
                onClick={() => setDescriptionLength(DescriptionLength.LONG)}
                className={`w-1/2 py-2 rounded-md text-sm font-semibold transition-colors ${descriptionLength === DescriptionLength.LONG ? 'bg-royal-blue text-white' : 'text-gray-400 hover:bg-brand-gray-light'}`}
              >
                Long
              </button>
              <button
                type="button"
                onClick={() => setDescriptionLength(DescriptionLength.SHORT)}
                className={`w-1/2 py-2 rounded-md text-sm font-semibold transition-colors ${descriptionLength === DescriptionLength.SHORT ? 'bg-royal-blue text-white' : 'text-gray-400 hover:bg-brand-gray-light'}`}
              >
                Short
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">AI Vision - Image to Description (Optional)</label>
            <label htmlFor="imageUpload" className="relative cursor-pointer bg-brand-gray-dark border-2 border-dashed border-brand-gray-light rounded-lg p-4 flex justify-center items-center text-gray-400 hover:border-royal-blue transition-colors">
              <UploadIcon className="w-6 h-6 mr-2" />
              <span>{imageName || 'Upload Product Image'}</span>
              <input id="imageUpload" type="file" className="sr-only" accept="image/png, image/jpeg" onChange={handleImageUpload} />
            </label>
             {image && <img src={image} alt="Product preview" className="mt-4 rounded-lg max-h-40 mx-auto" />}
          </div>

          <h2 className="text-2xl font-bold text-white pt-4">2. Select Your Format</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="template" className="block text-sm font-medium text-gray-300 mb-2">Template</label>
              <select id="template" value={template} onChange={(e) => setTemplate(e.target.value as Template)} className="w-full bg-brand-gray-dark border border-brand-gray-light rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-royal-blue focus:outline-none">
                {TEMPLATE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="tone" className="block text-sm font-medium text-gray-300 mb-2">Tone</label>
              <select id="tone" value={tone} onChange={(e) => setTone(e.target.value as Tone)} className="w-full bg-brand-gray-dark border border-brand-gray-light rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-royal-blue focus:outline-none">
                {TONE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
             <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-2">Language</label>
              <select id="language" value={language} onChange={(e) => setLanguage(e.target.value as Language)} disabled={isFreePlan} className="w-full bg-brand-gray-dark border border-brand-gray-light rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-royal-blue focus:outline-none disabled:bg-brand-gray-dark/50 disabled:cursor-not-allowed">
                {LANGUAGE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              {isFreePlan && <p className="text-xs text-gray-500 mt-1">Upgrade to Pro for more languages.</p>}
            </div>
          </div>
          
          <button type="submit" disabled={isLoading || !isAuthenticated || noCredits} className="w-full bg-gradient-to-r from-royal-blue to-electric-cyan text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity">
            <SparklesIcon className="w-5 h-5" />
            <span>{isLoading ? 'Generating...' : noCredits ? 'No Credits Remaining' : 'Generate Listing'}</span>
          </button>

          {isFreePlan && (
            <p className="text-center text-sm text-gray-400">
                Credits Remaining: <span className="font-bold text-white">{creditsRemaining < 0 ? 0 : creditsRemaining}</span>
            </p>
          )}
          {noCredits && (
              <p className="text-center text-sm text-yellow-400 font-semibold">
                  Please <a href="#pricing" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="underline hover:text-yellow-300">upgrade your plan</a> to continue generating.
              </p>
          )}
        </form>
      </div>

      {/* Output Section */}
      <div className="bg-brand-gray-medium p-6 rounded-xl border border-brand-gray-light relative min-h-[500px]">
        {isLoading && <LoadingSkeleton />}
        {error && <div className="text-center text-red-400 p-8">{error}</div>}
        {!isLoading && !error && !content && <Placeholder />}
        {content && <OutputDisplay content={content} onSave={() => onSave(content, productName)} />}
      </div>
    </div>
  );
};

const OutputDisplay: React.FC<{ content: GeneratedContent; onSave: () => void; }> = ({ content, onSave }) => {
    const [isSaved, setIsSaved] = useState(false);
    
    const handleSave = () => {
        onSave();
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2500); // Reset after a while
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-end gap-2">
                 <button 
                    onClick={handleSave}
                    disabled={isSaved}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-royal-blue text-white rounded-lg hover:opacity-90 transition-opacity disabled:bg-green-500 disabled:opacity-100"
                >
                    {isSaved ? <CheckIcon className="w-5 h-5" /> : <DownloadIcon className="w-5 h-5" />}
                    {isSaved ? 'Saved!' : 'Save to Dashboard'}
                </button>
            </div>
            <OutputCard title="Titles" items={content.titles} />
            <OutputCard title="Description" textContent={content.description} />
            <OutputCard title="Bullet Points" items={content.bullets} />
            <OutputCard title="Keywords" items={content.keywords} />
        </div>
    );
};

interface OutputCardProps {
    title: string;
    items?: string[];
    textContent?: string;
}

const OutputCard: React.FC<OutputCardProps> = ({ title, items, textContent }) => {
    const [copied, setCopied] = useState(false);
    
    const handleCopy = () => {
        const textToCopy = textContent || (items || []).join('\n');
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-brand-gray-dark border border-brand-gray-light rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg text-white">{title}</h3>
                <button onClick={handleCopy} className="text-gray-400 hover:text-white transition-colors p-1">
                    {copied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5" />}
                </button>
            </div>
            {textContent && <p className="text-gray-300 whitespace-pre-wrap">{textContent}</p>}
            {items && (
                <ul className="space-y-2">
                    {items.map((item, index) => (
                        <li key={index} className="text-gray-300 bg-brand-gray-medium p-2 rounded">{item}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}


const LoadingSkeleton: React.FC = () => (
  <div className="absolute inset-0 bg-brand-gray-medium/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
      <div className="space-y-4 w-full p-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-brand-gray-dark p-4 rounded-lg animate-pulse">
            <div className="h-6 bg-brand-gray-light rounded w-1/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-brand-gray-light rounded w-full"></div>
              <div className="h-4 bg-brand-gray-light rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
  </div>
);

const Placeholder: React.FC = () => (
    <div className="text-center flex flex-col items-center justify-center h-full text-gray-500">
        <SparklesIcon className="w-16 h-16 mb-4 opacity-30"/>
        <h3 className="text-xl font-bold">Your AI-Generated Content Will Appear Here</h3>
        <p>Fill out the form and click "Generate" to get started.</p>
    </div>
);


export default Generator;
