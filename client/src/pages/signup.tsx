import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

const popularCartoons = [
  'Mickey Mouse', 'SpongeBob', 'Peppa Pig', 'Dora the Explorer', 'Paw Patrol',
  'Pokemon', 'Ben 10', 'Tom and Jerry', 'Scooby-Doo', 'The Simpsons',
  'Frozen', 'Toy Story', 'Finding Nemo', 'Moana', 'Lion King'
];

export default function Signup() {
  const { user, dbUser, signIn } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    class: '',
    location: '',
    favoriteCartoons: [] as string[],
  });

  const [cartoonInput, setCartoonInput] = useState('');

  const createUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await apiRequest('POST', '/api/users', userData);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/users/external'] });
      // Sign in the user after successful profile creation
      toast({
        title: "Welcome to CartoonClassroom! 🎉",
        description: "Your profile is ready! Let's start learning!",
      });
      setLocation('/dashboard');
    },
    onError: (error) => {
      console.error('Profile creation error:', error);
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Redirect if user already has profile
  if (dbUser) {
    setLocation('/dashboard');
    return null;
  }

  // We'll handle authentication differently - don't redirect
  // This allows new users to sign up directly

  const addCartoon = () => {
    if (cartoonInput.trim() && !formData.favoriteCartoons.includes(cartoonInput.trim())) {
      setFormData(prev => ({
        ...prev,
        favoriteCartoons: [...prev.favoriteCartoons, cartoonInput.trim()]
      }));
      setCartoonInput('');
    }
  };

  const removeCartoon = (cartoon: string) => {
    setFormData(prev => ({
      ...prev,
      favoriteCartoons: prev.favoriteCartoons.filter(c => c !== cartoon)
    }));
  };

  const selectSuggestedCartoon = (cartoon: string) => {
    if (!formData.favoriteCartoons.includes(cartoon)) {
      setFormData(prev => ({
        ...prev,
        favoriteCartoons: [...prev.favoriteCartoons, cartoon]
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.age || !formData.class || !formData.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // If user is not signed in, sign them in first
    if (!user) {
      signIn();
      // Wait for auth to complete before creating profile
      setTimeout(() => {
        const storedUser = localStorage.getItem('demo_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          createUserMutation.mutate({
            externalId: userData.id,
            name: formData.name,
            age: parseInt(formData.age),
            class: formData.class,
            location: formData.location,
            favoriteCartoons: formData.favoriteCartoons,
          });
        }
      }, 100);
    } else {
      createUserMutation.mutate({
        externalId: user.id,
        name: formData.name,
        age: parseInt(formData.age),
        class: formData.class,
        location: formData.location,
        favoriteCartoons: formData.favoriteCartoons,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 to-yellow-100 px-4 py-8">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center pb-6">
              <CardTitle className="font-fredoka text-3xl text-gray-800 mb-2">
                Let's Get to Know You! 🌟
              </CardTitle>
              <p className="text-gray-600">
                Tell us about yourself so we can create amazing stories just for you!
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-lg font-semibold text-gray-700">
                    What's your name? 👋
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your name"
                    className="text-lg p-4 rounded-xl border-2 border-purple-200 focus:border-purple-400"
                    required
                  />
                </div>

                {/* Age */}
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-lg font-semibold text-gray-700">
                    How old are you? 🎂
                  </Label>
                  <Select value={formData.age} onValueChange={(value) => setFormData(prev => ({ ...prev, age: value }))}>
                    <SelectTrigger className="text-lg p-4 rounded-xl border-2 border-purple-200">
                      <SelectValue placeholder="Select your age" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => i + 5).map(age => (
                        <SelectItem key={age} value={age.toString()}>{age} years old</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Class */}
                <div className="space-y-2">
                  <Label htmlFor="class" className="text-lg font-semibold text-gray-700">
                    What class are you in? 🏫
                  </Label>
                  <Select value={formData.class} onValueChange={(value) => setFormData(prev => ({ ...prev, class: value }))}>
                    <SelectTrigger className="text-lg p-4 rounded-xl border-2 border-purple-200">
                      <SelectValue placeholder="Select your class" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`).map(grade => (
                        <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-lg font-semibold text-gray-700">
                    Where are you from? 🌍
                  </Label>
                  <Input
                    id="location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Enter your city or country"
                    className="text-lg p-4 rounded-xl border-2 border-purple-200 focus:border-purple-400"
                    required
                  />
                </div>

                {/* Favorite Cartoons */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold text-gray-700">
                    What are your favorite cartoons? 📺
                  </Label>
                  
                  <div className="flex space-x-2">
                    <Input
                      type="text"
                      value={cartoonInput}
                      onChange={(e) => setCartoonInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCartoon())}
                      placeholder="Type a cartoon name"
                      className="flex-1 p-3 rounded-xl border-2 border-purple-200 focus:border-purple-400"
                    />
                    <Button 
                      type="button" 
                      onClick={addCartoon}
                      className="bg-green-400 hover:bg-green-500 text-white px-6 rounded-xl"
                    >
                      + Add
                    </Button>
                  </div>

                  {formData.favoriteCartoons.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.favoriteCartoons.map(cartoon => (
                        <Badge 
                          key={cartoon} 
                          variant="secondary" 
                          className="text-sm py-1 px-3 bg-purple-100 text-purple-700 cursor-pointer hover:bg-purple-200"
                          onClick={() => removeCartoon(cartoon)}
                        >
                          {cartoon} ✕
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Or pick from popular cartoons:</p>
                    <div className="flex flex-wrap gap-2">
                      {popularCartoons.filter(cartoon => !formData.favoriteCartoons.includes(cartoon)).map(cartoon => (
                        <Badge 
                          key={cartoon} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-yellow-100 hover:border-yellow-400"
                          onClick={() => selectSuggestedCartoon(cartoon)}
                        >
                          {cartoon}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={createUserMutation.isPending}
                  className="w-full bg-blue-400 hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-full text-xl shadow-xl transform hover:scale-105 transition duration-300 ease-in-out"
                >
                  {createUserMutation.isPending ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Creating Your Profile...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">🎯</span>
                      Start Learning
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
