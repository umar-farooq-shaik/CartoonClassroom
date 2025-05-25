import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/auth-context';
import { apiRequest } from '@/lib/queryClient';
import { useLocation, Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';

const subjectColors: Record<string, string> = {
  math: 'from-yellow-400 to-orange-400',
  science: 'from-blue-400 to-cyan-400',
  social: 'from-green-400 to-emerald-400',
  english: 'from-red-400 to-pink-400',
  lifeskills: 'from-purple-400 to-violet-400',
  creative: 'from-pink-400 to-rose-400',
};

const subjectEmojis: Record<string, string> = {
  math: '📐',
  science: '🧪',
  social: '🌍',
  english: '💬',
  lifeskills: '💡',
  creative: '🎨',
};

export default function Textbook() {
  const { dbUser } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTextbook, setNewTextbook] = useState({
    name: '',
    description: '',
    subject: '',
  });

  const { data: textbooks = [], isLoading: textbooksLoading } = useQuery({
    queryKey: ['/api/textbooks/user', dbUser?.id],
    enabled: !!dbUser?.id,
  });

  const { data: stories = [] } = useQuery({
    queryKey: ['/api/stories/user', dbUser?.id],
    enabled: !!dbUser?.id,
  });

  const createTextbookMutation = useMutation({
    mutationFn: async (textbookData: any) => {
      const response = await apiRequest('POST', '/api/textbooks', textbookData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/textbooks'] });
      setIsCreateDialogOpen(false);
      setNewTextbook({ name: '', description: '', subject: '' });
      toast({
        title: "Textbook Created! 📚",
        description: "Your new textbook is ready for stories!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create textbook. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Redirect if not authenticated
  if (!dbUser) {
    setLocation('/');
    return null;
  }

  const handleCreateTextbook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTextbook.name || !newTextbook.subject) {
      toast({
        title: "Missing Information",
        description: "Please fill in the textbook name and subject.",
        variant: "destructive",
      });
      return;
    }

    createTextbookMutation.mutate({
      userId: dbUser.id,
      ...newTextbook,
    });
  };

  const getStoriesForTextbook = (textbook: any) => {
    return stories.filter((story: any) => textbook.storyIds.includes(story.id));
  };

  if (textbooksLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📚</div>
          <p className="text-xl text-gray-600">Loading your textbooks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="font-fredoka text-4xl text-gray-800 mb-4">
            📚 My Comic Textbooks
          </h1>
          <p className="text-lg text-gray-600">
            Create your own collection of favorite stories
          </p>
        </motion.div>

        {/* Create New Textbook */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-white shadow-lg">
            <CardContent className="p-8 text-center">
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full text-xl shadow-xl transform hover:scale-105 transition duration-300 ease-in-out">
                    <span className="mr-2">➕</span>
                    Create New Textbook
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="font-fredoka text-2xl">
                      📚 Create Your Comic Textbook
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateTextbook} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Textbook Name</Label>
                      <Input
                        id="name"
                        value={newTextbook.name}
                        onChange={(e) => setNewTextbook(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Cool Math Stories"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Select
                        value={newTextbook.subject}
                        onValueChange={(value) => setNewTextbook(prev => ({ ...prev, subject: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="math">📐 Math</SelectItem>
                          <SelectItem value="science">🧪 Science</SelectItem>
                          <SelectItem value="social">🌍 Social Studies</SelectItem>
                          <SelectItem value="english">💬 English</SelectItem>
                          <SelectItem value="lifeskills">💡 Life Skills</SelectItem>
                          <SelectItem value="creative">🎨 Creative Arts</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea
                        id="description"
                        value={newTextbook.description}
                        onChange={(e) => setNewTextbook(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe what this textbook is about..."
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={createTextbookMutation.isPending}
                      className="w-full bg-green-500 hover:bg-green-600 text-white"
                    >
                      {createTextbookMutation.isPending ? 'Creating...' : 'Create Textbook'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </motion.div>

        {/* Textbooks List */}
        {textbooks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">📚</div>
            <h3 className="font-fredoka text-2xl text-gray-600 mb-4">
              No textbooks yet!
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first textbook to organize your favorite stories!
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {textbooks.map((textbook: any, index: number) => {
              const textbookStories = getStoriesForTextbook(textbook);
              return (
                <motion.div
                  key={textbook.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-white shadow-lg overflow-hidden">
                    <div className={`bg-gradient-to-r ${subjectColors[textbook.subject] || 'from-gray-400 to-gray-500'} p-6 text-white`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-fredoka text-2xl mb-2">
                            {textbook.name}
                          </h3>
                          <p className="opacity-90">
                            {textbook.description || `${textbookStories.length} amazing stories`}
                          </p>
                        </div>
                        <div className="text-4xl">
                          {subjectEmojis[textbook.subject] || '📚'}
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      {textbookStories.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-500 mb-4">
                            No stories in this textbook yet.
                          </p>
                          <Link href={`/learn/${textbook.subject}`}>
                            <Button variant="outline">
                              <span className="mr-2">➕</span>
                              Add Stories
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {textbookStories.map((story: any) => (
                            <Link key={story.id} href={`/story/${story.id}`}>
                              <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200 bg-gray-50 border border-gray-200">
                                <CardContent className="p-4">
                                  <h4 className="font-medium text-gray-800 mb-1 line-clamp-2">
                                    {story.title}
                                  </h4>
                                  <p className="text-sm text-gray-600 mb-2">
                                    Topic: {story.topic}
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <Badge className={`${subjectColors[story.subject] ? 'bg-opacity-20' : 'bg-gray-200'} text-xs`}>
                                      {story.subject}
                                    </Badge>
                                    {story.isLearned && (
                                      <Badge className="bg-green-200 text-green-800 text-xs">
                                        ✅
                                      </Badge>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            </Link>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
