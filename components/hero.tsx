import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Download,
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

export default function Hero() {
  return (
    <section
      id="about"
      className="pt-32 pb-20 bg-gradient-to-b from-slate-50 to-white"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <div className="mb-4 inline-block">
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors px-3 py-1 text-sm">
                Full Stack Developer
              </Badge>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-slate-900">
              Deepak <span className="text-blue-600">Sharma</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Experienced Full Stack Developer proficient in MERN stack and
              intermediate DevOps. Adept problem-solver and communicator with
              proven success in delivering high-quality scalable solutions.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Gurugram, Haryana</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>dsadeepak29@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-4 h-4 text-blue-600" />
                <span>+91 84477 97002</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                <a href="#contact">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Me
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors bg-transparent"
              >
                <a href="/Deepak_Sharma.pdf" download>
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </a>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full mx-auto flex items-center justify-center text-6xl font-bold text-white relative overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-700 opacity-80"></div>
              <img
                src="/deepak_sharma.png"
                alt="Deepak Sharma"
                className="relative z-10 w-36 h-36 md:w-52 md:h-52 object-cover object-top rounded-full border-4 border-white shadow-lg"
              />
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-300 rounded-full opacity-30"></div>
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-300 rounded-full opacity-30"></div>
            </div>

            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-full p-3 flex gap-4">
              <a
                href="https://linkedin.com/in/deepak29/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center hover:bg-slate-800 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors"
              >
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
