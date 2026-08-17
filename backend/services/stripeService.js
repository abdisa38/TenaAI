const Stripe = require('stripe');

let stripe = null;
if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_mock_stripe') {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

/**
 * Create a Tele-Doctor Consultation Billing Session (Stripe Sandbox)
 */
const createConsultationCheckout = async ({ caseId, patientName, amountETB = 250 }) => {
  try {
    if (stripe) {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Tele-Doctor Consultation Case #${caseId}`,
                description: `Emergency Health Post Tele-Medicine session for ${patientName}`
              },
              unit_amount: 500 // $5.00 USD equivalent simulation
            },
            quantity: 1
          }
        ],
        mode: 'payment',
        success_url: `http://localhost:5173/doctor-queue?session_id={CHECKOUT_SESSION_ID}&paid=true`,
        cancel_url: `http://localhost:5173/doctor-queue?canceled=true`
      });

      return { checkoutUrl: session.url, sessionId: session.id };
    }
  } catch (error) {
    console.warn(`[Stripe Warning] Failed to reach Stripe API (${error.message}). Returning mock checkout link.`);
  }

  // Mock Stripe checkout URL for development
  return {
    checkoutUrl: `http://localhost:5173/doctor-queue?mock_stripe=true&caseId=${caseId}`,
    sessionId: `cs_test_mock_${Date.now()}`
  };
};

module.exports = {
  createConsultationCheckout
};
