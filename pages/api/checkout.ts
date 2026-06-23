import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { plan, formData } = req.body

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  try {
    const priceMap: Record<string, number> = {
      single: 900,  // $9.00
      pro:    1900, // $19.00
    }

    const amount = priceMap[plan] || 900

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: plan === 'pro' ? 'subscription' : 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: plan === 'pro' ? 'Contractly Pro · Contratos ilimitados' : 'Contractly · Un contrato profesional',
              description: plan === 'pro'
                ? 'Genera contratos freelance ilimitados con IA cada mes'
                : 'Un contrato profesional con 13 cláusulas legales + PDF',
              images: [`${appUrl}/og-product.png`],
            },
            unit_amount: amount,
            ...(plan === 'pro' ? { recurring: { interval: 'month' } } : {}),
          },
          quantity: 1,
        },
      ],
      metadata: {
        plan,
        freelancerName: formData?.freelancerName || '',
        clientName:     formData?.clientName     || '',
      },
      customer_email: formData?.freelancerEmail || undefined,
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
      cancel_url:  `${appUrl}/app?cancelled=true`,
      allow_promotion_codes: true,
    })

    return res.status(200).json({ url: session.url, sessionId: session.id })
  } catch (err: any) {
    console.error('Stripe error:', err)
    return res.status(500).json({ error: err.message })
  }
}
