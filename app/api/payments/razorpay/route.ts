import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { createClient } from '@/lib/supabase/server'
import * as crypto from 'crypto'

function getRazorpayClient() {
  if (!process.env.RAZORPAY_KEY || !process.env.RAZORPAY_SECRET) {
    return null
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
  })
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { amount, orderId } = await request.json()

    const razorpay = getRazorpayClient()
    if (!razorpay) {
      return NextResponse.json(
        { error: 'Razorpay is not configured' },
        { status: 500 }
      )
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `order_${orderId}`,
      payment_capture: 1,
    }

    const razorpayOrder = await razorpay.orders.create(options)

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY,
    })
  } catch (error: any) {
    console.error('Razorpay error:', error)
    return NextResponse.json(
      { error: error.message || 'Payment initialization failed' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { orderId, paymentId, signature } = await request.json()

    if (!process.env.RAZORPAY_SECRET) {
      return NextResponse.json(
        { error: 'Razorpay is not configured' },
        { status: 500 }
      )
    }

    // Verify payment signature
    const text = `${orderId}|${paymentId}`
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(text)
      .digest('hex')

    if (generatedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const supabase = await createClient()

    // Update order payment status
    const { error } = await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        payment_id: paymentId,
      })
      .eq('id', orderId)

    if (error) {
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: error.message || 'Payment verification failed' },
      { status: 500 }
    )
  }
}

