"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [count, setCount] = useState(null);
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadCount() {
    try {
      const response = await fetch("/api/subscribe", { cache: "no-store" });
      const data = await response.json();
      if (data.success) setCount(data.count);
    } catch {}
  }

  useEffect(() => {
    loadCount();
    const interval = setInterval(loadCount, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (status === "success") {
      gsap.fromTo(".subscribe-message", { y: 10, opacity: 0, scale: .96 }, { y: 0, opacity: 1, scale: 1, duration: .55, ease: "back.out(1.7)" });
      gsap.fromTo(".count-pill", { scale: .92 }, { scale: 1, duration: .65, ease: "elastic.out(1,.5)" });
    }
  }, [status]);

  async function handleSubmit(event) {
  event.preventDefault();

  const normalizedEmail = email
    .trim()
    .toLowerCase();

  if (!normalizedEmail) {
    setStatus("error");
    setMessage("Enter your email address.");
    return;
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!emailRegex.test(normalizedEmail)) {
    setStatus("error");
    setMessage(
      "Please enter a valid email address."
    );
    return;
  }

  setLoading(true);
  setStatus("");
  setMessage("");

  try {
    const response = await fetch("/api/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: normalizedEmail,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setStatus(
        data.alreadySubscribed
          ? "info"
          : "error"
      );

      setMessage(
        data.error ||
          "Unable to subscribe right now."
      );

      if (typeof data.count === "number") {
        setCount(data.count);
      }

      return;
    }

    setCount(data.count);
    setEmail("");
    setStatus("success");

    setMessage(
      "Check your inbox to verify your email."
    );
  } catch {
    setStatus("error");
    setMessage(
      "Network error. Please try again."
    );
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="group relative">
        <div className="absolute -inset-1 rounded-[1.4rem] bg-gradient-to-r from-violet-500/20 via-white/10 to-cyan-400/20 opacity-0 blur-xl transition-opacity duration-500 group-focus-within:opacity-100" />
        <div className="relative flex flex-col gap-2 rounded-[1.25rem] border border-white/10 bg-white/[.055] p-2 shadow-2xl backdrop-blur-xl sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email address"
            autoComplete="email"
            aria-label="Email address"
            disabled={loading}
            className="h-14 min-w-0 flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/25 disabled:opacity-50 sm:h-12"
          />

          <button
            type="submit"
            disabled={loading}
            className="relative h-14 overflow-hidden rounded-xl bg-white px-7 text-sm font-bold text-black transition duration-300 hover:scale-[1.015] active:scale-[.985] disabled:cursor-not-allowed disabled:opacity-50 sm:h-12"
          >
            <span>{loading ? "Joining..." : "Join Kartifies"}</span>
          </button>
        </div>
      </form>

      <div className="mt-4 min-h-6 text-sm">
        {status === "success" && (
  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
    <p className="font-medium text-white">
      Check your inbox.
    </p>

    <p className="mt-1 text-sm text-white/45">
      We sent you a verification link.
      Your spot is confirmed after verification.
    </p>
  </div>
)}
        {status === "error" && <p className="subscribe-message text-red-400">{message}</p>}
        {status === "info" && <p className="subscribe-message text-amber-300">{message}</p>}
      </div>

      <div className="count-pill mt-5 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[.045] px-4 py-2.5 text-xs text-white/45 backdrop-blur-xl">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <span>
          <strong className="text-white">{count === null ? "—" : count.toLocaleString("en-IN")}</strong>{" "}
          people are already in · refreshes every 30 min
        </span>
      </div>
    </div>
  );
}
