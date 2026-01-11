"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

export default function Education() {
  return (
    <section id="education" className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 sm:mb-16"
          >
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1">
              Academic Background
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900 mb-4">
              Education
            </h2>
            <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto">
              My academic qualifications and background
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="shadow-lg border-0 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-700 group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300" />
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-1">
                      Bachelor of Engineering (B.E.)
                    </h3>
                    <p className="text-slate-500 mb-1 text-sm sm:text-base">
                      Panjab University, Chandigarh
                    </p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>2017 – 2021</span>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-blue-600 border-blue-200"
                      >
                        7.72 CGPA
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
