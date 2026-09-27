import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { connectDB } from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function GET() {
  try {
    await connectDB();
    const count = await Subscriber.countDocuments();

    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error("Subscriber count error:", error);
    return NextResponse.json(
      { success: false, error: "Unable to load subscriber count." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(body?.email);

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await Subscriber.findOne({ email }).lean();

    if (existing) {
      const count = await Subscriber.countDocuments();

      return NextResponse.json(
        {
          success: false,
          alreadySubscribed: true,
          count,
          error: "This email is already subscribed.",
        },
        { status: 409 }
      );
    }

    const subscriber = await Subscriber.create({ email });

    try {
      await resend.emails.send({
        from:
          process.env.RESEND_FROM_EMAIL,
        to: [email],
        subject: "You’re subscribed to Kartifies!",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:32px;color:#111827">
            <div style="font-size:28px;font-weight:800;margin-bottom:24px">kartifies</div>
            <h1 style="font-size:30px;margin-bottom:12px">You’re subscribed to Kartifies!</h1>
            <p style="font-size:16px;line-height:1.7;color:#4b5563">
              Thanks for joining the Kartifies early-access list.
              We’ll keep you updated about the launch, new features and important product updates.
            </p>
            <div style="margin:28px 0;padding:18px;border-radius:14px;background:#f3f4f6">
              <strong>Subscribed email</strong><br/>
              ${email}
            </div>
            <p style="font-size:14px;color:#6b7280">
              You’re now part of the Kartifies community.
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      // The subscription is already saved. Do not roll it back if email delivery fails.
      console.error("Confirmation email error:", emailError);
    }

    const count = await Subscriber.countDocuments();

    return NextResponse.json({
      success: true,
      count,
      message: "You’re subscribed to Kartifies!",
      subscriberId: String(subscriber._id),
    });
  } catch (error) {
    if (error?.code === 11000) {
      const count = await Subscriber.countDocuments();
      return NextResponse.json(
        {
          success: false,
          alreadySubscribed: true,
          count,
          error: "This email is already subscribed.",
        },
        { status: 409 }
      );
    }

    console.error("Subscribe error:", error);

    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
