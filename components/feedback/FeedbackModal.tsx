import React, { useState } from 'react';
import { XIcon } from '../icons/XIcon';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';

interface FeedbackModalProps {
  onClose: () => void;
  onSubmit: (category: string, message: string) => Promise<void>;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ onClose, onSubmit }) => {
  const [category, setCategory] = useState('Suggestion');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      alert('Please enter your feedback.');
      return;
    }
    setIsSubmitting(true);
    await onSubmit(category, message);
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <div
      className="fixed inset-0 bg-deep-black/70 z-50 flex items-center justify-center p-4 animate-fade-in"
      aria-labelledby="feedback-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true"></div>

      <div className="relative bg-brand-gray-medium border border-brand-gray-light rounded-xl shadow-2xl w-full max-w-lg p-6 md:p-8 transform transition-all">
        {isSuccess ? (
          <div className="text-center">
             <div className="flex justify-center mb-6">
                <div className="bg-green-500/20 p-4 rounded-full">
                    <CheckCircleIcon className="w-12 h-12 text-green-500" />
                </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Thank You!</h2>
            <p className="text-gray-300 mb-6">
              Your feedback has been submitted. We appreciate you taking the time to help us improve.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-royal-blue text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 id="feedback-modal-title" className="text-2xl font-bold text-white">
                Submit Feedback
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="feedback-category" className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  id="feedback-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-brand-gray-dark border border-brand-gray-light rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-royal-blue focus:outline-none"
                >
                  <option>Suggestion</option>
                  <option>Bug Report</option>
                  <option>General Feedback</option>
                </select>
              </div>
              <div>
                <label htmlFor="feedback-message" className="block text-sm font-medium text-gray-300 mb-2">
                  Your Message
                </label>
                <textarea
                  id="feedback-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  placeholder="Tell us what you think or what we can improve..."
                  className="w-full bg-brand-gray-dark border border-brand-gray-light rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-royal-blue focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-royal-blue text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50 hover:opacity-90 transition-opacity"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
