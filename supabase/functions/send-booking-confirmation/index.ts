import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingConfirmationRequest {
  userEmail: string;
  userName?: string;
  companionName: string;
  bookingDate: string;
  startTime: string;
  durationHours: number;
  venueName: string;
  venueAddress: string;
  presenceNature: string;
  totalAmount: number;
  status: 'confirmed' | 'cancelled';
  bookingId: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      userEmail,
      userName,
      companionName, 
      bookingDate, 
      startTime, 
      durationHours,
      venueName, 
      venueAddress,
      presenceNature,
      totalAmount,
      status,
      bookingId
    }: BookingConfirmationRequest = await req.json();

    console.log("Sending booking confirmation email to user...");
    console.log("User email:", userEmail);
    console.log("Status:", status);
    console.log("Booking ID:", bookingId);

    const isConfirmed = status === 'confirmed';
    const subject = isConfirmed 
      ? `✅ Your Sathi Booking is Confirmed!` 
      : `❌ Booking Update - ${companionName}`;

    const statusColor = isConfirmed ? '#22c55e' : '#ef4444';
    const statusText = isConfirmed ? 'Confirmed' : 'Cancelled';
    const statusMessage = isConfirmed 
      ? 'Great news! Your presence booking has been confirmed.' 
      : 'We regret to inform you that your booking has been cancelled.';

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Sathi <onboarding@resend.dev>",
        to: [userEmail],
        subject: subject,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #1a1a2e; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #3d5a80, #4a6fa5); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
              .status-badge { display: inline-block; background: ${statusColor}; color: white; padding: 8px 20px; border-radius: 20px; font-weight: 600; margin-top: 15px; }
              .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 12px 12px; }
              .message { text-align: center; padding: 20px; font-size: 16px; }
              .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
              .detail-row:last-child { border-bottom: none; }
              .detail-label { color: #666; font-weight: 500; }
              .detail-value { color: #1a1a2e; font-weight: 600; text-align: right; }
              .amount { font-size: 24px; color: #3d5a80; }
              .companion-card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
              .companion-name { font-size: 20px; font-weight: 600; color: #3d5a80; margin-bottom: 5px; }
              ${isConfirmed ? `
              .next-steps { background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .next-steps h3 { color: #2e7d32; margin-bottom: 10px; }
              .next-steps ul { margin: 0; padding-left: 20px; }
              .next-steps li { margin: 8px 0; color: #1b5e20; }
              ` : ''}
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
              .help-text { background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Booking ${statusText}</h1>
                <span class="status-badge">${statusText.toUpperCase()}</span>
              </div>
              <div class="content">
                <div class="message">
                  <p>${statusMessage}</p>
                </div>
                
                <div class="companion-card">
                  <p style="color: #666; margin-bottom: 5px;">Your Companion</p>
                  <p class="companion-name">${companionName}</p>
                </div>

                <div class="booking-details">
                  <div class="detail-row">
                    <span class="detail-label">Booking ID</span>
                    <span class="detail-value">${bookingId.slice(0, 8)}...</span>
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
                    <span class="detail-label">Duration</span>
                    <span class="detail-value">${durationHours} hour${durationHours > 1 ? 's' : ''}</span>
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
                  <div class="detail-row">
                    <span class="detail-label">Total Amount</span>
                    <span class="detail-value amount">₹${totalAmount}</span>
                  </div>
                </div>

                ${isConfirmed ? `
                <div class="next-steps">
                  <h3>📋 What's Next?</h3>
                  <ul>
                    <li>Your companion will meet you at the specified venue</li>
                    <li>Please arrive on time for the best experience</li>
                    <li>Remember: Travel and meal costs are covered by you</li>
                    <li>All meetings must be in public places only</li>
                  </ul>
                </div>
                ` : `
                <div class="help-text">
                  <p>If you have any questions about this cancellation, please reach out to our support team.</p>
                </div>
                `}
              </div>
              <div class="footer">
                <p>Thank you for choosing Sathi</p>
                <p>The Luxury of Quiet Presence</p>
                <p style="margin-top: 15px;">© ${new Date().getFullYear()} Sathi. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    const emailResponse = await response.json();
    console.log("Email sent to user:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending confirmation:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
