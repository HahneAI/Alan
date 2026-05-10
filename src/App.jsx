import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'

const PLACEHOLDER_SECTIONS = [
  { id: 'about',        label: 'About',        bg: 'bg-white' },
  { id: 'services',     label: 'Services',     bg: 'bg-slate-50' },
  { id: 'speaking',     label: 'Speaking',     bg: 'bg-white' },
  { id: 'testimonials', label: 'Testimonials', bg: 'bg-slate-50' },
  { id: 'contact',      label: 'Contact',      bg: 'bg-white' },
]

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        {PLACEHOLDER_SECTIONS.map(({ id, label, bg }) => (
          <section key={id} id={id} className={`${bg} py-24`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-sm text-slate-400 font-medium">{label} — coming soon</p>
            </div>
          </section>
        ))}
      </main>
    </>
  )
}
