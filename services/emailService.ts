
export const sendEmail = async (to: string, subject: string, body: string): Promise<void> => {
  // Simulate network delay for email service
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const timestamp = new Date().toLocaleTimeString();

  console.group(`%c📧 [EMAIL SENT] at ${timestamp}`, 'color: #00E1FF; font-weight: bold; font-size: 12px; border: 1px solid #00E1FF; padding: 4px; border-radius: 4px;');
  console.log(`%cTo:      %c${to}`, 'color: #888; font-weight: bold;', 'color: #fff;');
  console.log(`%cSubject: %c${subject}`, 'color: #888; font-weight: bold;', 'color: #fff; font-weight: bold;');
  console.log(`%c----------------------------------------`, 'color: #333;');
  console.log(`%c${body.trim()}`, 'color: #ccc; line-height: 1.5;');
  console.log(`%c----------------------------------------`, 'color: #333;');
  console.groupEnd();
};

export const sendPaymentReceivedEmail = async (email: string, planName: string) => {
    const subject = `Payment Verification Pending - ${planName} Plan`;
    const body = `
Hello,

We have received your manual payment request for the ${planName} Plan. 
Our team is currently verifying your UTR and screenshot.

This process typically takes 2-10 minutes.
You will receive another email once your plan is activated.

Thank you,
The EcomWords AI Team
    `;
    await sendEmail(email, subject, body);
};

export const sendPlanActivatedEmail = async (email: string, planName: string) => {
    const subject = `🎉 Payment Verified! Your ${planName} Plan is Active`;
    const body = `
Hello!

Great news! Your payment has been verified successfully.
Your ${planName} Plan is now ACTIVE.

You can now enjoy:
- Unlimited Generations
- Advanced SEO Tools
- Priority Support

Go to your dashboard to start generating amazing listings!

Cheers,
The EcomWords AI Team
    `;
    await sendEmail(email, subject, body);
};

export const sendPaymentRejectedEmail = async (email: string, planName: string) => {
    const subject = `Payment Verification Failed - ${planName} Plan`;
    const body = `
Hello,

We were unable to verify your payment for the ${planName} Plan.
This could be due to an incorrect UTR or an unclear screenshot.

Please verify your details and try submitting again.

Regards,
The EcomWords AI Team
    `;
    await sendEmail(email, subject, body);
};
