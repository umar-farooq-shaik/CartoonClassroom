import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { Heart, BookOpen, Star, Users, Sparkles, Zap } from "lucide-react";
import { useLocation } from "wouter";
import { FloatingIcons } from "@/components/floating-icons";

export default function Landing() {
  const { user, signIn } = useAuth();
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    if (user) {
      setLocation("/dashboard");
    } else {
      setLocation("/signup");
    }
  };

  const handleLogin = () => {
    signIn();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 via-pink-100 to-yellow-100 relative overflow-hidden">
      {/* Floating Background Icons */}
      <FloatingIcons />
      
      {/* Navigation bar with sign-in button */}
      <div className="absolute top-0 right-0 p-4 z-20">
        {!user && (
          <Button 
            onClick={handleLogin} 
            className="bg-white text-purple-600 hover:bg-purple-100 font-bold py-2 px-6 rounded-full shadow-lg"
          >
            Sign In
          </Button>
        )}
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-16">
          <h1
            className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 mb-6 animate-bounce drop-shadow-lg"
            style={{ fontFamily: "Comic Sans MS, cursive" }}
          >
            Welcome to CartoonClassroom 🎉
          </h1>
          <p className="text-2xl md:text-3xl text-purple-800 mb-8 max-w-4xl mx-auto font-semibold leading-relaxed">
            Learn with your favorite cartoon characters through fun comic
            stories!
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-6 px-12 rounded-full text-xl shadow-xl transform hover:scale-110 transition-all duration-300 border-4 border-white"
            >
              <Sparkles className="mr-2 h-6 w-6" />
              Get Started
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="bg-gradient-to-br from-pink-200 to-pink-300 border-4 border-pink-400 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform">
            <CardHeader className="text-center">
              <div className="bg-pink-500 rounded-full p-4 w-20 h-20 mx-auto mb-4 shadow-lg">
                <BookOpen className="h-12 w-12 text-white" />
              </div>
              <CardTitle className="text-2xl text-pink-800 font-bold">
                📚 Comic Stories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-pink-700 text-center text-lg font-medium">
                Learn through exciting comic panels with SpongeBob, Pikachu, and
                more!
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-200 to-blue-300 border-4 border-blue-400 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform">
            <CardHeader className="text-center">
              <div className="bg-blue-500 rounded-full p-4 w-20 h-20 mx-auto mb-4 shadow-lg">
                <Star className="h-12 w-12 text-white" />
              </div>
              <CardTitle className="text-2xl text-blue-800 font-bold">
                ✨ AI Magic
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-blue-700 text-center text-lg font-medium">
                Smart stories created just for what you want to learn today!
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-200 to-green-300 border-4 border-green-400 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform">
            <CardHeader className="text-center">
              <div className="bg-green-500 rounded-full p-4 w-20 h-20 mx-auto mb-4 shadow-lg">
                <Heart className="h-12 w-12 text-white" />
              </div>
              <CardTitle className="text-2xl text-green-800 font-bold">
                💖 Safe & Fun
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-green-700 text-center text-lg font-medium">
                Colorful, safe learning designed especially for awesome kids
                like you!
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-200 to-purple-300 border-4 border-purple-400 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform">
            <CardHeader className="text-center">
              <div className="bg-purple-500 rounded-full p-4 w-20 h-20 mx-auto mb-4 shadow-lg">
                <Users className="h-12 w-12 text-white" />
              </div>
              <CardTitle className="text-2xl text-purple-800 font-bold">
                🏆 Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-purple-700 text-center text-lg font-medium">
                Earn cool badges and track your amazing learning adventure!
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Subjects Preview */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-purple-800 mb-8">
            🌟 What Will You Learn Today? 🌟
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              {
                emoji: "📐",
                subject: "Math",
                color: "from-yellow-400 to-orange-400",
              },
              {
                emoji: "🧪",
                subject: "Science",
                color: "from-green-400 to-blue-400",
              },
              {
                emoji: "🌍",
                subject: "Social",
                color: "from-blue-400 to-purple-400",
              },
              {
                emoji: "💬",
                subject: "English",
                color: "from-pink-400 to-red-400",
              },
              {
                emoji: "💡",
                subject: "Life Skills",
                color: "from-indigo-400 to-purple-400",
              },
            ].map((item) => (
              <div
                key={item.subject}
                className={`bg-gradient-to-r ${item.color} text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer`}
              >
                {item.emoji} {item.subject}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-12 text-white shadow-2xl border-4 border-white">
          <h2 className="text-4xl font-bold mb-6">
            🚀 Ready for Your Learning Adventure? 🚀
          </h2>
          <p className="text-2xl mb-8 opacity-90 font-medium">
            Join thousands of kids who are having a blast while learning amazing
            things!
          </p>
          <Button
            onClick={handleGetStarted}
            className="bg-white text-purple-600 hover:bg-yellow-100 font-bold py-4 px-8 rounded-full text-xl shadow-lg transform hover:scale-110 transition-all duration-300"
          >
            Start Learning Now! 🎉
          </Button>
        </div>
      </div>
    </div>
  );
}
