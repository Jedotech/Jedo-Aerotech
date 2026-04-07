import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // 1. Verify that the request is coming from Vercel's Cron system
  const authHeader = request.headers.get('authorization');
  
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized Access Denied', { status: 401 });
  }

  // ... rest of your Sanity and Resend logic goes here
}