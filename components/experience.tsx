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
    title: "Senior Software Engineer L1",
    company: "Gemini Solutions",
    location: "Gurgaon, India",
    period: "Jul 2024 - Present",
    client: "Real Estate Enterprise – Helpdesk Portals & Internal Tools",
    achievements: [
      "Built a scalable React app from scratch with TypeScript and Vite, implementing smart module loading and Lottie-based animations for seamless UX.",
      "Created a JSON-driven Form Builder with 100+ dynamic helpdesk flows and full admin control over form logic and validations.",
      "Developed a secure Node.js middleware using JWT for role-based access, with a fallback to Fetch API when Axios failed in production.",
      "Optimized UI performance by memoizing components, lazy loading routes, and compressing assets for a faster initial load.",
    ],
  },
  {
    title: "Software Engineer L2",
    company: "Gemini Solutions",
    location: "Gurgaon, India",
    period: "Apr 2023 – Jun 2024",
    client: "Insurance CRM SaaS Platform – Serverless Microservices & Frontend",
    achievements: [
      "Architected and deployed a scalable serverless backend using AWS Lambda, API Gateway, and SQS for decoupled, event-driven workflows.",
      "Built a modular micro-frontend with Webpack 5 Module Federation and deployed it on EC2 behind Nginx.",
      "Migrated legacy systems to modern React apps with improved UX, reusable components, and centralized API utilities.",
      "Set up S3-based asset hosting with CloudFront CDN for faster global delivery and caching.",
    ],
  },
  {
    title: "Software Engineer L1",
    company: "Gemini Solutions",
    location: "Gurgaon, India",
    period: "Jan 2022 – Apr 2023",
    client:
      "Tech Startup – E-Commerce, Services, Investment & Community Domains",
    achievements: [
      "Worked on 5 cross-platform applications using React, TypeScript, Tailwind CSS, and Vite, with a modular architecture and consistent routing/layout systems.",
      "Created REST APIs with Node.js/Express and handled PostgreSQL-based workflows for both transactional and analytical needs.",
      "Integrated WebRTC for real-time video chat, with automated recording, cloud storage, and FFmpeg-based format conversion.",
      "Deployed assets via AWS S3, CloudFront, and Route53; contributed to Docker-based CI/CD using Bitbucket Pipelines.",
      "Optimized APIs and DB queries for key modules, reducing response time by 60%, and scaled infra to support 10K+ concurrent users for live events.",
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
              My professional journey building scalable applications and leading
              development teams
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
