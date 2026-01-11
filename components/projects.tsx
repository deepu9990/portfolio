"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Github, ExternalLink } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface Project {
  title: string;
  description: string;
  tags: string[];
  category: string;
  github?: string;
  link?: string;
}

const projects: Project[] = [
  {
    title: "MUI Smart Form Builder",
    description:
      "A comprehensive React component library for creating dynamic, Material-UI forms from JSON configuration with seamless Formik integration.",
    tags: ["React", "TypeScript", "Material UI", "Formik", "npm Package"],
    category: "opensource",
    github: "https://github.com/deepu9990/mui-smart-form-builder",
  },
  {
    title: "MUI Smart Table",
    description:
      "A smart, lightweight, scalable, customizable, and responsive table component built on top of MUI tables with modern React (hooks + TypeScript).",
    tags: ["React", "TypeScript", "Material UI", "Data Tables"],
    category: "opensource",
    github: "https://github.com/deepu9990/mui-smart-table",
  },
  {
    title: "MUI Snippets Pro (VS Code Extension)",
    description:
      "A comprehensive collection of Material UI (MUI) code snippets for VS Code with full TypeScript support and responsive design patterns. 115+ installs.",
    tags: ["VS Code Extension", "Material UI", "TypeScript", "Developer Tools"],
    category: "opensource",
    link: "https://marketplace.visualstudio.com/items?itemName=deepu9990.mui-snippets-pro",
  },
  {
    title: "Resume ATS Checker",
    description:
      "An intelligent resume analysis tool that helps job seekers optimize their resumes for Applicant Tracking Systems.",
    tags: ["React", "TypeScript", "AI/ML Integration"],
    category: "opensource",
    github: "https://github.com/deepu9990/resume-ats-checker",
  },
  {
    title: "Phurba - Real Estate Platform",
    description:
      "A modern real estate web platform with property listings, search functionality, and responsive design for seamless property browsing.",
    tags: ["Next.js", "React", "Tailwind CSS", "Real Estate"],
    category: "fullstack",
    link: "https://phurba-psi.vercel.app/",
  },
  {
    title: "Aseto - Real Estate Platform",
    description:
      "A professional real estate web application featuring property management, listings, and intuitive user interface for buyers and sellers.",
    tags: ["Next.js", "React", "Tailwind CSS", "Real Estate"],
    category: "fullstack",
    link: "https://aseto-web.vercel.app/",
  },
  {
    title: "Rent Payment App",
    description:
      "A Flutter-based mobile application for streamlined rent payment processing with custom reusable components, form validation, and professional UI.",
    tags: ["Flutter", "Dart", "Mobile App", "AI-Assisted Development"],
    category: "fullstack",
    github: "https://github.com/deepu9990/rent-payment-app",
  },
  {
    title: "Dynamic Helpdesk Platform",
    description:
      "JSON-driven form builder with 100+ dynamic helpdesk flows and configurable business logic for real estate enterprise.",
    tags: ["React", "TypeScript", "Tailwind CSS", "Vite"],
    category: "frontend",
  },
  {
    title: "Serverless Microservices Architecture",
    description:
      "Secure decoupled architecture for insurance CRM platform using AWS services.",
    tags: [
      "AWS Lambda",
      "API Gateway",
      "SQS",
      "MongoDB",
      "Serverless Framework",
    ],
    category: "backend",
  },
  {
    title: "Micro-Frontend Application",
    description:
      "Modular frontend architecture using Webpack 5 Module Federation for enterprise applications.",
    tags: ["React", "Webpack 5", "Module Federation", "Nginx", "EC2"],
    category: "frontend",
  },
  {
    title: "Real-time Video Chat Platform",
    description:
      "WebRTC integration with automated cloud recording and FFmpeg-based format conversion.",
    tags: ["WebRTC", "Node.js", "AWS S3", "FFmpeg"],
    category: "fullstack",
  },
  {
    title: "E-Commerce Platform",
    description:
      "Cross-platform application with modular architecture supporting 10K+ concurrent users.",
    tags: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    category: "fullstack",
  },
  {
    title: "CI/CD Pipeline",
    description:
      "Automated deployment workflow using Docker and Bitbucket Pipelines.",
    tags: ["Docker", "Bitbucket Pipelines", "AWS", "Nginx"],
    category: "devops",
  },
];

const tabs = [
  "all",
  "opensource",
  "frontend",
  "backend",
  "fullstack",
  "devops",
];

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="overflow-hidden border-0 shadow-lg group flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-700 group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300" />
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="group-hover:text-blue-600 transition-colors text-lg font-semibold">
            {project.title}
          </CardTitle>
          {project.category === "opensource" && (
            <Badge className="bg-green-100 text-green-700 text-xs flex-shrink-0">
              Open Source
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col">
        <p className="text-slate-500 text-sm flex-1">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-slate-100 text-slate-700 text-xs hover:bg-blue-100 hover:text-blue-700 transition-colors"
            >
              {tag}
            </Badge>
          ))}
        </div>
        {(project.github || project.link) && (
          <div className="flex gap-2 pt-2">
            {project.github && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="text-xs hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
              >
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-3 h-3 mr-1" />
                  GitHub
                </a>
              </Button>
            )}
            {project.link && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="text-xs hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
              >
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View
                </a>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Projects() {
  const [selectedTab, setSelectedTab] = useState("all");

  const filteredProjects =
    selectedTab === "all"
      ? projects
      : projects.filter((p) => p.category === selectedTab);

  return (
    <section id="projects" className="py-16 sm:py-20 bg-white">
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
              Portfolio
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 mb-4">
              Featured Projects
            </h2>
            <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto">
              Showcasing my best work and technical achievements
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Tabs defaultValue="all" className="w-full">
              <div className="flex justify-center overflow-x-auto pb-2">
                <TabsList className="mb-8 flex-wrap h-auto gap-1">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      onClick={() => setSelectedTab(tab)}
                      className="px-3 sm:px-6 capitalize"
                    >
                      {tab === "opensource"
                        ? "Open Source"
                        : tab === "fullstack"
                        ? "Full Stack"
                        : tab}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {tabs.map((tab) => (
                <TabsContent key={tab} value={tab} className="mt-0">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {filteredProjects.map((project, index) => (
                      <motion.div
                        key={project.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <ProjectCard project={project} />
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
