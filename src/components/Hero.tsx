import React from 'react';
import { ArrowRight, Sparkles, Zap, Users } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 backdrop-blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">AI-Powered Design Tool</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Create Stunning
            <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Posters & Fliers
            </span>
            in Minutes
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Perfect for small businesses, hustlers, and entrepreneurs. No design skills needed. 
            Professional results guaranteed.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            <button 
              onClick={onGetStarted}
              className="group bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
            >
              <span>Start Creating Now</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-purple-300 hover:text-purple-600 transition-all duration-300">
              View Templates
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all">
              <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-4">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Create professional designs in under 5 minutes</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all">
              <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">AI-Powered</h3>
              <p className="text-gray-600">Smart text suggestions and auto-optimization</p>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all">
              <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Business Ready</h3>
              <p className="text-gray-600">Templates designed for Kenyan businesses</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;