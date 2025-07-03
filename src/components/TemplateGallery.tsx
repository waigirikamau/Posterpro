import React, { useState, useEffect } from 'react';
import { Search, Filter, Heart, Download, Crown } from 'lucide-react';
import { useDesignStore } from '../stores/designStore';
import { useAuthStore } from '../stores/authStore';
import { Template } from '../lib/supabase';

interface TemplateGalleryProps {
  onTemplateSelect: (template: Template) => void;
}

const TemplateGallery = ({ onTemplateSelect }: TemplateGalleryProps) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const { templates, fetchTemplates } = useDesignStore();
  const { profile } = useAuthStore();

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const categories = ['All', 'Restaurant', 'Event', 'Beauty', 'Business', 'Sale', 'Service'];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const canAccessTemplate = (template: Template) => {
    if (!template.is_premium) return true;
    return profile?.subscription_status === 'active' || profile?.credits_remaining > 0;
  };

  return (
    <section id="templates" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Perfect Template
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional designs crafted for Kenyan businesses. Pick a template and customize it to match your brand.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <div className="flex space-x-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => {
            const canAccess = canAccessTemplate(template);
            
            return (
              <div
                key={template.id}
                className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105 ${
                  !canAccess ? 'opacity-75' : ''
                }`}
                onClick={() => canAccess && onTemplateSelect(template)}
              >
                <div className="relative">
                  <div className={`h-48 bg-gradient-to-br ${template.color_scheme} p-6 flex items-center justify-center`}>
                    {template.preview_url ? (
                      <img
                        src={template.preview_url}
                        alt={template.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-white text-center">
                        <h3 className="text-xl font-bold mb-2">{template.name}</h3>
                        <p className="text-sm opacity-80">Preview Template</p>
                      </div>
                    )}
                  </div>
                  
                  {template.is_popular && (
                    <div className="absolute top-3 left-3 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold">
                      Popular
                    </div>
                  )}

                  {template.is_premium && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                      <Crown className="h-3 w-3" />
                      <span>Pro</span>
                    </div>
                  )}
                  
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                      <Heart className="h-4 w-4 text-gray-700" />
                    </button>
                  </div>
                  
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    {canAccess ? (
                      <button className="opacity-0 group-hover:opacity-100 bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all">
                        Use Template
                      </button>
                    ) : (
                      <div className="opacity-0 group-hover:opacity-100 bg-white text-gray-600 px-6 py-2 rounded-lg font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all">
                        <div className="flex items-center space-x-2">
                          <Crown className="h-4 w-4" />
                          <span>Premium Required</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg text-gray-900">{template.name}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {template.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{template.usage_count} uses</span>
                    {template.is_premium && !canAccess && (
                      <div className="flex items-center space-x-1 text-orange-600">
                        <Crown className="h-3 w-3" />
                        <span>Premium</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Can't find what you're looking for? More templates coming soon!
          </p>
        </div>
      </div>
    </section>
  );
};

export default TemplateGallery;