import { Link } from 'react-router-dom';
import { ArrowRight, Link as LinkIcon, Zap } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <LinkIcon className="h-8 w-8 text-indigo-400" />
            <span className="text-2xl font-bold text-white">ShortLink</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-gray-300 hover:text-white">Login</Link>
            <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 text-white">
            Shorten Your URLs with
            <span className="text-indigo-600"> Ease</span>
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            Create short, memorable links in seconds. Track clicks, manage your URLs,
            and share them anywhere with our powerful URL shortener.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register" className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center">
              Start Shortening
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/login" className="border px-8 py-3 rounded-lg text-lg font-semibold transition-colors border-gray-600 text-gray-300 hover:bg-gray-800">
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-xl shadow-sm">
            <Zap className="h-12 w-12 mb-4 text-indigo-400" />
            <h3 className="text-xl font-semibold mb-2 text-white">Lightning Fast</h3>
            <p className="text-gray-300">Create short URLs instantly with our optimized service.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow-sm">
            <LinkIcon className="h-12 w-12 mb-4 text-indigo-400" />
            <h3 className="text-xl font-semibold mb-2 text-white">Custom Links</h3>
            <p className="text-gray-300">Create custom short codes or let us generate them for you.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow-sm">
            <div className="h-12 w-12 rounded-lg mb-4 flex items-center justify-center bg-indigo-500">
              <span className="text-white font-bold text-xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Analytics</h3>
            <p className="text-gray-300">Track your link performance and click statistics.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;