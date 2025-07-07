import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Database, Cloud } from "lucide-react"

const skillsData = {
  frontend: [
    "React.js",
    "TypeScript",
    "JavaScript (ES6+)",
    "HTML5",
    "CSS3",
    "Tailwind CSS",
    "Bootstrap",
    "Material UI",
    "Ant Design",
    "Highcharts",
    "Vite",
    "Webpack 5",
    "Module Federation",
  ],
  backend: ["Node.js", "Express.js", "REST APIs", "MongoDB", "PostgreSQL", "SQL", "Serverless Framework", "FFmpeg"],
  devops: [
    "AWS (EC2, S3, RDS, EKS, Lambda, API Gateway, CloudFront, Route53, Load Balancer)",
    "Docker",
    "Bitbucket Pipelines",
    "Jenkins",
    "CodePipeline",
    "Nginx",
  ],
}

export default function Skills() {
  return (
    <section id="skills" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors px-3 py-1">
              Expertise
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Technical Skills</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Technologies and tools I've mastered throughout my career
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600"></div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <ExternalLink className="w-5 h-5" />
                  Frontend Development
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skillsData.frontend.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-green-500 to-green-600"></div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <Database className="w-5 h-5" />
                  Backend Development
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skillsData.backend.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-600"></div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <Cloud className="w-5 h-5" />
                  DevOps & Cloud
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skillsData.devops.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
