import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Linkedin, Mail, Phone } from "lucide-react";

export default function Contact() {
  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-b from-slate-900 to-slate-800 text-white"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-400/20 text-blue-300 hover:bg-blue-400/30 transition-colors px-3 py-1">
            Get In Touch
          </Badge>
          <h2 className="text-4xl font-bold mb-4">{"Let's Connect"}</h2>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            {
              "I'm always interested in new opportunities and collaborations. Feel free to reach out!"
            }
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="bg-white/10 border-0 backdrop-blur-sm hover:bg-white/15 transition-colors">
              <CardContent className="p-6 flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-blue-300" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold mb-2 text-white">Email</h3>
                  <p className="text-slate-300">dsadeepak29@gmail.com</p>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  className="text-blue-300 hover:text-blue-100 hover:bg-blue-500/20"
                >
                  <a href="mailto:dsadeepak29@gmail.com">Send Email</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-0 backdrop-blur-sm hover:bg-white/15 transition-colors">
              <CardContent className="p-6 flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Phone className="w-8 h-8 text-green-300" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold mb-2 text-white">Phone</h3>
                  <p className="text-slate-300">+91 84477 97002</p>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  className="text-green-300 hover:text-green-100 hover:bg-green-500/20"
                >
                  <a href="tel:+918447797002">Call Me</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-0 backdrop-blur-sm hover:bg-white/15 transition-colors">
              <CardContent className="p-6 flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Linkedin className="w-8 h-8 text-purple-300" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold mb-2 text-white">LinkedIn</h3>
                  <p className="text-slate-300">linkedin.com/in/deepak29/</p>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  className="text-purple-300 hover:text-purple-100 hover:bg-purple-500/20"
                >
                  <a
                    href="https://linkedin.com/in/deepak29/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Connect
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              <a href="mailto:dsadeepak29@gmail.com">
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <a href="/Deepak_Sharma.pdf" download>
                <Download className="w-4 h-4 mr-2" />
                Download Resume
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
