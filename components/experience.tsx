import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"

const experienceData = [
  {
    title: "Senior Software Engineer L1",
    company: "Gemini Solutions",
    location: "Gurgaon, India",
    period: "Jul 2024 - Present",
    client: "Real Estate Enterprise SaaS",
    achievements: [
      "Leading a team of 6 to deliver 100+ dynamic helpdesk flows with configurable business logic, backed by a JSON-driven form builder that reduced development time by 40%.",
      "Created reusable components with React, TypeScript, Tailwind CSS, and Vite; worked in Agile sprints with back-end, QA, and product teams to meet delivery goals.",
      "Managed CI/CD with Nginx deployment and led team-level code reviews to maintain quality.",
    ],
  },
  {
    title: "Software Engineer L2",
    company: "Gemini Solutions",
    location: "Gurgaon, India",
    period: "Apr 2023 – Jul 2024",
    client: "Insurance Giant – CRM and Microservices Platform",
    achievements: [
      "Built serverless microservices using AWS Lambda, API Gateway, SQS, EventBridge, and MongoDB with secure decoupled architecture via Serverless Framework.",
      "Developed micro-frontend UIs using React, Webpack 5, Module Federation, served via Nginx on EC2.",
    ],
  },
  {
    title: "Software Engineer L1",
    company: "Gemini Solutions",
    location: "Gurgaon, India",
    period: "Jan 2022 – Apr 2023",
    client: "Tech Startup – E-Commerce, Services, Investment & Community Domains",
    achievements: [
      "Worked on 5 cross-platform applications using React, TypeScript, Tailwind CSS, and Vite, with a modular architecture and consistent routing/layout systems.",
      "Created REST APIs with Node.js/Express and handled PostgreSQL-based workflows for both transactional and analytical needs.",
      "Integrated WebRTC for real-time video chat, with automated recording, cloud storage, and FFmpeg-based format conversion.",
      "Deployed assets via AWS S3, CloudFront, and Route53; contributed to Docker-based CI/CD using Bitbucket Pipelines.",
      "Optimized APIs and DB queries for key modules, reducing response time by 60%, and scaled infra to support 10K+ concurrent users for live events.",
    ],
  },
]

export default function Experience() {
  return (
    <section id="experience" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors px-3 py-1">
              Career Path
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Work Experience</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              My professional journey building scalable applications and leading development teams
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-blue-100 rounded"></div>

            <div className="space-y-12">
              {experienceData.map((job, index) => (
                <div
                  key={index}
                  className={`relative flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-8 items-center`}
                >
                  <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-5 h-5 rounded-full bg-blue-600 border-4 border-blue-100 z-10"></div>

                  <div className="md:hidden bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                    {job.period}
                  </div>

                  <div className={`md:w-1/2 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                    <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden group">
                      <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-700"></div>
                      <CardHeader>
                        <div className="flex flex-col gap-2">
                          <CardTitle className="text-xl text-slate-900 group-hover:text-blue-600 transition-colors">
                            {job.title}
                          </CardTitle>
                          <CardDescription className="text-lg font-medium text-blue-600">
                            {job.company} • {job.location}
                          </CardDescription>
                          <Badge variant="outline" className="w-fit text-slate-600 border-slate-200">
                            Client: {job.client}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {job.achievements.map((achievement, i) => (
                            <li key={i} className="flex items-start gap-3 text-slate-700">
                              <ChevronRight className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                              <span className="leading-relaxed">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="hidden md:block md:w-1/2 text-center">
                    <div
                      className={`inline-block bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-medium ${index % 2 === 0 ? "md:text-left" : "md:text-right"}`}
                    >
                      {job.period}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
