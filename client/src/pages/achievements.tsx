import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/auth-context';
import { useLocation } from 'wouter';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Achievements() {
  const { dbUser } = useAuth();
  const [, setLocation] = useLocation();

  const { data: progress } = useQuery({
    queryKey: ['/api/progress/user', dbUser?.id],
    enabled: !!dbUser?.id,
  });

  const { data: achievements = [] } = useQuery({
    queryKey: ['/api/achievements/user', dbUser?.id],
    enabled: !!dbUser?.id,
  });

  // Redirect if not authenticated
  if (!dbUser) {
    setLocation('/');
    return null;
  }

  // Create chart data from progress
  const chartData = progress?.subjectProgress ? Object.entries(progress.subjectProgress).map(([subject, data]: [string, any]) => ({
    subject: subject.charAt(0).toUpperCase() + subject.slice(1),
    stories: data.storiesCompleted || 0,
    topics: data.topicsLearned?.length || 0,
  })) : [];

  // All possible achievements
  const allAchievements = [
    { type: 'first_story', name: 'First Adventure', icon: '🎯', description: 'Completed your very first story!' },
    { type: 'math_master', name: 'Math Master', icon: '🧮', description: 'Completed 5 stories in Math!' },
    { type: 'science_explorer', name: 'Science Explorer', icon: '🔬', description: 'Completed 5 stories in Science!' },
    { type: 'english_master', name: 'Reading Champion', icon: '📖', description: 'Completed 5 stories in English!' },
    { type: 'social_master', name: 'World Explorer', icon: '🌍', description: 'Completed 5 stories in Social Studies!' },
    { type: 'lifeskills_master', name: 'Life Skills Pro', icon: '💡', description: 'Completed 5 stories in Life Skills!' },
    { type: 'creative_master', name: 'Creative Genius', icon: '🎨', description: 'Completed 5 stories in Creative Arts!' },
    { type: 'super_learner', name: 'Super Learner', icon: '🌟', description: 'Completed 20 stories total!' },
    { type: 'speed_reader', name: 'Speed Reader', icon: '⚡', description: 'Read 3 stories in one day!' },
    { type: 'streak_master', name: 'Streak Master', icon: '🔥', description: 'Maintained a 7-day learning streak!' },
  ];

  const earnedAchievementTypes = achievements.map((a: any) => a.type);

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 to-purple-100 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="font-fredoka text-4xl text-gray-800 mb-4">
            🏆 Your Amazing Progress!
          </h1>
          <p className="text-lg text-gray-600">
            Look how much you've learned and achieved, {dbUser.name}!
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-2">📚</div>
              <h3 className="font-fredoka text-2xl text-purple-600 mb-1">
                {progress?.totalStoriesRead || 0}
              </h3>
              <p className="text-gray-600">Stories Completed</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-2">⭐</div>
              <h3 className="font-fredoka text-2xl text-yellow-600 mb-1">
                {achievements.length}
              </h3>
              <p className="text-gray-600">Badges Earned</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-2">⏰</div>
              <h3 className="font-fredoka text-2xl text-green-600 mb-1">
                {Math.floor((progress?.totalTimeSpent || 0) / 60)}h {(progress?.totalTimeSpent || 0) % 60}m
              </h3>
              <p className="text-gray-600">Learning Time</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-2">🔥</div>
              <h3 className="font-fredoka text-2xl text-red-500 mb-1">
                {progress?.currentStreak || 0}
              </h3>
              <p className="text-gray-600">Day Streak</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Progress Chart */}
        {chartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="font-fredoka text-2xl text-gray-800 text-center">
                  📊 Your Learning Progress by Subject
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="stories" fill="#8884d8" name="Stories Completed" />
                    <Bar dataKey="topics" fill="#82ca9d" name="Topics Learned" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Achievement Collection */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="font-fredoka text-2xl text-gray-800 text-center">
                🏅 Your Achievement Collection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {allAchievements.map((achievement) => {
                  const isEarned = earnedAchievementTypes.includes(achievement.type);
                  return (
                    <motion.div
                      key={achievement.type}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`text-center p-4 rounded-xl border-2 transition-all duration-300 ${
                        isEarned
                          ? 'bg-yellow-50 border-yellow-200 shadow-lg'
                          : 'bg-gray-50 border-gray-200 opacity-50'
                      }`}
                    >
                      <div className={`text-3xl mb-2 ${isEarned ? '' : 'grayscale'}`}>
                        {achievement.icon}
                      </div>
                      <p className={`text-sm font-medium ${isEarned ? 'text-gray-800' : 'text-gray-500'}`}>
                        {achievement.name}
                      </p>
                      <p className={`text-xs mt-1 ${isEarned ? 'text-gray-600' : 'text-gray-400'}`}>
                        {achievement.description}
                      </p>
                      {!isEarned && (
                        <div className="mt-2">
                          <span className="text-xs bg-gray-200 px-2 py-1 rounded-full text-gray-500">
                            Locked
                          </span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
