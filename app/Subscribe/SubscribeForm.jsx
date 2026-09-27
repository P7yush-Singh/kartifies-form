"use client";

import { useEffect, useState } from "react";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [count, setCount] = useState(null);
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadCount() {
    try {
      const response = await fetch("/api/subscribe", {
        cache: "no-store",
      });
      const data = await response.json();

      if (data.success) setCount(data.count);
    } catch {
      // Keep the current count if a refresh fails.
    }
  }

  useEffect(() => {
    loadCount();

    const interval = setInterval(loadCount, 60000 * 30);
    return () => clearInterval(interval);
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim()) {
      setStatus("error");
      setMessage("Enter your email address.");
      return;
    }

    setLoading(true);
    setStatus("");
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus(data.alreadySubscribed ? "info" : "error");
        setMessage(
          data.error || "Unable to subscribe right now."
        );

        if (typeof data.count === "number") {
          setCount(data.count);
        }

        return;
      }

      setCount(data.count);
      setEmail("");
      setStatus("success");
      setMessage("You’re subscribed to Kartifies! Check your inbox.");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email address"
          autoComplete="email"
          className="h-14 flex-1 rounded-2xl border border-black/10 bg-white px-5 text-base text-black outline-none transition placeholder:text-black/40 focus:border-black focus:ring-4 focus:ring-black/5"
          aria-label="Email address"
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className="h-14 rounded-2xl bg-black px-7 font-semibold text-white transition hover:scale-[1.01] hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Joining..." : "Join the waitlist"}
        </button>
      </form>

      <div className="mt-5 min-h-6 text-sm">
        {status === "success" && (
          <p className="text-emerald-600">{message}</p>
        )}
        {status === "error" && (
          <p className="text-red-600">{message}</p>
        )}
        {status === "info" && (
          <p className="text-amber-600">{message}</p>
        )}
      </div>

      <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-black/10 bg-white/70 px-4 py-2.5 text-sm shadow-sm backdrop-blur">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </span>

        <span className="text-black/60">
          <strong className="text-black">
            {count === null ? "—" : count.toLocaleString("en-IN")}
          </strong>{" "}
          people have joined
        </span>
      </div>
    </div>
  );
}
