import React from 'react';
import { Palette, User, Crown } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
              <Palette className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              PosterPro
            </span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#templates" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">Templates</a>
            <a href="#pricing" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">Pricing</a>
            <a href="#how-it-works" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">How it Works</a>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all">
              <Crown className="h-4 w-4" />
              <span>Pro Plan</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors">
              <User className="h-5 w-5" />
              <span className="hidden md:inline">Sign In</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;