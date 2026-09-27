"use client";

import { useLayoutEffect, useRef } from "react";
import SubscribeForm from "./SubscribeForm";
import gsap from "gsap";
import CustomCursor from "@/components/CustomCursor";

export default function SubscribePage() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);

      const intro = gsap.timeline({
        defaults: { ease: "power4.out" },
      });

      intro
        .fromTo(q(".nav-item"), { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
        .fromTo(q(".eyebrow"), { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.4")
        .fromTo(
          q(".hero-word"),
          { yPercent: 110, opacity: 0, rotateX: -70 },
          { yPercent: 0, opacity: 1, rotateX: 0, duration: 1.05, stagger: 0.09 },
          "-=0.35"
        )
        .fromTo(q(".hero-copy"), { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.45")
        .fromTo(q(".signup-wrap"), { y: 35, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 0.85 }, "-=0.45")
        .fromTo(q(".trust-item"), { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 }, "-=0.35")
        .fromTo(q(".visual-card"), { x: 90, y: 30, opacity: 0, rotateY: 18, rotateZ: -6 }, { x: 0, y: 0, opacity: 1, rotateY: 0, rotateZ: -3, duration: 1.15, ease: "expo.out" }, "-=1");

      gsap.to(q(".orb-one"), {
        x: 45,
        y: -35,
        scale: 1.12,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(q(".orb-two"), {
        x: -35,
        y: 30,
        scale: 0.9,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(q(".float-card"), {
        y: -12,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        stagger: 0.35,
        ease: "sine.inOut",
      });

      gsap.to(q(".scan-line"), {
        yPercent: 900,
        duration: 3.5,
        repeat: -1,
        ease: "none",
      });

      const onMove = (event) => {
        const x = (event.clientX / window.innerWidth - 0.5) * 2;
        const y = (event.clientY / window.innerHeight - 0.5) * 2;

        gsap.to(q(".parallax"), {
          x: x * 12,
          y: y * 8,
          duration: 1,
          ease: "power3.out",
          overwrite: true,
        });

        gsap.to(q(".visual-card"), {
          rotateY: x * 4,
          rotateX: -y * 4,
          duration: 1.2,
          ease: "power3.out",
          overwrite: true,
        });
      };

      window.addEventListener("mousemove", onMove);

      return () => window.removeEventListener("mousemove", onMove);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <CustomCursor />
    <main ref={root} className="relative min-h-screen overflow-hidden bg-[#070707] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="orb-one absolute left-[8%] top-[5%] h-[28rem] w-[28rem] rounded-full bg-violet-600/15 blur-[130px]" />
        <div className="orb-two absolute bottom-[-10rem] right-[5%] h-[32rem] w-[32rem] rounded-full bg-cyan-400/10 blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.13]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px)", backgroundSize: "80px 80px" }} />
      </div>

      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-7 sm:px-10">
        <div className="nav-item flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-white font-black text-black">K</div>
          <span className="text-lg font-black tracking-[-.05em]">kartifies</span>
        </div>

        <div className="nav-item hidden items-center gap-2 rounded-full border border-white/10 bg-white/[.045] px-4 py-2 text-xs text-white/60 backdrop-blur-xl sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,.9)]" />
          Early access is open
        </div>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-88px)] max-w-7xl items-center gap-14 px-6 pb-20 pt-8 sm:px-10 lg:grid-cols-[1.05fr_.95fr]">
        <div>
          <div className="eyebrow mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.045] px-4 py-2 text-[10px] font-bold uppercase tracking-[.22em] text-white/50 backdrop-blur-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Kartifies / Early access
          </div>

          <h1 className="max-w-4xl text-6xl font-black leading-[.86] tracking-[-.075em] sm:text-8xl xl:text-[7.5rem]" style={{ perspective: "1000px" }}>
            <span className="block overflow-hidden"><span className="hero-word inline-block">Shopping,</span></span>
            <span className="block overflow-hidden"><span className="hero-word inline-block bg-gradient-to-r from-white via-white to-white/35 bg-clip-text text-transparent">reimagined.</span></span>
          </h1>

          <p className="hero-copy mt-8 max-w-xl text-base leading-7 text-white/45 sm:text-lg sm:leading-8">
            A faster, cleaner and more intelligent shopping experience is being built. Join the first wave of Kartifies.
          </p>

          <div className="signup-wrap mt-9">
            <SubscribeForm />
          </div>

          <div className="mt-7 flex flex-wrap gap-5 text-[10px] uppercase tracking-[.16em] text-white/25">
            <span className="trust-item">No spam</span>
            <span className="trust-item">Early access</span>
            <span className="trust-item">Launch updates</span>
          </div>
        </div>

        <div className="parallax relative mx-auto w-full max-w-[520px]">
          <div className="visual-card relative rounded-[2.5rem] border border-white/10 bg-white/[.055] p-3 shadow-[0_45px_130px_rgba(0,0,0,.55)] backdrop-blur-2xl" style={{ transformStyle: "preserve-3d" }}>
            <div className="relative min-h-[570px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#0c0c0c]">
              <div className="scan-line absolute -left-1/2 top-0 z-20 h-24 w-[200%] bg-gradient-to-b from-transparent via-white/[.08] to-transparent blur-xl" />

              <div className="flex items-center justify-between border-b border-white/10 px-7 py-6">
                <span className="text-xl font-black tracking-[-.05em]">kartifies</span>
                <span className="rounded-full border border-white/10 px-3 py-1.5 text-[9px] font-bold tracking-[.18em] text-white/35">PRE-LAUNCH</span>
              </div>

              <div className="px-7 pt-16">
                <p className="text-[9px] font-bold uppercase tracking-[.3em] text-white/25">The future is loading</p>
                <h2 className="mt-5 text-5xl font-black leading-[.9] tracking-[-.065em] sm:text-6xl">
                  Better
                  <br />
                  shopping
                  <br />
                  <span className="text-white/25">is near.</span>
                </h2>

                <div className="mt-14 grid grid-cols-2 gap-3">
                  {[
                    ["01", "Discover"],
                    ["02", "Compare"],
                    ["03", "Choose"],
                    ["04", "Enjoy"],
                  ].map(([n, label]) => (
                    <div key={n} className="rounded-2xl border border-white/10 bg-white/[.035] p-4 transition duration-500 hover:-translate-y-2 hover:bg-white/[.07]">
                      <span className="text-[9px] text-white/20">{n}</span>
                      <p className="mt-7 text-sm font-semibold text-white/65">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-white/[.025] px-7 py-6 backdrop-blur-xl">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[9px] uppercase tracking-[.2em] text-white/20">Status</p>
                    <p className="mt-1 text-sm font-semibold">Building in public</p>
                  </div>
                  <div className="w-28">
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[68%] rounded-full bg-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="float-card absolute -right-5 top-20 hidden rounded-2xl border border-white/10 bg-[#111]/80 px-5 py-4 shadow-2xl backdrop-blur-xl sm:block">
            <p className="text-[9px] uppercase tracking-[.2em] text-white/25">Signal</p>
            <p className="mt-1 text-sm font-bold">Something big.</p>
          </div>

          <div className="float-card absolute -bottom-7 -left-5 hidden rounded-2xl border border-white/10 bg-[#111]/80 px-5 py-4 shadow-2xl backdrop-blur-xl sm:block">
            <p className="text-[9px] uppercase tracking-[.2em] text-white/25">Status</p>
            <p className="mt-1 text-sm font-bold">You’re early.</p>
          </div>
        </div>
      </section>

      <div className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 text-[9px] uppercase tracking-[.3em] text-white/15">
        scroll / stay ahead
      </div>
    </main>
    </>
  );
}
