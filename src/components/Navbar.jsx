import { useState, useEffect } from 'react'

const NAV_LINKS = [
  { label: 'About',        href: '#about' },
  { label: 'Services',     href: '#services' },
  { label: 'Speaking',     href: '#speaking' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact',      href: '#contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    return () => document.body.classList.remove('menu-open')
  }, [open])

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100">
      <nav
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <a
          href="#"
          className="text-xl font-semibold tracking-tight text-slate-900 shrink-0"
        >
          Alan
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8" role="list">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                className="text-sm text-slate-500 hover:text-slate-900 transition-colors duration-150"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <a
          href="#contact"
          className="hidden md:inline-flex items-center px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors duration-150 shrink-0"
        >
          Book a Session
        </a>

        {/* Hamburger button */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="md:hidden relative flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-slate-100 transition-colors duration-150 gap-[5px]"
        >
          <span
            className={`block w-5 h-[2px] bg-slate-900 rounded-full transition-all duration-300 origin-center ${
              open ? 'rotate-45 translate-y-[7px]' : ''
            }`}
          />
          <span
            className={`block w-5 h-[2px] bg-slate-900 rounded-full transition-all duration-300 ${
              open ? 'opacity-0 scale-x-0' : ''
            }`}
          />
          <span
            className={`block w-5 h-[2px] bg-slate-900 rounded-full transition-all duration-300 origin-center ${
              open ? '-rotate-45 -translate-y-[7px]' : ''
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu — max-height transition avoids layout shift */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out ${
          open ? 'max-h-[400px]' : 'max-h-0'
        }`}
      >
        <ul
          className="border-t border-slate-100 px-4 pt-2 pb-4 space-y-0.5"
          role="list"
        >
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                onClick={() => setOpen(false)}
                className="block py-2.5 px-3 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors duration-150"
              >
                {label}
              </a>
            </li>
          ))}
          <li className="pt-2">
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="block py-2.5 px-3 text-sm font-medium text-center rounded-lg bg-slate-900 text-white hover:bg-slate-700 transition-colors duration-150"
            >
              Book a Session
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}
