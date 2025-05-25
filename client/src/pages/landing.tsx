import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { useAuth } from '@/contexts/auth-context';

export default function Landing() {
  const { user, dbUser, signIn } = useAuth();

  // If user is logged in and has profile, redirect to dashboard
  if (user && dbUser) {
    return <Link href="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-300 to-pink-200 relative overflow-hidden">
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-fredoka text-5xl md:text-7xl text-white mb-6 drop-shadow-lg"
          >
            Welcome to CartoonClassroom 🎉
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/90 mb-12 font-medium leading-relaxed"
          >
            Learn with your favorite cartoon characters through fun comic stories!
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            {user ? (
              <Link href="/signup">
                <Button className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-4 px-8 rounded-full text-xl shadow-xl transform hover:scale-105 transition duration-300 ease-in-out">
                  <span className="mr-2">🚀</span>
                  Complete Profile
                </Button>
              </Link>
            ) : (
              <>
                <Button 
                  onClick={signIn}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-4 px-8 rounded-full text-xl shadow-xl transform hover:scale-105 transition duration-300 ease-in-out"
                >
                  <span className="mr-2">🚀</span>
                  Get Started
                </Button>
                <Button 
                  onClick={signIn}
                  className="bg-green-400 hover:bg-green-500 text-white font-bold py-4 px-8 rounded-full text-xl shadow-xl transform hover:scale-105 transition duration-300 ease-in-out"
                >
                  <span className="mr-2">📚</span>
                  Login
                </Button>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
