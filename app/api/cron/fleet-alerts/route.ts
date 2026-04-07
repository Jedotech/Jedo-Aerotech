import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const client = createClient({
  projectId: 'm2pa474h',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN
});

export async function GET(request: NextRequest) {
  // 1. Security Check
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized Access Denied', { status: 401 });
  }

  try {
    const assets = await client.fetch(`*[_type == "fleetRecord" && status == "active"]`);
    let alertsSent = 0;

    for (const asset of assets) {
      const health = ((asset.maxDesignLife - asset.currentLandings) / asset.maxDesignLife) * 100;
      const roundedHealth = Math.round(health);
      const milestones = [20, 10, 5, 0];

      if (milestones.includes(roundedHealth) && asset.lastAlertMilestone !== roundedHealth) {
        await resend.emails.send({
          from: 'Jedo Tech Alerts <alerts@jedotech.com>',
          to: asset.operatorEmail,
          bcc: 'sales@jedotech.com',
          subject: `⚠️ COMPLIANCE ALERT: ${asset.tailNumber} (${roundedHealth}% Life)`,
          html: `<div style="font-family:monospace; padding:20px; background:#020617; color:white; border-radius:8px;">
                  <h2 style="color:#06b6d4;">[ JEDO TECH ALERT ]</h2>
                  <p>Aircraft <strong>${asset.tailNumber}</strong> requires maintenance attention.</p>
                  <p>Current Health: ${roundedHealth}%</p>
                  <p>S/N: ${asset.serialNumber}</p>
                  <hr style="border-color:#1e293b;"/>
                  <p style="font-size:10px; color:#64748b;">JEDO TECH VERIFIED</p>
                 </div>`
        });

        await client.patch(asset._id).set({ lastAlertMilestone: roundedHealth }).commit();
        alertsSent++;
      }
    }

    // --- CRITICAL FIX: ALWAYS RETURN A RESPONSE ---
    return NextResponse.json({ 
      success: true, 
      processed: assets.length, 
      alertsSent: alertsSent 
    });

  } catch (error: any) {
    console.error("Cron Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}