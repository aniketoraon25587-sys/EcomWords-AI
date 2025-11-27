
import { PaymentRecord } from '../types';

// Mock In-Memory Database
let payments: PaymentRecord[] = [];

export const submitPayment = async (paymentData: Omit<PaymentRecord, 'id' | 'status' | 'date'>): Promise<void> => {
  // Simulate API Call
  await new Promise(resolve => setTimeout(resolve, 1000));

  const newPayment: PaymentRecord = {
    ...paymentData,
    id: Math.random().toString(36).substr(2, 9).toUpperCase(),
    status: 'Pending',
    date: new Date().toISOString(),
  };
  
  payments = [newPayment, ...payments];
};

export const getPayments = async (): Promise<PaymentRecord[]> => {
    // Simulate API Call
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...payments];
};

export const updatePaymentStatus = async (id: string, status: 'Approved' | 'Rejected'): Promise<PaymentRecord | null> => {
    // Simulate API Call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const index = payments.findIndex(p => p.id === id);
    if (index !== -1) {
        payments[index] = { ...payments[index], status };
        return payments[index];
    }
    return null;
};
