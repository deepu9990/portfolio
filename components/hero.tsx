"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Download,
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const socialLinks = [
  {
    href: "https://linkedin.com/in/deepak29/",
    icon: Linkedin,
    bg: "bg-blue-100",
    text: "text-blue-600",
    hoverBg: "hover:bg-blue-600",
  },
  {
    href: "https://github.com/deepu9990",
    icon: Github,
    bg: "bg-slate-100",
    text: "text-slate-600",
    hoverBg: "hover:bg-slate-800",
  },
  {
    href: "https://marketplace.visualstudio.com/publishers/deepu9990",
    icon: Globe,
    bg: "bg-green-100",
    text: "text-green-600",
    hoverBg: "hover:bg-green-600",
  },
];

export default function Hero() {
  return (
    <section
      id="about"
      className="pt-24 sm:pt-32 pb-16 sm:pb-20 bg-gradient-to-b from-slate-50 to-white overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="md:w-1/2 text-center md:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-4 inline-block"
            >
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-1.5 text-sm font-medium">
                React Developer
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl font-semibold mb-4 sm:mb-6 text-slate-800"
            >
              Deepak{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Sharma
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-base sm:text-lg text-slate-500 mb-6 sm:mb-8 leading-relaxed"
            >
              Experienced React Developer proficient in building scalable web
              applications with modern frontend technologies. Adept
              problem-solver with expertise in React, TypeScript, and state
              management solutions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4 mb-6 sm:mb-8"
            >
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span>Gurugram, Haryana</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Mail className="w-4 h-4 text-blue-500" />
                <span>dsadeepak29@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Phone className="w-4 h-4 text-blue-500" />
                <span>+91 84477 97002</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4"
            >
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                <a href="#contact">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Me
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent hover:-translate-y-0.5 transition-all duration-300"
              >
                <a href="/Deepak_Sharma.pdf" download>
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </a>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:w-1/2 relative mt-8 md:mt-0"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto flex items-center justify-center relative overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 opacity-80" />
              <Image
                src="/deepak_sharma.png"
                alt="Deepak Sharma"
                width={208}
                height={208}
                className="relative z-10 w-36 h-36 md:w-52 md:h-52 object-cover object-top rounded-full border-4 border-white shadow-lg"
                priority
              />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-300 rounded-full opacity-30 animate-pulse" />
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-300 rounded-full opacity-30 animate-pulse" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white shadow-xl rounded-full p-3 flex gap-4"
            >
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 ${link.bg} ${link.text} rounded-full flex items-center justify-center ${link.hoverBg} hover:text-white transition-all duration-300 hover:scale-110`}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
