"use client"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import { useEffect } from "react"

export default function Navigation() {
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash) {
        const element = document.querySelector(hash)
        if (element) {
          const headerOffset = 80
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          })
        }
      }
    }

    if (window.location.hash) {
      setTimeout(handleHashChange, 100)
    }

    window.addEventListener("hashchange", handleHashChange)

    const anchorLinks = document.querySelectorAll('a[href^="#"]')
    anchorLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const href = link.getAttribute("href")
        if (href) {
          window.location.hash = href
        }
      })
    })

    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="font-bold text-xl text-slate-800">Deepak Sharma</div>
          <div className="hidden md:flex space-x-8">
            <a href="#about" className="text-slate-600 hover:text-slate-900 transition-colors">
              About
            </a>
            <a href="#experience" className="text-slate-600 hover:text-slate-900 transition-colors">
              Experience
            </a>
            <a href="#skills" className="text-slate-600 hover:text-slate-900 transition-colors">
              Skills
            </a>
            <a href="#projects" className="text-slate-600 hover:text-slate-900 transition-colors">
              Projects
            </a>
            <a href="#awards" className="text-slate-600 hover:text-slate-900 transition-colors">
              Awards
            </a>
            <a href="#contact" className="text-slate-600 hover:text-slate-900 transition-colors">
              Contact
            </a>
          </div>
          <Button asChild size="sm" variant="outline" className="hidden md:flex bg-transparent">
            <a href="#contact">
              <Mail className="w-4 h-4 mr-2" />
              Contact Me
            </a>
          </Button>
        </div>
      </div>
    </nav>
  )
}
