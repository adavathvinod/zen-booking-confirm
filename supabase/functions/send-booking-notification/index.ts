import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = "hyenabusiness01@gmail.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingNotificationRequest {
  userName: string;
  companionName: string;
  bookingDate: string;
  startTime: string;
  venueName: string;
  venueAddress: string;
  presenceNature: string;
  totalAmount: number;
  specialNotes?: string;
  bookingId: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      userName, 
      companionName, 
      bookingDate, 
      startTime, 
      venueName, 
      venueAddress,
      presenceNature,
      totalAmount,
      specialNotes,
      bookingId
    }: BookingNotificationRequest = await req.json();

    console.log("Sending booking notification email to admin...");
    console.log("Booking ID:", bookingId);
    console.log("User:", userName);
    console.log("Companion:", companionName);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Sathi <onboarding@resend.dev>",
        to: [ADMIN_EMAIL],
        subject: `🔔 New Booking Request - ${companionName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #1a1a2e; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #3d5a80, #4a6fa5); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
              .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px; }
              .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
              .detail-label { color: #666; font-weight: 500; }
              .detail-value { color: #1a1a2e; font-weight: 600; }
              .amount { font-size: 24px; color: #3d5a80; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
              .btn { display: inline-block; background: #3d5a80; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>New Booking Request</h1>
                <p>A new presence booking needs your attention</p>
              </div>
              <div class="content">
                <div class="booking-details">
                  <div class="detail-row">
                    <span class="detail-label">Booking ID</span>
                    <span class="detail-value">${bookingId.slice(0, 8)}...</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Client Email</span>
                    <span class="detail-value">${userName}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Companion</span>
                    <span class="detail-value">${companionName}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Date</span>
                    <span class="detail-value">${bookingDate}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Time</span>
                    <span class="detail-value">${startTime}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Venue</span>
                    <span class="detail-value">${venueName}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Address</span>
                    <span class="detail-value">${venueAddress}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Presence Type</span>
                    <span class="detail-value">${presenceNature.replace(/_/g, ' ')}</span>
                  </div>
                  ${specialNotes ? `
                  <div class="detail-row">
                    <span class="detail-label">Special Notes</span>
                    <span class="detail-value">${specialNotes}</span>
                  </div>
                  ` : ''}
                  <div class="detail-row" style="border-bottom: none;">
                    <span class="detail-label">Total Amount</span>
                    <span class="detail-value amount">₹${totalAmount}</span>
                  </div>
                </div>
                <p style="text-align: center;">
                  Please review this booking request and confirm or decline it in the admin dashboard.
                </p>
              </div>
              <div class="footer">
                <p>This is an automated notification from Sathi</p>
                <p>© ${new Date().getFullYear()} Sathi - The Luxury of Quiet Presence</p>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    const emailResponse = await response.json();
    console.log("Email sent to admin:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending notification:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
