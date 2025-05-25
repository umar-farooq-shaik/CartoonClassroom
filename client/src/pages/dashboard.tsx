import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'wouter';
import { useAuth } from '@/contexts/auth-context';

const subjects = [
  {
    id: 'math',
    name: 'Math',
    icon: '📐',
    description: 'Numbers, shapes, and fun calculations!',
    gradient: 'from-yellow-200 to-orange-200',
    hoverGradient: 'hover:from-yellow-300 hover:to-orange-300',
  },
  {
    id: 'science',
    name: 'Science',
    icon: '🧪',
    description: 'Explore the wonders of our world!',
    gradient: 'from-blue-200 to-cyan-200',
    hoverGradient: 'hover:from-blue-300 hover:to-cyan-300',
  },
  {
    id: 'social',
    name: 'Social Studies',
    icon: '🌍',
    description: 'Learn about people and places!',
    gradient: 'from-green-200 to-emerald-200',
    hoverGradient: 'hover:from-green-300 hover:to-emerald-300',
  },
  {
    id: 'english',
    name: 'English',
    icon: '💬',
    description: 'Stories, words, and grammar fun!',
    gradient: 'from-red-200 to-pink-200',
    hoverGradient: 'hover:from-red-300 hover:to-pink-300',
  },
  {
    id: 'lifeskills',
    name: 'Life Skills',
    icon: '💡',
    description: 'Important skills for everyday life!',
    gradient: 'from-purple-200 to-violet-200',
    hoverGradient: 'hover:from-purple-300 hover:to-violet-300',
  },
  {
    id: 'creative',
    name: 'Creative Arts',
    icon: '🎨',
    description: 'Art, music, and imagination!',
    gradient: 'from-pink-200 to-rose-200',
    hoverGradient: 'hover:from-pink-300 hover:to-rose-300',
  },
];

export default function Dashboard() {
  const { user, dbUser } = useAuth();

  // Redirect if not authenticated or no profile
  if (!user || !dbUser) {
    return <Link href="/" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="font-fredoka text-4xl md:text-5xl text-gray-800 mb-4">
            Choose Your Adventure! 🚀
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            Pick a subject and start learning with amazing stories, {dbUser.name}!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={`/learn/${subject.id}`}>
                <Card className={`cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 hover:-translate-y-2 shadow-lg hover:shadow-2xl bg-gradient-to-br ${subject.gradient} ${subject.hoverGradient} border-0`}>
                  <CardContent className="p-8 text-center">
                    <div className="text-6xl mb-4">{subject.icon}</div>
                    <h3 className="font-fredoka text-2xl text-gray-800 mb-2">
                      {subject.name}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {subject.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">📚</div>
              <h3 className="font-fredoka text-xl text-gray-800 mb-1">Stories Read</h3>
              <p className="text-2xl font-bold text-purple-600">0</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">🏆</div>
              <h3 className="font-fredoka text-xl text-gray-800 mb-1">Badges Earned</h3>
              <p className="text-2xl font-bold text-yellow-600">0</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-2">🔥</div>
              <h3 className="font-fredoka text-xl text-gray-800 mb-1">Learning Streak</h3>
              <p className="text-2xl font-bold text-red-500">0 days</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
