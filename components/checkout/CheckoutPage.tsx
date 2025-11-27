

import React, { useState } from 'react';
import type { PlanDetails } from '../../types';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { UploadIcon } from '../icons/UploadIcon';
import { submitPayment } from '../../services/paymentService';
import { sendPaymentReceivedEmail } from '../../services/emailService';

interface CheckoutPageProps {
  plan: PlanDetails;
  onClose: () => void;
  userEmail?: string;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ plan, onClose, userEmail }) => {
  const [utr, setUtr] = useState('');
  const [screenshotName, setScreenshotName] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Generate QR Code URL
  // Strip currency symbol and commas to get raw amount (e.g., "299" or "999")
  const amount = plan.price.replace(/[^0-9]/g, '');
  const upiString = `upi://pay?pa=9131547252@ptyes&pn=EcomWordsAI&am=${amount}&cu=INR`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiString)}`;

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshotName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailToUse = userEmail || manualEmail;
    
    if (!emailToUse) {
        alert("Please enter your email address.");
        return;
    }

    if (!/^\d{10}$/.test(mobileNumber)) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }

    setIsSubmitting(true);

    try {
        // 1. Save to backend (Mock)
        await submitPayment({
            userEmail: emailToUse,
            mobileNumber: mobileNumber,
            planName: plan.name,
            amount: plan.price,
            utr: utr,
            screenshotName: screenshotName || 'screenshot.jpg'
        });

        // 2. Send Receipt Email (Simulated)
        await sendPaymentReceivedEmail(emailToUse, plan.name);

        setIsSuccess(true);
    } catch (error) {
        console.error(error);
        alert("Something went wrong. Please try again.");
        setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    const emailToUse = userEmail || manualEmail;
    return (
        <div className="fixed inset-0 bg-deep-black/90 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
            <div className="bg-brand-gray-dark border border-brand-gray-light rounded-xl w-full max-w-md p-8 text-center shadow-2xl">
                <div className="flex justify-center mb-6">
                    <div className="bg-green-500/20 p-4 rounded-full">
                        <CheckCircleIcon className="w-12 h-12 text-green-500" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Payment Submitted!</h2>
                <p className="text-gray-300 mb-6">
                    We have received your details. A confirmation email has been sent to <span className="text-electric-cyan font-medium">{emailToUse}</span>.
                </p>
                <p className="text-sm text-gray-500 mb-8">
                    Your plan will be activated within 24 hours after verification.
                </p>
                <button 
                    onClick={onClose}
                    className="w-full bg-royal-blue text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity"
                >
                    Return to Dashboard
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-deep-black/90 z-50 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
      <div className="relative bg-brand-gray-dark border border-brand-gray-light rounded-xl w-full max-w-4xl h-full max-h-[700px] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          {/* Left Panel: Plan Summary */}
          <div className="bg-brand-gray-medium p-8 flex flex-col">
            <button onClick={onClose} className="flex items-center text-gray-400 hover:text-white transition-colors mb-8">
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back
            </button>
            <h2 className="text-2xl font-bold text-white">{plan.name} Plan</h2>
            <p className="text-gray-400 mt-2 mb-6">{plan.description}</p>
            <div className="my-6">
              <span className="text-5xl font-extrabold text-white">{plan.price}</span>
              <span className="text-xl font-medium text-gray-400">{plan.pricePeriod}</span>
              {plan.yearlyPrice && <p className="text-md text-electric-cyan mt-1">{plan.yearlyPrice}</p>}
            </div>
            <div className="border-t border-brand-gray-light pt-6 flex-grow">
              <h3 className="font-bold text-white mb-4">Features included:</h3>
              <ul className="space-y-3">
                {plan.features.map(feat => (
                  <li key={feat} className="flex items-start text-gray-300">
                    <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-1"/>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Panel: Payment Options */}
          <div className="p-8 overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Payment Details</h2>
            <div className="bg-royal-blue/10 border border-royal-blue/50 rounded-lg p-4">
              <h3 className="text-lg font-bold text-white">Manual UPI Payment</h3>
              <p className="text-sm text-gray-400">Scan, Pay, and upload details for verification.</p>
            </div>
            
            <div className="flex flex-col items-center my-8 text-center">
                <div className="bg-white p-4 rounded-xl shadow-lg mb-4">
                    <img 
                      src={qrCodeUrl} 
                      alt="Payment QR Code" 
                      className="w-32 h-32 object-contain"
                    />
                </div>
                <p className="text-gray-300 mb-1">UPI ID: <span className="font-mono text-electric-cyan bg-brand-gray-light px-2 py-1 rounded select-all">9131547252@ptyes</span></p>
                <p className="text-sm text-gray-500 mb-4">Scan with any UPI app (Paytm, PhonePe, GPay)</p>
                
                <div className="w-full bg-brand-gray-medium rounded-lg p-3 border border-brand-gray-light">
                   <p className="text-gray-400 text-sm">Amount to Pay</p>
                   <p className="text-white font-bold text-2xl">{plan.price}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!userEmail && (
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Your Email</label>
                    <input
                      id="email"
                      type="email"
                      value={manualEmail}
                      onChange={(e) => setManualEmail(e.target.value)}
                      className="w-full bg-brand-gray-dark border border-brand-gray-light rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-royal-blue focus:outline-none"
                      required
                      placeholder="Where should we send the confirmation?"
                    />
                  </div>
              )}
               <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-300 mb-2">Mobile Number</label>
                <input
                  id="mobile"
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full bg-brand-gray-dark border border-brand-gray-light rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-royal-blue focus:outline-none"
                  required
                  placeholder="Enter your 10-digit mobile number"
                  pattern="\d{10}"
                  title="Please enter a valid 10-digit mobile number"
                />
              </div>
              <div>
                <label htmlFor="utr" className="block text-sm font-medium text-gray-300 mb-2">UTR / Transaction ID</label>
                <input
                  id="utr"
                  type="text"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  className="w-full bg-brand-gray-dark border border-brand-gray-light rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-royal-blue focus:outline-none"
                  required
                  placeholder="Enter the 12-digit transaction ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Upload Payment Screenshot</label>
                <label htmlFor="screenshotUpload" className="relative cursor-pointer bg-brand-gray-dark border-2 border-dashed border-brand-gray-light rounded-lg p-4 flex justify-center items-center text-gray-400 hover:border-royal-blue transition-colors group">
                  <UploadIcon className="w-6 h-6 mr-2 group-hover:text-royal-blue transition-colors" />
                  <span className="group-hover:text-white transition-colors">{screenshotName || 'Click to upload (JPG, PNG)'}</span>
                  <input id="screenshotUpload" type="file" className="sr-only" accept="image/png, image/jpeg" onChange={handleScreenshotUpload} required />
                </label>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-royal-blue to-electric-cyan text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50 hover:opacity-90 transition-opacity shadow-lg shadow-royal-blue/20">
                <span>{isSubmitting ? 'Submitting...' : 'Submit for Verification'}</span>
              </button>

              <p className="text-xs text-center text-gray-500">
                Your plan will be activated within 24 hours after successful verification. An email confirmation will be sent to you.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;