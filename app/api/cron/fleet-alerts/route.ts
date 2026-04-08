import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { Resend } from 'resend';

// Initialize Clients
const resend = new Resend(process.env.RESEND_API_KEY);
const client = createClient({
  projectId: 'm2pa474h',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN
});

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // 1. SECURITY HANDSHAKE
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized Access Denied' }, { status: 401 });
    }

    // 2. FETCH ACTIVE ASSETS
    const assets = await client.fetch(`*[_type == "fleetRecord" && status == "active"]`);
    
    // 3. GROUP BY AIRCRAFT (Tail Number)
    // This ensures one email per plane, listing all problematic tyres.
    const fleetGroups: Record<string, { email: string, items: any[] }> = {};

    assets.forEach((asset: any) => {
      const health = Math.round(((asset.maxDesignLife - asset.currentLandings) / asset.maxDesignLife) * 100);
      const milestones = [20, 10, 5, 0];
      
      // Trigger Logic: 
      // Hits a milestone OR is critical (< 5%) and hasn't been alerted for this specific percentage yet.
      const isCritical = health <= 5;
      const isNewMilestone = asset.lastAlertMilestone !== health;
      const shouldAlert = (milestones.includes(health) || isCritical) && isNewMilestone;

      if (shouldAlert) {
        if (!fleetGroups[asset.tailNumber]) {
          fleetGroups[asset.tailNumber] = { 
            email: asset.operatorEmail || 'sales@jedotech.com', 
            items: [] 
          };
        }
        fleetGroups[asset.tailNumber].items.push({ ...asset, health });
      }
    });

    let emailsSent = 0;

    // 4. DISPATCH BATCHED EMAILS
    for (const tailNumber in fleetGroups) {
      const { email, items } = fleetGroups[tailNumber];
      
      const tyreRowsHtml = items.map((item: any) => `
        <div style="background:#1e293b; padding:15px; margin-bottom:12px; border-radius:6px; border-left:4px solid ${item.health <= 5 ? '#ef4444' : '#f59e0b'};">
          <p style="margin:0; color:#94a3b8; font-size:11px; text-transform:uppercase; letter-spacing:1px;">Position: ${item.tyrePosition}</p>
          <p style="margin:5px 0; font-size:16px; color:#f8fafc;"><strong>${item.manufacturer} ${item.tyreModel || ''} (${item.retreadStatus})</strong></p>
          <p style="margin:0; font-size:12px; color:#cbd5e1;">S/N: <strong>${item.serialNumber}</strong> | P/N: <strong>${item.partNumber || 'N/A'}</strong></p>
          <p style="margin:8px 0 0 0; color:${item.health <= 5 ? '#f87171' : '#fbbf24'}; font-weight:bold; font-size:14px;">
            CURRENT HEALTH: ${item.health}% (${item.maxDesignLife - item.currentLandings} Landings Remaining)
          </p>
        </div>
      `).join('');

      const whatsappLink = `https://wa.me/919600038089?text=Hello%20Jedo%20Tech,%20I%20need%20to%20order%20parts%20for%20Aircraft%20${tailNumber}.%20Please%20provide%20a%20quote.`;

      await resend.emails.send({
        from: 'Jedo Tech Compliance <alerts@jedotech.com>',
        to: email,
        bcc: 'sales@jedotech.com',
        subject: `⚠️ MAINTENANCE ALERT: ${tailNumber} - Action Required`,
        html: `
          <div style="font-family:ui-monospace,monospace; background:#020617; color:#f8fafc; padding:30px; max-width:600px; margin:auto; border:1px solid #1e293b;">
            <h2 style="color:#06b6d4; margin-top:0; border-bottom:1px solid #1e293b; padding-bottom:10px;">[ JEDO TECH | FLEET COMMAND ]</h2>
            <p style="color:#94a3b8;">The following components for <strong>${tailNumber}</strong> have reached a compliance threshold. <strong>Parts need to be ordered to ensure continued airworthiness.</strong></p>
            
            <div style="margin:25px 0;">
              ${tyreRowsHtml}
            </div>

            <div style="text-align:center; margin-top:30px; padding-top:20px; border-top:1px solid #1e293b;">
              <p style="color:#94a3b8; font-size:13px; margin-bottom:15px;">Secure Sourcing & Logistics:</p>
              <a href="${whatsappLink}" style="background:#25d366; color:white; padding:12px 20px; text-decoration:none; border-radius:4px; font-weight:bold; display:inline-block; margin:5px;">ORDER VIA WHATSAPP</a>
              <a href="mailto:sales@jedotech.com?subject=Part%20Order%20Request%20-%20${tailNumber}" style="background:#06b6d4; color:#020617; padding:12px 20px; text-decoration:none; border-radius:4px; font-weight:bold; display:inline-block; margin:5px;">ORDER VIA EMAIL</a>
            </div>
            
            <p style="font-size:10px; color:#475569; margin-top:40px; text-align:center; letter-spacing:1px;">JEDO TECHNOLOGIES PVT LTD | SOURCING & COMPLIANCE AUTHORITY</p>
          </div>
        `
      });

      // Update Sanity for each processed asset
      for (const item of items) {
        await client.patch(item._id).set({ lastAlertMilestone: item.health }).commit();
      }
      emailsSent++;
    }

    return NextResponse.json({ 
      success: true, 
      processedAircraft: Object.keys(fleetGroups).length,
      emailsSent 
    });

  } catch (error: any) {
    console.error("CRON ERROR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}