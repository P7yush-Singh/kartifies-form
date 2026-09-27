import SubscribeForm from "./SubscribeForm";

export const metadata = {
  title: "Join Kartifies",
  description:
    "Join the Kartifies early-access list and be the first to know when we launch.",
};

export default function SubscribePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f7f5] text-black">
      <section className="relative flex min-h-screen items-center px-6 py-16 sm:px-10">
        <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-black/5 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-black/5 blur-3xl" />

        <div className="relative mx-auto w-full max-w-6xl">
          <div className="grid items-center gap-16 lg:grid-cols-[1.15fr_.85fr]">
            <div>
              <div className="mb-10 inline-flex items-center rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium shadow-sm">
                <span className="mr-2 h-2 w-2 rounded-full bg-emerald-500" />
                Kartifies is coming soon
              </div>

              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-black/45">
                Early access
              </p>

              <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.05em] sm:text-7xl lg:text-8xl">
                The smarter way
                <br />
                to shop online.
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-black/55 sm:text-xl">
                Kartifies is building a faster, simpler and more modern
                shopping experience. Join the early-access list and be there
                from day one.
              </p>

              <div className="mt-10">
                <SubscribeForm />
              </div>

              <p className="mt-6 text-xs text-black/40">
                No spam. Only important Kartifies updates.
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-md">
              <div className="rotate-[-3deg] rounded-[2rem] border border-black/10 bg-white p-4 shadow-[0_30px_100px_rgba(0,0,0,0.12)]">
                <div className="rounded-[1.5rem] bg-black p-7 text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black tracking-tight">
                      kartifies
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
                      EARLY ACCESS
                    </span>
                  </div>

                  <div className="mt-20">
                    <p className="text-sm text-white/45">COMING SOON</p>
                    <h2 className="mt-3 text-4xl font-bold leading-tight">
                      Something
                      <br />
                      better is coming.
                    </h2>
                  </div>

                  <div className="mt-16 h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full w-[68%] rounded-full bg-white" />
                  </div>

                  <p className="mt-3 text-xs text-white/40">
                    Building the next shopping experience.
                  </p>
                </div>
              </div>

              <div className="absolute -bottom-8 -left-8 rounded-2xl border border-black/10 bg-white px-5 py-4 shadow-xl">
                <p className="text-xs font-medium uppercase tracking-wider text-black/40">
                  Community
                </p>
                <p className="mt-1 text-lg font-bold">You’re early.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
