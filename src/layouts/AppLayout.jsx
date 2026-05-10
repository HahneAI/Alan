import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import BottomTabBar from '../components/BottomTabBar'

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setSidebarOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', sidebarOpen)
    return () => document.body.classList.remove('menu-open')
  }, [sidebarOpen])

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {sidebarOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        {/*
          page-pb-safe: on mobile adds tab-bar height (4rem) + safe-area-inset-bottom
          so content is never hidden behind the BottomTabBar or home indicator.
          At lg+ the tab bar is gone so only the design padding + safe area applies.
        */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10 page-pb-safe">
          <Outlet />
        </main>
      </div>

      {/* Bottom tab bar — replaces hamburger nav on mobile/tablet */}
      <BottomTabBar />
    </div>
  )
}
