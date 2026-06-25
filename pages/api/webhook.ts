import type { NextApiRequest, NextApiResponse } from 'next'

export const config = { api: { bodyParser: false } }

// Read raw body without 'micro' — works on Netlify, Vercel and Node
function getRawBody(req: NextApiRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  // Demo / no-Stripe mode
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(200).json({ received: true, demo: true })
  }

  const Stripe = (await import('stripe')).default
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20' as any,
  })

  const buf = await getRawBody(req)
  const sig = req.headers['stripe-signature']

  if (!sig) return res.status(400).send('Missing stripe-signature header')

  let event: any
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err: any) {
    console.error('Webhook signature error:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  switch (event.type) {
    case 'checkout.session.completed':
      console.log('Payment completed:', event.data.object.id, event.data.object.metadata)
      break
    case 'customer.subscription.deleted':
      console.log('Subscription cancelled:', event.data.object.id)
      break
    default:
      console.log(`Unhandled event: ${event.type}`)
  }

  res.status(200).json({ received: true })
}
