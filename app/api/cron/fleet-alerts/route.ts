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

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const assets = await client.fetch(`*[_type == "fleetRecord" && status == "active"]`);
    const fleetGroups: Record<string, { email: string, items: any[] }> = {};

    assets.forEach((asset: any) => {
      const health = Math.round(((asset.maxDesignLife - asset.currentLandings) / asset.maxDesignLife) * 100);
      const milestones = [20, 10, 5, 0];
      
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

    for (const tailNumber in fleetGroups) {
      const { email, items } = fleetGroups[tailNumber];
      
      // BUILD THE LIST OF TIRES FOR THE EMAIL CONTENT
      const tyreRowsHtml = items.map((item: any) => `
        <div style="background:#1e293b; padding:15px; margin-bottom:12px; border-radius:6px; border-left:4px solid ${item.health <= 5 ? '#ef4444' : '#f59e0b'};">
          <p style="margin:0; color:#94a3b8; font-size:11px; text-transform:uppercase; letter-spacing:1px;">Component Identity</p>
          <p style="margin:5px 0; font-size:16px; color:#f8fafc;"><strong>${item.tyrePosition}: ${item.manufacturer} (${item.retreadStatus})</strong></p>
          
          <div style="background:#0f172a; padding:10px; border-radius:4px; margin:10px 0;">
            <p style="margin:0; font-size:13px; color:#38bdf8;">PART NUMBER (P/N): <strong>${item.partNumber || 'N/A'}</strong></p>
            <p style="margin:5px 0 0 0; font-size:13px; color:#38bdf8;">SERIAL NUMBER (S/N): <strong>${item.serialNumber}</strong></p>
          </div>

          <p style="margin:8px 0 0 0; color:${item.health <= 5 ? '#f87171' : '#fbbf24'}; font-weight:bold; font-size:14px;">
            CURRENT STATUS: ${item.health}% Life Remaining (${item.maxDesignLife - item.currentLandings} Landings Left)
          </p>
          <p style="margin:5px 0 0 0; color:#94a3b8; font-size:12px; font-style:italic;">⚠️ Action: Replacement parts need to be ordered immediately.</p>
        </div>
      `).join('');

      // BUILD WHATSAPP STRING WITH P/N AND S/N INCLUDED
      const orderDetails = items.map(i => 
        `-%20${i.tyrePosition}:%20PN%20${i.partNumber || 'N/A'},%20SN%20${i.serialNumber}`
      ).join('%0A');
      
      const whatsappLink = `https://wa.me/919600038089?text=Hello%20Jedo%20Tech,%20I%20need%20to%20order%20parts%20for%20${tailNumber}:%0A${orderDetails}`;

      await resend.emails.send({
        from: 'Jedo Tech Compliance <alerts@jedotech.com>',
        to: email,
        bcc: 'sales@jedotech.com',
        subject: `⚠️ URGENT MAINTENANCE: ${tailNumber} - Parts Required`,
        html: `
          <div style="font-family:ui-monospace,monospace; background:#020617; color:#f8fafc; padding:30px; max-width:600px; margin:auto; border:1px solid #1e293b;">
            <h2 style="color:#06b6d4; margin-top:0; border-bottom:1px solid #1e293b; padding-bottom:10px;">[ JEDO TECH | FLEET COMMAND ]</h2>
            <p style="color:#94a3b8; font-size:14px;">
              Automated monitoring for <strong>${tailNumber}</strong> has detected components reaching critical thresholds. 
              <strong>Please review the Part Numbers (P/N) and Serial Numbers (S/N) below for order placement.</strong>
            </p>
            
            <div style="margin:25px 0;">
              ${tyreRowsHtml}
            </div>

            <div style="background:#0f172a; border:1px dashed #334155; padding:20px; text-align:center; border-radius:8px;">
              <p style="color:#f8fafc; margin-top:0; font-weight:bold;">Sourcing & Procurement</p>
              <p style="color:#94a3b8; font-size:12px; margin-bottom:20px;">Click below to initiate a priority order for these specific serial numbers.</p>
              <a href="${whatsappLink}" style="background:#25d366; color:white; padding:12px 20px; text-decoration:none; border-radius:4px; font-weight:bold; display:inline-block; margin:5px;">ORDER VIA WHATSAPP</a>
              <a href="mailto:sales@jedotech.com?subject=Order%20Request%20-%20${tailNumber}" style="background:#06b6d4; color:#020617; padding:12px 20px; text-decoration:none; border-radius:4px; font-weight:bold; display:inline-block; margin:5px;">ORDER VIA EMAIL</a>
            </div>
            
            <p style="font-size:10px; color:#475569; margin-top:40px; text-align:center;">JEDO TECHNOLOGIES PVT LTD | CHENNAI, INDIA</p>
          </div>
        `
      });

      for (const item of items) {
        await client.patch(item._id).set({ lastAlertMilestone: item.health }).commit();
      }
      emailsSent++;
    }

    return NextResponse.json({ success: true, emailsSent });
  } catch (error: any) {
    console.error("CRON ERROR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}