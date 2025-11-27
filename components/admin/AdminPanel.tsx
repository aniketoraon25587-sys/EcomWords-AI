import React, { useEffect, useState } from 'react';
import { getPayments, updatePaymentStatus } from '../../services/paymentService';
import { sendPlanActivatedEmail, sendPaymentRejectedEmail } from '../../services/emailService';
import { upgradeUserPlan } from '../../services/authService';
import { PaymentRecord, PlanDetails } from '../../types';
import { CheckIcon } from '../icons/CheckIcon';
import { XIcon } from '../icons/XIcon';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { SparklesIcon } from '../icons/SparklesIcon';

interface AdminPanelProps {
    onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
    const [payments, setPayments] = useState<PaymentRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    useEffect(() => {
        loadPayments();
    }, []);

    const showToast = (msg: string) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const loadPayments = async () => {
        setIsLoading(true);
        const data = await getPayments();
        setPayments(data);
        setIsLoading(false);
    };

    const handleApprove = async (record: PaymentRecord) => {
        if(!window.confirm(`Approve payment for ${record.userEmail}?`)) return;
        
        setProcessingId(record.id);
        try {
            await updatePaymentStatus(record.id, 'Approved');
            
            // Upgrade user's plan
            if (record.planName === 'Pro' || record.planName === 'Business') {
                await upgradeUserPlan(record.userEmail, record.planName);
            }
            
            await sendPlanActivatedEmail(record.userEmail, record.planName);
            showToast(`✅ Plan activated for ${record.userEmail}. Email sent.`);
            await loadPayments();
        } catch (e) {
            console.error(e);
            showToast("❌ Error activating plan.");
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (record: PaymentRecord) => {
        if(!window.confirm(`Reject payment for ${record.userEmail}?`)) return;

        setProcessingId(record.id);
        try {
            await updatePaymentStatus(record.id, 'Rejected');
            await sendPaymentRejectedEmail(record.userEmail, record.planName);
            showToast(`🚫 Payment rejected for ${record.userEmail}. Email sent.`);
            await loadPayments();
        } catch (e) {
            console.error(e);
            showToast("❌ Error rejecting payment.");
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="bg-brand-gray-dark min-h-screen p-4 md:p-8 text-white relative">
            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed bottom-8 right-8 bg-royal-blue text-white px-6 py-3 rounded-lg shadow-2xl animate-fade-in z-50 flex items-center">
                    <span className="font-medium">{toastMessage}</span>
                </div>
            )}

            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <button onClick={onClose} className="p-2 bg-brand-gray-medium rounded-lg hover:bg-brand-gray-light transition-colors">
                            <ArrowLeftIcon className="w-6 h-6" />
                        </button>
                         <div className="bg-gradient-to-br from-royal-blue to-electric-cyan p-2 rounded-lg">
                            <SparklesIcon className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    </div>
                    <div className="bg-royal-blue px-4 py-2 rounded-lg text-sm font-bold">
                        Manual Payments
                    </div>
                </div>

                <div className="bg-brand-gray-medium rounded-xl border border-brand-gray-light overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-deep-black border-b border-brand-gray-light text-gray-400 text-sm uppercase tracking-wider">
                                    <th className="p-4">Status</th>
                                    <th className="p-4">User</th>
                                    <th className="p-4">Mobile</th>
                                    <th className="p-4">Plan</th>
                                    <th className="p-4">Amount</th>
                                    <th className="p-4">UTR ID</th>
                                    <th className="p-4">Screenshot</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan={9} className="p-8 text-center text-gray-400">Loading requests...</td></tr>
                                ) : payments.length === 0 ? (
                                    <tr><td colSpan={9} className="p-8 text-center text-gray-400">No payment requests found.</td></tr>
                                ) : (
                                    payments.map((record) => (
                                        <tr key={record.id} className="border-b border-brand-gray-light hover:bg-brand-gray-dark transition-colors">
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                    record.status === 'Approved' ? 'bg-green-500/20 text-green-400' :
                                                    record.status === 'Rejected' ? 'bg-red-500/20 text-red-400' :
                                                    'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                    {record.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="p-4 font-medium">{record.userEmail}</td>
                                            <td className="p-4 font-mono">{record.mobileNumber}</td>
                                            <td className="p-4">{record.planName}</td>
                                            <td className="p-4 font-mono">{record.amount}</td>
                                            <td className="p-4 font-mono text-electric-cyan">{record.utr}</td>
                                            <td className="p-4 text-sm text-gray-400">{record.screenshotName}</td>
                                            <td className="p-4 text-sm text-gray-400">{new Date(record.date).toLocaleDateString()}</td>
                                            <td className="p-4">
                                                <div className="flex justify-end gap-2">
                                                    {record.status === 'Pending' && (
                                                        <>
                                                            <button 
                                                                onClick={() => handleApprove(record)} 
                                                                disabled={!!processingId}
                                                                className="p-2 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 disabled:opacity-50 transition-colors"
                                                                title="Approve & Activate"
                                                            >
                                                                <CheckIcon className="w-5 h-5" />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleReject(record)} 
                                                                disabled={!!processingId}
                                                                className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 disabled:opacity-50 transition-colors"
                                                                title="Reject"
                                                            >
                                                                <XIcon className="w-5 h-5" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <p className="mt-4 text-gray-500 text-sm text-center">
                    Approving a payment sends an activation email and upgrades the user's plan automatically.
                </p>
            </div>
        </div>
    );
};

export default AdminPanel;