import crypto from "crypto";
import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";

function hashToken(token) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Verification token is missing.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const hashedToken = hashToken(token);

    const subscriber = await Subscriber.findOne({
      verificationToken: hashedToken,
    });

    if (!subscriber) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This verification link is invalid or has already been used.",
        },
        { status: 400 }
      );
    }

    if (
      !subscriber.verificationExpires ||
      subscriber.verificationExpires < new Date()
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This verification link has expired. Please request a new one.",
        },
        { status: 400 }
      );
    }

    if (subscriber.isVerified) {
      return NextResponse.json({
        success: true,
        alreadyVerified: true,
        message: "Your email is already verified.",
      });
    }

    subscriber.isVerified = true;
    subscriber.verifiedAt = new Date();

    // Token becomes unusable after verification.
    subscriber.verificationToken = null;
    subscriber.verificationExpires = null;

    await subscriber.save();

    const count = await Subscriber.countDocuments({
      isVerified: true,
    });

    return NextResponse.json({
      success: true,
      verified: true,
      count,
      message:
        "Your email has been verified successfully.",
    });
  } catch (error) {
    console.error("Email verification error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to verify your email. Please try again.",
      },
      { status: 500 }
    );
  }
}