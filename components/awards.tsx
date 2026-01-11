"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Award } from "lucide-react";
import { motion } from "framer-motion";

const awards = [
  {
    title: "Employee of the Quarter",
    period: "Q4 2023",
    description:
      "Recognized for outstanding performance and contributions to team success",
  },
  {
    title: "Rising Star Award",
    period: "Q1 2023",
    description:
      "Acknowledged for exceptional growth and potential within the organization",
  },
];

export default function Awards() {
  return (
    <section id="awards" className="py-16 sm:py-20 bg-slate-50">
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
              Recognition
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 mb-4">
              Awards & Achievements
            </h2>
            <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto">
              Recognition for excellence and outstanding contributions
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {awards.map((award, index) => (
              <motion.div
                key={award.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden border-0 shadow-lg group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-700 group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300" />
                  <CardContent className="pt-6 p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 group-hover:scale-110">
                        <Award className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                          {award.title}
                        </h3>
                        <p className="text-blue-600 font-medium">
                          {award.period}
                        </p>
                        <p className="text-slate-500 mt-2">
                          {award.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
