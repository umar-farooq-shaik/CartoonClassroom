import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/auth-context';
import { Link, useLocation } from 'wouter';
import { useState } from 'react';

const subjectColors: Record<string, string> = {
  math: 'bg-yellow-200 text-yellow-800',
  science: 'bg-blue-200 text-blue-800',
  social: 'bg-green-200 text-green-800',
  english: 'bg-red-200 text-red-800',
  lifeskills: 'bg-purple-200 text-purple-800',
  creative: 'bg-pink-200 text-pink-800',
};

const subjectEmojis: Record<string, string> = {
  math: '📐',
  science: '🧪',
  social: '🌍',
  english: '💬',
  lifeskills: '💡',
  creative: '🎨',
};

export default function History() {
  const { dbUser } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const { data: stories = [], isLoading } = useQuery({
    queryKey: ['/api/stories/user', dbUser?.id],
    enabled: !!dbUser?.id,
  });

  // Redirect if not authenticated
  if (!dbUser) {
    setLocation('/');
    return null;
  }

  const filteredStories = selectedSubject === 'all' 
    ? stories 
    : stories.filter((story: any) => story.subject === selectedSubject);

  const subjects = [...new Set(stories.map((story: any) => story.subject))];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📚</div>
          <p className="text-xl text-gray-600">Loading your story collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="font-fredoka text-4xl md:text-5xl text-gray-800 mb-4">
            📖 Your Story Collection
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            Revisit all the amazing stories you've learned!
          </p>
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 flex justify-center"
        >
          <div className="w-full max-w-xs">
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="bg-white shadow-lg border-2 border-purple-200">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject: string) => (
                  <SelectItem key={subject} value={subject}>
                    {subjectEmojis[subject]} {subject.charAt(0).toUpperCase() + subject.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Stories Grid */}
        {filteredStories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">📚</div>
            <h3 className="font-fredoka text-2xl text-gray-600 mb-4">
              {selectedSubject === 'all' 
                ? "No stories yet!" 
                : `No ${selectedSubject} stories yet!`
              }
            </h3>
            <p className="text-gray-500 mb-6">
              Start your learning journey by creating your first story!
            </p>
            <Link href="/dashboard">
              <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                <span className="mr-2">🚀</span>
                Start Learning
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story: any, index: number) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={`/story/${story.id}`}>
                  <Card className="cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105 hover:-translate-y-2 shadow-lg hover:shadow-2xl bg-white border-0">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-4xl">
                          {subjectEmojis[story.subject] || '📚'}
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge 
                            className={`${subjectColors[story.subject] || 'bg-gray-200 text-gray-800'} font-medium`}
                          >
                            {story.subject.charAt(0).toUpperCase() + story.subject.slice(1)}
                          </Badge>
                          {story.isLearned && (
                            <Badge className="bg-green-200 text-green-800">
                              ✅ Learned
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <h3 className="font-fredoka text-lg text-gray-800 mb-2 line-clamp-2">
                        {story.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-4">
                        Topic: {story.topic}
                      </p>
                      
                      <div className="text-xs text-gray-500">
                        Created: {new Date(story.createdAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
