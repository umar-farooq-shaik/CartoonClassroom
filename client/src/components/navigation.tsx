import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';

export const Navigation = () => {
  const [location, setLocation] = useLocation();
  const { user, dbUser, signIn, signOut } = useAuth();

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/dashboard', label: 'Learn', icon: '📚' },
    { path: '/history', label: 'History', icon: '📖' },
    { path: '/achievements', label: 'Progress', icon: '🏆' },
    { path: '/textbook', label: 'Textbook', icon: '📚' },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <span className="text-3xl">🎓</span>
              <span className="font-fredoka text-2xl text-gray-800">CartoonClassroom</span>
            </div>
          </Link>

          {user && dbUser && (
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={location === item.path ? "default" : "ghost"}
                    className={`rounded-full ${
                      location === item.path
                        ? 'bg-yellow-400 text-white hover:bg-yellow-500'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-1">{item.icon}</span>
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-3">
            {user && dbUser ? (
              <>
                <Button onClick={signOut} variant="outline" size="sm">
                  Sign Out
                </Button>
                <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {dbUser.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-center">
                <Button 
                  onClick={signIn} 
                  variant="default" 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300"
                >
                  Sign In
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
