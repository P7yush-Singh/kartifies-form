import crypto from "crypto";
import { NextResponse } from "next/server";

import { resend } from "@/lib/resend";
import { connectDB } from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";

function normalizeEmail(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

function hashToken(token) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

export async function GET() {
  try {
    await connectDB();

    // IMPORTANT:
    // Only verified emails count.
    const count = await Subscriber.countDocuments({
      isVerified: true,
    });

    return NextResponse.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Subscriber count error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to load subscriber count.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const email = normalizeEmail(body?.email);

    // -----------------------------
    // EMAIL VALIDATION
    // -----------------------------

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter your email address.",
        },
        { status: 400 }
      );
    }

    if (email.length > 254) {
      return NextResponse.json(
        {
          success: false,
          error: "Email address is too long.",
        },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    // -----------------------------
    // CHECK EXISTING EMAIL
    // -----------------------------

    let subscriber = await Subscriber.findOne({
      email,
    });

    // Already verified
    if (subscriber?.isVerified) {
      const count = await Subscriber.countDocuments({
        isVerified: true,
      });

      return NextResponse.json(
        {
          success: false,
          alreadySubscribed: true,
          verified: true,
          count,
          error: "This email is already subscribed.",
        },
        { status: 409 }
      );
    }

    // -----------------------------
    // GENERATE VERIFICATION TOKEN
    // -----------------------------

    const rawToken = generateToken();
    const hashedToken = hashToken(rawToken);

    const verificationExpires = new Date(
      Date.now() + 30 * 60 * 1000
    );

    if (!subscriber) {
      subscriber = await Subscriber.create({
        email,
        isVerified: false,
        verificationToken: hashedToken,
        verificationExpires,
      });
    } else {
      subscriber.verificationToken = hashedToken;
      subscriber.verificationExpires = verificationExpires;

      await subscriber.save();
    }

    // -----------------------------
    // VERIFICATION URL
    // -----------------------------

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const verificationUrl =
      `${baseUrl}/subscribe/verify?token=${rawToken}`;

    // -----------------------------
    // SEND VERIFICATION EMAIL
    // -----------------------------

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: [email],
      subject: "Verify your Kartifies email",

      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: auto;
            padding: 40px 24px;
            color: #111;
          "
        >

          <div
            style="
              font-size: 30px;
              font-weight: 800;
              letter-spacing: -1px;
              margin-bottom: 32px;
            "
          >
            kartifies
          </div>

          <h1
            style="
              font-size: 32px;
              line-height: 1.2;
              margin-bottom: 16px;
            "
          >
            Verify your email
          </h1>

          <p
            style="
              font-size: 16px;
              line-height: 1.7;
              color: #555;
            "
          >
            You're almost in.

            Click the button below to verify your email
            and join the Kartifies early-access community.
          </p>

          <div style="margin: 32px 0;">
            <a
              href="${verificationUrl}"
              style="
                display: inline-block;
                padding: 15px 24px;
                background: #000;
                color: #fff;
                text-decoration: none;
                border-radius: 12px;
                font-weight: 600;
              "
            >
              Verify my email
            </a>
          </div>

          <p
            style="
              font-size: 13px;
              line-height: 1.6;
              color: #777;
            "
          >
            This verification link expires in 30 minutes.
          </p>

          <p
            style="
              font-size: 13px;
              line-height: 1.6;
              color: #999;
              margin-top: 32px;
            "
          >
            If you didn't request this, you can safely ignore this email.
          </p>

        </div>
      `,
    });

    // Pending subscribers should NOT increase count.
    const count = await Subscriber.countDocuments({
      isVerified: true,
    });

    return NextResponse.json({
      success: true,
      verified: false,
      count,
      message:
        "Verification email sent. Check your inbox.",
    });
  } catch (error) {
    console.error("Subscribe error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to process your subscription. Please try again.",
      },
      { status: 500 }
    );
  }
}