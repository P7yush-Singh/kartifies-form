"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function VerifyPage() {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function verifyEmail() {
      try {
        const params = new URLSearchParams(
          window.location.search
        );

        const token = params.get("token");

        if (!token) {
          setStatus("error");
          setMessage("Verification token is missing.");
          return;
        }

        const response = await fetch(
          `/api/subscribe/verify?token=${encodeURIComponent(token)}`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setStatus("error");
          setMessage(
            data.error || "Verification failed."
          );
          return;
        }

        setStatus("success");
        setMessage(
          data.message ||
            "Your email has been verified successfully."
        );
      } catch (error) {
        console.error("Verification error:", error);

        setStatus("error");
        setMessage(
          "Something went wrong. Please try again."
        );
      }
    }

    verifyEmail();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="w-full max-w-lg text-center">

        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/40">
          KARTIFIES
        </p>

        {/* LOADING */}
        {status === "loading" && (
          <>
            <div className="mx-auto mt-10 h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />

            <h1 className="mt-8 text-3xl font-semibold">
              Verifying your email
            </h1>

            <p className="mt-3 text-white/45">
              Please wait while we confirm your email address.
            </p>
          </>
        )}

        {/* SUCCESS */}
        {status === "success" && (
          <>
            <div className="mx-auto mt-10 flex h-20 w-20 items-center justify-center rounded-full bg-white text-3xl text-black">
              ✓
            </div>

            <h1 className="mt-8 text-4xl font-semibold tracking-tight">
              You're officially in.
            </h1>

            <p className="mx-auto mt-4 max-w-md leading-7 text-white/50">
              {message}
            </p>

            <Link
              href="/Subscribe"
              className="mt-8 inline-flex rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition duration-300 hover:scale-105"
            >
              Back to Kartifies
            </Link>
          </>
        )}

        {/* ERROR */}
        {status === "error" && (
          <>
            <div className="mx-auto mt-10 flex h-20 w-20 items-center justify-center rounded-full border border-red-400/30 text-3xl text-red-400">
              !
            </div>

            <h1 className="mt-8 text-4xl font-semibold tracking-tight">
              Verification failed
            </h1>

            <p className="mx-auto mt-4 max-w-md leading-7 text-white/50">
              {message}
            </p>

            <Link
              href="/Subscribe"
              className="mt-8 inline-flex rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition duration-300 hover:scale-105"
            >
              Back to Kartifies
            </Link>
          </>
        )}

      </div>
    </main>
  );
}