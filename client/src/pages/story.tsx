import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/auth-context';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { AchievementPopup } from '@/components/achievement-popup';
import { DoubtBot } from '@/components/doubt-bot';

export default function Story() {
  const { dbUser } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newAchievement, setNewAchievement] = useState<any>(null);
  
  // Get story ID from URL
  const currentPath = window.location.pathname;
  const storyId = currentPath.split('/').pop();

  const { data: story, isLoading } = useQuery({
    queryKey: ['/api/stories', storyId],
    enabled: !!storyId,
  });

  const markAsLearnedMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('PUT', `/api/stories/${storyId}`, {
        isLearned: true
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stories'] });
      queryClient.invalidateQueries({ queryKey: ['/api/progress'] });
      toast({
        title: "Great job! 🎉",
        description: "Story marked as learned!",
      });
      
      // Check for new achievements
      checkForAchievements();
    },
  });

  const checkForAchievements = async () => {
    try {
      const response = await fetch(`/api/achievements/user/${dbUser?.id}`);
      if (response.ok) {
        const achievements = await response.json();
        const latestAchievement = achievements[achievements.length - 1];
        
        // Show achievement if it's very recent (within last 10 seconds)
        if (latestAchievement && new Date(latestAchievement.unlockedAt).getTime() > Date.now() - 10000) {
          setNewAchievement(latestAchievement);
        }
      }
    } catch (error) {
      console.error('Failed to check achievements:', error);
    }
  };

  const downloadStory = () => {
    if (!story) return;
    
    const storyText = `${story.title}\n\n${story.panels.map((panel: any) => 
      `${panel.characterName}: ${panel.text}`
    ).join('\n\n')}`;
    
    const blob = new Blob([storyText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${story.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Story Downloaded! 📥",
      description: "Your story has been saved to your device.",
    });
  };

  const shareStory = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied! 📤",
      description: "Story link copied to clipboard!",
    });
  };

  const refreshStory = () => {
    if (!story) return;
    setLocation(`/learn/${story.subject}`);
  };

  // Redirect if not authenticated
  if (!dbUser) {
    setLocation('/');
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📚</div>
          <p className="text-xl text-gray-600">Loading your amazing story...</p>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-xl text-gray-600 mb-4">Story not found</p>
          <Button onClick={() => setLocation('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="font-fredoka text-4xl text-gray-800 mb-4">
            📚 {story.title}
          </h1>
          <p className="text-lg text-gray-600">
            A {story.subject} adventure about {story.topic}
          </p>
        </motion.div>

        {/* Story Panels */}
        <div className="space-y-8 mb-12">
          {story.panels.map((panel: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className={`${panel.background} border-4 border-gray-700 rounded-3xl shadow-lg relative`}>
                <div className="absolute -top-3 -right-3 text-4xl bg-white rounded-full p-2 shadow-lg">
                  {panel.character}
                </div>
                <CardContent className="p-6">
                  <h3 className="font-fredoka text-xl text-purple-700 mb-3">
                    {panel.characterName}:
                  </h3>
                  <p className="text-lg leading-relaxed text-gray-800">
                    {panel.text}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Story Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  onClick={refreshStory}
                  variant="outline"
                  className="bg-indigo-400 hover:bg-indigo-500 text-white border-0"
                >
                  <span className="mr-2">🔁</span>
                  New Story
                </Button>
                
                <Button
                  onClick={() => markAsLearnedMutation.mutate()}
                  disabled={markAsLearnedMutation.isPending || story.isLearned}
                  className={story.isLearned 
                    ? "bg-green-600 text-white" 
                    : "bg-green-400 hover:bg-green-500 text-white"
                  }
                >
                  <span className="mr-2">✅</span>
                  {story.isLearned ? 'Learned!' : 'Mark as Learned'}
                </Button>
                
                <Button
                  onClick={downloadStory}
                  variant="outline"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                >
                  <span className="mr-2">📥</span>
                  Download Story
                </Button>
                
                <Button
                  onClick={shareStory}
                  variant="outline"
                  className="bg-blue-400 hover:bg-blue-500 text-white border-0"
                >
                  <span className="mr-2">📤</span>
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Achievement Popup */}
      <AchievementPopup
        achievement={newAchievement}
        onClose={() => setNewAchievement(null)}
      />

      {/* Doubt Bot */}
      <DoubtBot />
    </div>
  );
}
