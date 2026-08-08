"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface Job {
  title: string;
  company: string;
  location: string;
  period: string;
  client: string;
  achievements: string[];
}

const experience: Job[] = [
  {
    title: "Software Engineer Trainee",
    company: "Gemini Solutions",
    location: "Gurgaon",
    period: "Jan 2022 – Jul 2022",
    client: "Internal Platforms – Foundation & Delivery",
    achievements: [
      "Contributed to React-based UI modules and reusable component patterns for internal web applications.",
      "Supported Node.js/Express API development, validation flows, and bug fixes across onboarding and CRM modules.",
      "Strengthened fundamentals in Git workflows, code review practices, and production release processes.",
    ],
  },
  {
    title: "Software Engineer",
    company: "Gemini Solutions",
    location: "Gurgaon",
    period: "Jul 2022 – Mar 2024",
    client: "Sharemeister – Ahura & Athletic Estate",
    achievements: [
      "Developed cross-platform applications using React, TypeScript, and Node.js/Express with modular architecture.",
      "Engineered WebRTC video chat backend flows with automated FFmpeg transcoding and AWS S3 storage.",
      "Optimized REST APIs and PostgreSQL queries via indexing and refactoring for faster response times.",
    ],
  },
  {
    title: "Software Engineer L2",
    company: "Gemini Solutions",
    location: "Gurgaon",
    period: "Apr 2024 – Mar 2025",
    client: "Tata AIG Insurance – CRM Platform",
    achievements: [
      "Designed and deployed serverless microservices using AWS Lambda, API Gateway, SQS, and EventBridge — handled 5x traffic spikes.",
      "Built Micro-Frontend UIs with React, Webpack 5, and Module Federation; integrated backend services via REST APIs.",
      "Implemented a secure, event-driven MongoDB architecture processing 100K+ daily transactions.",
    ],
  },
  {
    title: "Software Engineer L1",
    company: "Gemini Solutions",
    location: "Gurgaon",
    period: "Jul 2022 – Mar 2024",
    client: "Emaar Group – Helpdesk Tool",
    achievements: [
      "Designed a JSON-driven form builder backed by Node.js/Express APIs — enabled 100+ configurable workflows, cut dev time by 40%.",
      "Led a team of 6 through Agile sprints; established code review and API design standards that reduced production bugs by 25%.",
      "Implemented Micro-Frontend + microservices architecture with Webpack 5 Module Federation, cutting release cycles by 50%.",
      "Owned the CI/CD pipeline & Nginx config (99.9% uptime); raised backend test coverage from 45% → 85% with Jest.",
    ],
  },
  {
    title: "Senior Software Engineer L1",
    company: "Gemini Solutions",
    location: "Gurgaon",
    period: "Apr 2025 – Mar 2026",
    client: "Tata AIG – User Management and Onboarding Platform",
    achievements: [
      "Architected and scaled frontend modules with React, TypeScript, and Redux for onboarding journeys used by enterprise operations.",
      "Automated Aadhaar, PAN, and document verification integrations, removing 80% manual entry and 40% duplicate code.",
      "Implemented role-based access flows and real-time approval notifications with WebSocket-driven status updates.",
      "Partnered with UX, QA, and backend teams to release stable features with zero post-release regressions.",
    ],
  },
  {
    title: "Senior Software Engineer L2",
    company: "Gemini Solutions",
    location: "Gurgaon",
    period: "Apr 2026 – Present",
    client: "Tata AIG – User Management & Onboarding Platform",
    achievements: [
      "Architected the onboarding platform's frontend and backend using React, Node.js/Express, and MongoDB — cut onboarding time by 60%.",
      "Built REST APIs for Aadhaar, PAN, and document verification, eliminating 80% of manual data entry and 40% of duplicate code.",
      "Implemented Role-Based Access Control at the API layer with WebSocket-driven notifications for real-time approval & status updates.",
      "Shipped zero post-release regressions by collaborating closely with frontend and QA teams on production-grade feature delivery.",
    ],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 sm:mb-16"
          >
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1">
              Career Path
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 mb-4">
              Work Experience
            </h2>
            <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto">
              4+ years building enterprise-grade platforms across insurance,
              real estate, and e-commerce domains
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 h-full w-1 bg-blue-100 rounded" />

            <div className="space-y-8 md:space-y-12">
              {experience.map((job, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative flex flex-col ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  } gap-4 md:gap-8 items-start md:items-center`}
                >
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 md:w-5 md:h-5 rounded-full bg-blue-600 border-4 border-blue-100 z-10" />

                  <div className="ml-10 md:ml-0 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-2 md:hidden">
                    {job.period}
                  </div>

                  <div
                    className={`ml-10 md:ml-0 md:w-1/2 ${
                      index % 2 === 0 ? "md:pr-12" : "md:pl-12"
                    }`}
                  >
                    <Card className="shadow-lg border-0 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                      <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-700 group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300" />
                      <CardHeader className="p-4 sm:p-6">
                        <div className="flex flex-col gap-2">
                          <CardTitle className="text-lg sm:text-xl text-slate-900 group-hover:text-blue-600 transition-colors font-semibold">
                            {job.title}
                          </CardTitle>
                          <CardDescription className="text-base sm:text-lg font-medium text-blue-600">
                            {job.company} • {job.location}
                          </CardDescription>
                          <div className="text-sm text-slate-500">
                            {job.client}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                        <ul className="space-y-2">
                          {job.achievements.map((achievement, i) => (
                            <li
                              key={i}
                              className="flex gap-2 text-sm text-slate-600"
                            >
                              <ChevronRight className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="hidden md:flex md:w-1/2 justify-center">
                    <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-medium">
                      {job.period}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
