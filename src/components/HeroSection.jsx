export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center bg-slate-950 text-white pt-16"
    >
      {/* Subtle grid overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase mb-6">
          Executive Coach &amp; Keynote Speaker
        </p>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6 max-w-3xl">
          Transform Your Voice.{' '}
          <span className="text-slate-400">Lead With Impact.</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-lg mb-10 leading-relaxed">
          Work with Alan to unlock your leadership presence, sharpen your
          communication, and own every room you walk into.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-slate-900 text-sm font-semibold hover:bg-slate-100 transition-colors duration-150"
          >
            Book a Session
          </a>
          <a
            href="#speaking"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-slate-700 text-slate-300 text-sm font-medium hover:border-slate-500 hover:text-white transition-colors duration-150"
          >
            View Speaking Reel
          </a>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <span className="text-xs tracking-widest uppercase text-slate-400">Scroll</span>
          <span className="w-px h-8 bg-slate-400 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
