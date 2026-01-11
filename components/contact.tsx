"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Linkedin, Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "dsadeepak29@gmail.com",
    href: "mailto:dsadeepak29@gmail.com",
    action: "Send Email",
    color: "blue",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+91 84477 97002",
    href: "tel:+918447797002",
    action: "Call Me",
    color: "green",
  },
  {
    icon: Linkedin,
    title: "LinkedIn",
    value: "linkedin.com/in/deepak29",
    href: "https://linkedin.com/in/deepak29/",
    action: "Connect",
    color: "purple",
  },
];

const colorClasses: Record<
  string,
  { bg: string; text: string; hover: string }
> = {
  blue: {
    bg: "bg-blue-500/20",
    text: "text-blue-300",
    hover: "hover:bg-blue-500/20",
  },
  green: {
    bg: "bg-green-500/20",
    text: "text-green-300",
    hover: "hover:bg-green-500/20",
  },
  purple: {
    bg: "bg-purple-500/20",
    text: "text-purple-300",
    hover: "hover:bg-purple-500/20",
  },
};

export default function Contact() {
  return (
    <section
      id="contact"
      className="py-16 sm:py-20 bg-gradient-to-b from-slate-900 to-slate-800 text-white"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-blue-400/20 text-blue-300 hover:bg-blue-400/30 px-3 py-1">
              Get In Touch
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-semibold mb-4">
              Let's Connect
            </h2>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 sm:mb-12 max-w-2xl mx-auto">
              I'm always interested in new opportunities and collaborations.
              Feel free to reach out!
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 mb-8 sm:mb-12">
            {contactInfo.map((item, index) => {
              const Icon = item.icon;
              const colors = colorClasses[item.color];
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="bg-white/10 border-0 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 group hover:-translate-y-1">
                    <CardContent className="p-6 flex flex-col items-center gap-4">
                      <div
                        className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className={`w-8 h-8 ${colors.text}`} />
                      </div>
                      <div className="text-center">
                        <h3 className="font-semibold mb-2 text-white">
                          {item.title}
                        </h3>
                        <p className="text-slate-300 text-sm">{item.value}</p>
                      </div>
                      <Button
                        asChild
                        variant="ghost"
                        className={`${colors.text} hover:text-white ${colors.hover}`}
                      >
                        <a
                          href={item.href}
                          target={
                            item.title === "LinkedIn" ? "_blank" : undefined
                          }
                          rel={
                            item.title === "LinkedIn"
                              ? "noopener noreferrer"
                              : undefined
                          }
                        >
                          {item.action}
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <a href="/Deepak_Sharma.pdf" download>
                <Download className="w-5 h-5 mr-2" />
                Download Resume
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
