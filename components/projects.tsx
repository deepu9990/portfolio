"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"

const projectsData = [
  {
    title: "Dynamic Helpdesk Platform",
    description: "JSON-driven form builder with configurable business logic for real estate enterprise",
    tags: ["React", "TypeScript", "Tailwind CSS", "Vite"],
    category: "frontend",
  },
  {
    title: "Serverless Microservices Architecture",
    description: "Secure decoupled architecture for insurance CRM platform",
    tags: ["AWS Lambda", "API Gateway", "SQS", "MongoDB", "Serverless Framework"],
    category: "backend",
  },
  {
    title: "Micro-Frontend Application",
    description: "Modular frontend architecture using Webpack 5 Module Federation",
    tags: ["React", "Webpack 5", "Module Federation", "Nginx", "EC2"],
    category: "frontend",
  },
  {
    title: "Real-time Video Chat Platform",
    description: "WebRTC integration with cloud recording and format conversion",
    tags: ["WebRTC", "Node.js", "AWS S3", "FFmpeg"],
    category: "fullstack",
  },
  {
    title: "E-Commerce Platform",
    description: "Cross-platform application with modular architecture",
    tags: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    category: "fullstack",
  },
  {
    title: "CI/CD Pipeline",
    description: "Automated deployment workflow using Docker and Bitbucket Pipelines",
    tags: ["Docker", "Bitbucket Pipelines", "AWS", "Nginx"],
    category: "devops",
  },
]

export default function Projects() {
  const [selectedTab, setSelectedTab] = useState("all")

  const filteredProjects =
    selectedTab === "all" ? projectsData : projectsData.filter((project) => project.category === selectedTab)

  const ProjectCard = ({ project, index }: { project: any; index: number }) => (
    <Card key={index} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-700"></div>
      <CardHeader className="pb-2">
        <CardTitle className="group-hover:text-blue-600 transition-colors">{project.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-slate-600">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag: string, i: number) => (
            <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-700">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors px-3 py-1">
              Portfolio
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Featured Projects</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Showcasing my best work and technical achievements
            </p>
          </div>

          <div className="mb-8">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex justify-center">
                <TabsList className="mb-8">
                  <TabsTrigger value="all" onClick={() => setSelectedTab("all")} className="px-6">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="frontend" onClick={() => setSelectedTab("frontend")} className="px-6">
                    Frontend
                  </TabsTrigger>
                  <TabsTrigger value="backend" onClick={() => setSelectedTab("backend")} className="px-6">
                    Backend
                  </TabsTrigger>
                  <TabsTrigger value="fullstack" onClick={() => setSelectedTab("fullstack")} className="px-6">
                    Full Stack
                  </TabsTrigger>
                  <TabsTrigger value="devops" onClick={() => setSelectedTab("devops")} className="px-6">
                    DevOps
                  </TabsTrigger>
                </TabsList>
              </div>

              {["all", "frontend", "backend", "fullstack", "devops"].map((tab) => (
                <TabsContent key={tab} value={tab} className="mt-0">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project, index) => (
                      <ProjectCard key={index} project={project} index={index} />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  )
}
