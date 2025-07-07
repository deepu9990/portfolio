import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, GraduationCap } from "lucide-react"

export default function Education() {
  return (
    <section id="education" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors px-3 py-1">
              Academic Background
            </Badge>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Education</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">My academic qualifications and background</p>
          </div>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-700"></div>
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-1">Bachelor of Engineering (B.E.)</h3>
                  <p className="text-slate-600 mb-1">Panjab University, Chandigarh</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Calendar className="w-4 h-4" />
                      <span>2017 – 2021</span>
                    </div>
                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                      7.72 CGPA
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
