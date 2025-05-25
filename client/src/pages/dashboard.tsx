import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { useAuth } from '@/contexts/auth-context';
import { useUser } from '@/contexts/user-context';
import { BookOpen, Trophy, Star, Clock, Zap, Heart, Brain, Sparkles } from 'lucide-react';

const subjects = [
  {
    id: 'math',
    name: 'Math',
    icon: '🔢',
    description: 'Numbers, patterns, and problem solving!',
    gradient: 'from-blue-400 to-blue-600',
    bgGradient: 'from-blue-50 to-blue-100',
    hoverGradient: 'hover:from-blue-500 hover:to-blue-700',
  },
  {
    id: 'science',
    name: 'Science',
    icon: '🧪',
    description: 'Discover how the world works!',
    gradient: 'from-green-400 to-green-600',
    bgGradient: 'from-green-50 to-green-100',
    hoverGradient: 'hover:from-green-500 hover:to-green-700',
  },
  {
    id: 'english',
    name: 'English',
    icon: '📚',
    description: 'Reading, writing, and storytelling!',
    gradient: 'from-purple-400 to-purple-600',
    bgGradient: 'from-purple-50 to-purple-100',
    hoverGradient: 'hover:from-purple-500 hover:to-purple-700',
  },
  {
    id: 'social',
    name: 'Social',
    icon: '🌍',
    description: 'Learn about people and places!',
    gradient: 'from-orange-400 to-orange-600',
    bgGradient: 'from-orange-50 to-orange-100',
    hoverGradient: 'hover:from-orange-500 hover:to-orange-700',
  },
  {
    id: 'lifeskills',
    name: 'Life Skills',
    icon: '🌟',
    description: 'Important skills for everyday life!',
    gradient: 'from-pink-400 to-pink-600',
    bgGradient: 'from-pink-50 to-pink-100',
    hoverGradient: 'hover:from-pink-500 hover:to-pink-700',
  }
];

