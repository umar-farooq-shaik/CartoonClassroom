import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { useMutation } from '@tanstack/react-query';
import { generateStory } from '@/lib/gemini';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

const suggestedTopicsBySubject: Record<string, string[]> = {
  math: ['Addition & Subtraction', 'Multiplication Tables', 'Fractions', 'Geometry Shapes', 'Time & Calendar', 'Money & Coins'],
  science: ['Water Cycle', 'Solar System', 'Animal Habitats', 'Plants & Photosynthesis', 'Weather & Seasons', 'States of Matter'],
  social: ['Community Helpers', 'Countries & Capitals', 'Historical Events', 'Cultural Traditions', 'Geography & Maps', 'Government & Rules'],
  english: ['Reading Comprehension', 'Creative Writing', 'Grammar & Punctuation', 'Vocabulary Building', 'Poetry & Rhymes', 'Storytelling'],
  lifeskills: ['Personal Hygiene', 'Safety Rules', 'Healthy Eating', 'Money Management', 'Time Management', 'Communication Skills'],
  creative: ['Drawing & Painting', 'Music & Rhythm', 'Dance & Movement', 'Crafts & Making', 'Drama & Acting', 'Imagination & Stories'],
};

const subjectEmojis: Record<string, string> = {
  math: '📐',
  science: '🧪',
  social: '🌍',
  english: '💬',
  lifeskills: '💡',
  creative: '🎨',
};

export default function TopicInput() {
  const { dbUser } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [topic, setTopic] = useState('');
  
  // Get subject from URL
  const currentPath = window.location.pathname;
  const subject = currentPath.split('/').pop() || 'math';
  
  const subjectName = subject.charAt(0).toUpperCase() + subject.slice(1);
  const subjectIcon = subjectEmojis[subject] || '📚';
  const suggestedTopics = suggestedTopicsBySubject[subject] || [];

  const generateStoryMutation = useMutation({
    mutationFn: async (topicText: string) => {
      if (!dbUser) throw new Error('User not found');
      return generateStory(topicText, subject, dbUser.id);
    },
    onSuccess: (story) => {
      toast({
        title: "Story Created! 🎉",
        description: "Your amazing story is ready to read!",
      });
      setLocation(`/story/${story.id}`);
    },
    onError: (error) => {
      toast({
        title: "Story Generation Failed",
        description: error.message || "Failed to generate story. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic or select one from suggestions.",
        variant: "destructive",
      });
      return;
    }
    generateStoryMutation.mutate(topic.trim());
  };

  const selectTopic = (selectedTopic: string) => {
    setTopic(selectedTopic);
  };

  // Redirect if not authenticated
  if (!dbUser) {
    setLocation('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 to-pink-100 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="shadow-2xl border-0 bg-white">
            <CardHeader className="text-center pb-6">
              <CardTitle className="font-fredoka text-3xl md:text-4xl text-gray-800 mb-4">
                {subjectIcon} What do you want to learn today in {subjectName}?
              </CardTitle>
              <p className="text-lg text-gray-600">
                Tell us what interests you and we'll create an amazing story just for you!
              </p>
            </CardHeader>
            
            <CardContent className="space-y-8">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <Input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Type your topic, like Gravity, Fractions, etc..."
                    className="w-full p-6 text-lg border-4 border-purple-200 rounded-2xl focus:border-purple-500 focus:outline-none font-medium"
                    disabled={generateStoryMutation.isPending}
                  />
                  
                  <div className="text-center">
                    <Button
                      type="submit"
                      disabled={generateStoryMutation.isPending || !topic.trim()}
                      className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 px-8 rounded-full text-xl shadow-xl transform hover:scale-105 transition duration-300 ease-in-out"
                    >
                      {generateStoryMutation.isPending ? (
                        <>
                          <span className="animate-spin mr-2">🌟</span>
                          Creating Your Story...
                        </>
                      ) : (
                        <>
                          <span className="mr-2">✨</span>
                          Generate Story
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
              
              <div className="space-y-4">
                <h3 className="font-fredoka text-xl text-gray-700 text-center">
                  💡 Or pick from these suggestions:
                </h3>
                <div className="flex flex-wrap gap-3 justify-center">
                  {suggestedTopics.map((suggestedTopic) => (
                    <Badge
                      key={suggestedTopic}
                      variant="secondary"
                      className="cursor-pointer bg-yellow-200 hover:bg-yellow-300 text-gray-800 px-4 py-2 rounded-full font-medium transition duration-200 text-sm"
                      onClick={() => selectTopic(suggestedTopic)}
                    >
                      {suggestedTopic}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
