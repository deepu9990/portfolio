"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, Database, Wrench, Cloud } from "lucide-react";
import { motion } from "framer-motion";

const skillsData = {
  frontend: [
    "React.js",
    "TypeScript",
    "JavaScript (ES6+)",
    "Redux",
    "Context API",
    "React Router",
    "React Query",
    "Next.js",
    "HTML5",
    "CSS3",
    "Tailwind CSS",
    "Material UI",
    "Ant Design",
    "Styled Components",
    "Highcharts",
  ],
  buildTools: [
    "Vite",
    "Webpack 5",
    "Module Federation",
    "npm",
    "pnpm",
    "Babel",
    "ESLint",
    "Prettier",
  ],
  backend: [
    "Node.js",
    "Express.js",
    "REST APIs",
    "MongoDB",
    "PostgreSQL",
    "Git",
    "GitHub",
    "Bitbucket",
    "Jest",
    "React Testing Library",
  ],
  devops: [
    "AWS (EC2, S3, Lambda, API Gateway)",
    "Docker",
    "Nginx",
    "Bitbucket Pipelines",
    "CI/CD",
    "CloudFront",
    "Route53",
  ],
};

const skillCategories = [
  {
    key: "frontend",
    title: "React & Frontend",
    icon: Code2,
    color: "blue",
    data: skillsData.frontend,
  },
  {
    key: "buildTools",
    title: "Build Tools & Bundlers",
    icon: Wrench,
    color: "purple",
    data: skillsData.buildTools,
  },
  {
    key: "backend",
    title: "Backend & Tools",
    icon: Database,
    color: "green",
    data: skillsData.backend,
  },
  {
    key: "devops",
    title: "DevOps & Cloud",
    icon: Cloud,
    color: "orange",
    data: skillsData.devops,
  },
];

const colorClasses: Record<
  string,
  { gradient: string; text: string; badge: string }
> = {
  blue: {
    gradient: "from-blue-500 to-blue-600",
    text: "text-blue-600",
    badge: "bg-blue-50 text-blue-700 hover:bg-blue-100",
  },
  purple: {
    gradient: "from-purple-500 to-purple-600",
    text: "text-purple-600",
    badge: "bg-purple-50 text-purple-700 hover:bg-purple-100",
  },
  green: {
    gradient: "from-green-500 to-green-600",
    text: "text-green-600",
    badge: "bg-green-50 text-green-700 hover:bg-green-100",
  },
  orange: {
    gradient: "from-orange-500 to-orange-600",
    text: "text-orange-600",
    badge: "bg-orange-50 text-orange-700 hover:bg-orange-100",
  },
};

export default function Skills() {
  return (
    <section id="skills" className="py-16 sm:py-20 bg-slate-50">
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
              Expertise
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 mb-4">
              Technical Skills
            </h2>
            <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto">
              Technologies and tools I've mastered throughout my career
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
            {skillCategories.map((category, index) => {
              const Icon = category.icon;
              const colors = colorClasses[category.color];
              return (
                <motion.div
                  key={category.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="shadow-lg border-0 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
                    <div
                      className={`h-2 bg-gradient-to-r ${colors.gradient}`}
                    />
                    <CardHeader>
                      <CardTitle
                        className={`flex items-center gap-2 ${colors.text} font-semibold`}
                      >
                        <Icon className="w-5 h-5" />
                        {category.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {category.data.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className={colors.badge}
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