const featuredTopics = [
  { subject: "Math", topic: "Addition", icon: "➕", difficulty: "Beginner", color: "bg-blue-100 text-blue-800" },
  { subject: "Science", topic: "Water Cycle", icon: "💧", difficulty: "Intermediate", color: "bg-green-100 text-green-800" },
  { subject: "English", topic: "Storytelling", icon: "📖", difficulty: "Beginner", color: "bg-purple-100 text-purple-800" },
  { subject: "Social", topic: "Community", icon: "🏘️", difficulty: "Beginner", color: "bg-orange-100 text-orange-800" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { progress, achievements, stories, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"></div>
            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-purple-600" />
          </div>
          <p className="text-gray-600 text-lg font-medium">Loading your magical learning dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header with Animation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mr-3">
              Welcome back, {user?.name || "Learning Star"}!
            </h1>
            <motion.div 
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              <Sparkles className="h-8 w-8 text-yellow-500" />
            </motion.div>
          </div>
          <p className="text-xl text-gray-600 mb-6">
            Ready to continue your amazing learning adventure?
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <Heart className="h-4 w-4 text-red-400 mr-1" />
              <span>Learning is fun!</span>
            </motion.div>
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <Brain className="h-4 w-4 text-purple-400 mr-1" />
              <span>Get smarter every day</span>
            </motion.div>
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <Star className="h-4 w-4 text-yellow-400 mr-1" />
              <span>You're awesome!</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Quick Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Stories Read</p>
                  <p className="text-3xl font-bold">{progress?.totalStoriesRead || 0}</p>
                </div>
                <BookOpen className="h-10 w-10 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Achievements</p>
                  <p className="text-3xl font-bold">{achievements?.length || 0}</p>
                </div>
                <Trophy className="h-10 w-10 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Learning Streak</p>
                  <p className="text-3xl font-bold">{progress?.currentStreak || 0}</p>
                </div>
                <Zap className="h-10 w-10 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Time Learning</p>
                  <p className="text-3xl font-bold">{Math.round((progress?.totalTimeSpent || 0) / 60)}m</p>
                </div>
                <Clock className="h-10 w-10 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Learning Subjects */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Choose Your Learning Adventure</h2>
          <p className="text-gray-600 text-center mb-8">Pick a subject and start learning with your favorite cartoon characters!</p>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {subjects.map((subject, index) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href={`/topic-input?subject=${encodeURIComponent(subject.name)}`}>
                  <Card className="cursor-pointer transition-all duration-300 hover:shadow-xl border-2 hover:border-purple-300 group h-full">
                    <CardContent className="p-6 text-center">
                      <motion.div 
                        className="text-5xl mb-4"
                        whileHover={{ 
                          rotate: [0, -10, 10, 0],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        {subject.icon}
                      </motion.div>
                      <h3 className="font-bold text-lg text-gray-800 mb-2">{subject.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{subject.description}</p>
                      <Badge className="bg-gray-100 text-gray-700 border text-xs">
                        {progress?.subjectProgress?.[subject.name]?.storiesCompleted || 0} stories completed
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Featured Topics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Featured Learning Topics</h2>
          <p className="text-gray-600 text-center mb-6">Try these popular topics loved by kids everywhere!</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredTopics.map((topic, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
              >
                <Link href={`/topic-input?subject=${encodeURIComponent(topic.subject)}&topic=${encodeURIComponent(topic.topic)}`}>
                  <Card className="cursor-pointer transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-purple-300 h-full">
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl mb-3">{topic.icon}</div>
                      <h3 className="font-semibold text-gray-800 mb-1">{topic.topic}</h3>
                      <p className="text-sm text-gray-600 mb-3">{topic.subject}</p>
                      <Badge variant="outline" className={`text-xs ${topic.color}`}>
                        {topic.difficulty}
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Stories Enhanced */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Your Recent Stories</h2>
            <Link href="/history">
              <Button variant="outline" className="hover:bg-purple-50 hover:border-purple-300">
                View All Stories
              </Button>
            </Link>
          </div>
          
          {stories && stories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stories.slice(0, 3).map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="hover:shadow-xl transition-all duration-300 h-full">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg text-gray-800">{story.title}</CardTitle>
                      <p className="text-gray-600 text-sm">{story.subject} • {story.topic}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant={story.isLearned ? "default" : "secondary"}
                          className={story.isLearned ? "bg-green-500 hover:bg-green-600" : ""}
                        >
                          {story.isLearned ? "✅ Completed" : "📖 In Progress"}
                        </Badge>
                        <Link href={`/story/${story.id}`}>
                          <Button variant="outline" size="sm" className="hover:bg-purple-50 hover:border-purple-300">
                            Read Again
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="text-center py-16 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-dashed border-purple-200">
                <CardContent>
                  <motion.div 
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    className="mb-6"
                  >
                    <BookOpen className="h-16 w-16 text-purple-400 mx-auto" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-3">
                    Your Learning Adventure Awaits! 🚀
                  </h3>
                  <p className="text-gray-600 mb-6 text-lg">
                    Start your magical journey by creating your first educational comic story!
                  </p>
                  <Link href="/topic-input">
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                      🌟 Create Your First Story
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>

        {/* Enhanced Achievements */}
        {achievements && achievements.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Amazing Achievements! 🏆</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.slice(0, 3).map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, rotate: -5 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                >
                  <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <motion.div 
                          className="text-4xl"
                          animate={{ 
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, -10, 0]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 3
                          }}
                        >
                          {achievement.icon}
                        </motion.div>
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">{achievement.name}</h3>
                          <p className="text-gray-600">{achievement.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Quick Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-12 text-center"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/topic-input">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                  🎨 Create New Story
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/achievements">
                <Button variant="outline" className="border-2 hover:bg-yellow-50 hover:border-yellow-300 py-3 px-8 rounded-full font-semibold">
                  🏆 View Achievements
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/history">
                <Button variant="outline" className="border-2 hover:bg-green-50 hover:border-green-300 py-3 px-8 rounded-full font-semibold">
                  📚 Story Library
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}