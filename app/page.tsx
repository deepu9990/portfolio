"use client"
import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import Hero from "@/components/hero"
import Experience from "@/components/experience"
import Skills from "@/components/skills"
import Projects from "@/components/projects"
import Awards from "@/components/awards"
import Education from "@/components/education"
import Contact from "@/components/contact"
import Footer from "@/components/footer"

export default function Portfolio() {
  const [selectedTab, setSelectedTab] = useState("all")

  // Fix scrolling to anchored sections
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash) {
        const element = document.querySelector(hash)
        if (element) {
          // Add offset for fixed header
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

    // Handle initial hash on page load
    if (window.location.hash) {
      setTimeout(handleHashChange, 100)
    }

    // Add event listener for hash changes
    window.addEventListener("hashchange", handleHashChange)

    // Handle smooth scrolling for anchor links
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
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <Experience />
      <Skills />
      <Projects />
      <Awards />
      <Education />
      <Contact />
      <Footer />
    </div>
  )
}
