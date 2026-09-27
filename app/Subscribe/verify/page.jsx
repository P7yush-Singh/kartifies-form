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
          `/api/subscribe/verify?token=${encodeURIComponent(
            token
          )}`,
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
      } catch {
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

        <p className="text-sm font-medium uppercase tracking-[0.3em] text-white/40">
          KARTIFIES
        </p>

        {status === "loading" && (
          <>
            <div className="mx-auto mt-10 h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />

            <h1 className="mt-8 text-3xl font-semibold">
              Verifying your email...
            </h1>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto mt-10 flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl text-black">
              ✓
            </div>

            <h1 className="mt-8 text-4xl font-semibold">
              You’re officially in.
            </h1>

            <p className="mt-4 text-white/50">
              {message}
            </p>

            <Link
              href="/subscribe"
              className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:scale-105"
            >
              Back to Kartifies
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto mt-10 flex h-16 w-16 items-center justify-center rounded-full border border-red-400/30 text-2xl text-red-400">
              !
            </div>

            <h1 className="mt-8 text-4xl font-semibold">
              Verification failed
            </h1>

            <p className="mt-4 text-white/50">
              {message}
            </p>

            <Link
              href="/subscribe"
              className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-black"
            >
              Try again
            </Link>
          </>
        )}

      </div>
    </main>
  );
}