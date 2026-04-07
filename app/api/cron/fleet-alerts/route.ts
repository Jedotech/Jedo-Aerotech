import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { Resend } from 'resend';

// 1. Initialize inside the file but outside the handler
const resend = new Resend(process.env.RESEND_API_KEY);
const client = createClient({
  projectId: 'm2pa474h',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN
});

// Force dynamic execution to prevent Vercel caching the 'Unauthorized' response
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // 2. SECURITY CHECK
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.error("Cron Auth Failed");
      return new Response(JSON.stringify({ error: 'Unauthorized Access Denied' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 3. DATA FETCH
    const assets = await client.fetch(`*[_type == "fleetRecord" && status == "active"]`);
    let alertsSent = 0;

    // 4. LOGIC LOOP
    for (const asset of assets) {
      const health = ((asset.maxDesignLife - asset.currentLandings) / asset.maxDesignLife) * 100;
      const roundedHealth = Math.round(health);
      const milestones = [20, 10, 5, 0];

      if (milestones.includes(roundedHealth) && asset.lastAlertMilestone !== roundedHealth) {
        
        // Trigger Resend
        await resend.emails.send({
          from: 'Jedo Tech Alerts <alerts@jedotech.com>',
          to: asset.operatorEmail || 'sales@jedotech.com', // Fallback if email is missing
          bcc: 'sales@jedotech.com',
          subject: `⚠️ COMPLIANCE ALERT: ${asset.tailNumber} (${roundedHealth}% Life)`,
          html: `<div style="font-family:monospace; padding:20px; background:#020617; color:white;">
                  <h2>[ JEDO TECH ALERT ]</h2>
                  <p>Aircraft: ${asset.tailNumber}</p>
                  <p>Health: ${roundedHealth}%</p>
                 </div>`
        });

        // Update Sanity
        await client.patch(asset._id).set({ lastAlertMilestone: roundedHealth }).commit();
        alertsSent++;
      }
    }

    // 5. SUCCESS RESPONSE (Explicitly returned)
    return NextResponse.json({ 
      success: true, 
      processed: assets.length, 
      alertsSent: alertsSent 
    });

  } catch (error: any) {
    // 6. ERROR RESPONSE (Explicitly returned)
    console.error("CRON SYSTEM ERROR:", error.message);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}