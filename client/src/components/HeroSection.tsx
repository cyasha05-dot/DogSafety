import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";
import { 
  Shield, 
  Clock, 
  Camera, 
  MapPin, 
  Phone, 
  TrendingUp,
  Users,
  AlertTriangle,
  ChevronRight
} from "lucide-react";

interface HeroSectionProps {
  onStartReport: () => void;
}

export function HeroSection({ onStartReport }: HeroSectionProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="w-full h-full bg-gradient-to-br from-blue-400/20 to-purple-400/20"
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Public Safety Initiative
                </Badge>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
              >
                Report Street Dog Incidents 
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="text-blue-600"
                > Instantly</motion.span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-xl text-gray-600 mt-4"
              >
                Help make your community safer by reporting aggressive street dog groups. 
                Fast reporting leads to faster municipal response and better public safety.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {[
                { icon: Clock, title: "Instant Reporting", desc: "Submit reports in under 2 minutes", color: "text-blue-500", delay: 0 },
                { icon: Camera, title: "Photo Evidence", desc: "Upload images for faster response", color: "text-green-500", delay: 0.1 },
                { icon: MapPin, title: "GPS Location", desc: "Precise incident location tracking", color: "text-orange-500", delay: 0.2 },
                { icon: Shield, title: "Municipal Action", desc: "Direct reporting to authorities", color: "text-purple-500", delay: 0.3 }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + feature.delay, duration: 0.5 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <feature.icon className={`h-8 w-8 ${feature.color} group-hover:scale-110 transition-transform`} />
                  </motion.div>
                  <div>
                    <p className="font-semibold text-gray-900">{feature.title}</p>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  onClick={onStartReport}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 group"
                >
                  <AlertTriangle className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                  Report Incident Now
                  <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  size="lg"
                  className="px-8 py-3 border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Emergency: 102
                </Button>
              </motion.div>
            </motion.div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Emergency Situations</p>
                  <p className="text-sm text-yellow-700">
                    If you're in immediate danger or witnessing an active dog attack, 
                    call emergency services (102) immediately before using this reporting system.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Image and Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              whileHover={{ scale: 1.02 }}
              className="transition-transform duration-300"
            >
              <Card className="overflow-hidden">
                <div className="relative">
                  <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1688846217935-a019ec53d8bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBkb2dzJTIwdXJiYW4lMjBjaXR5fGVufDF8fHx8MTc1ODcxNzgyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Street dogs in urban area"
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="absolute bottom-4 left-4 text-white"
                  >
                    <p className="text-sm font-medium">Making streets safer for everyone</p>
                    <p className="text-xs opacity-90">Community-driven reporting system</p>
                  </motion.div>
                </div>
              </Card>
            </motion.div>

            {/* Statistics Cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="grid grid-cols-3 gap-4"
            >
              {[
                { icon: TrendingUp, value: "2.4hrs", label: "Avg Response Time", color: "text-green-500", delay: 0 },
                { icon: Users, value: "156", label: "Reports This Month", color: "text-blue-500", delay: 0.1 },
                { icon: Shield, value: "92%", label: "Resolution Rate", color: "text-purple-500", delay: 0.2 }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + stat.delay, duration: 0.5 }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-4 text-center">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-2`} />
                      </motion.div>
                      <motion.p
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.2 + stat.delay, type: "spring", stiffness: 200 }}
                        className="text-2xl font-bold text-gray-900"
                      >
                        {stat.value}
                      </motion.p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Mobile App Preview */}
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-2">Mobile App Coming Soon</h3>
                    <p className="text-sm opacity-90">
                      Report incidents on-the-go with our mobile application
                    </p>
                  </div>
                  <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1606495813362-8efff01b8573?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjByZXBvcnRpbmclMjBlbWVyZ2VuY3l8ZW58MXx8fHwxNzU4NzE3ODMxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Mobile app interface"
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}