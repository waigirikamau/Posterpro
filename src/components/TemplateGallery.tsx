import React, { useState } from 'react';
import { Search, Filter, Heart, Download } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  category: string;
  preview: string;
  color: string;
  popular: boolean;
}

interface TemplateGalleryProps {
  onTemplateSelect: (template: Template) => void;
}

const TemplateGallery = ({ onTemplateSelect }: TemplateGalleryProps) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Restaurant', 'Event', 'Beauty', 'Business', 'Sale', 'Service'];
  
  const templates: Template[] = [
    { id: '1', name: 'Restaurant Special', category: 'Restaurant', preview: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400', color: 'from-red-500 to-orange-500', popular: true },
    { id: '2', name: 'Grand Opening', category: 'Event', preview: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400', color: 'from-purple-500 to-pink-500', popular: true },
    { id: '3', name: 'Beauty Salon', category: 'Beauty', preview: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=400', color: 'from-pink-500 to-rose-500', popular: false },
    { id: '4', name: 'Business Promo', category: 'Business', preview: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400', color: 'from-blue-500 to-cyan-500', popular: true },
    { id: '5', name: 'Flash Sale', category: 'Sale', preview: 'https://images.pexels.com/photos/3962294/pexels-photo-3962294.jpeg?auto=compress&cs=tinysrgb&w=400', color: 'from-yellow-500 to-orange-500', popular: false },
    { id: '6', name: 'Service Offer', category: 'Service', preview: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400', color: 'from-green-500 to-teal-500', popular: true },
    { id: '7', name: 'Food Delivery', category: 'Restaurant', preview: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400', color: 'from-orange-500 to-red-500', popular: false },
    { id: '8', name: 'Wedding Event', category: 'Event', preview: 'https://images.pexels.com/photos/1729931/pexels-photo-1729931.jpeg?auto=compress&cs=tinysrgb&w=400', color: 'from-purple-500 to-blue-500', popular: true },
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105"
              onClick={() => onTemplateSelect(template)}
            >
              <div className="relative">
                <div className={`h-48 bg-gradient-to-br ${template.color} p-6 flex items-center justify-center`}>
                  <img
                    src={template.preview}
                    alt={template.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                
                {template.popular && (
                  <div className="absolute top-3 left-3 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold">
                    Popular
                  </div>
                )}
                
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                    <Heart className="h-4 w-4 text-gray-700" />
                  </button>
                </div>
                
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                  <button className="opacity-0 group-hover:opacity-100 bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold transform translate-y-4 group-hover:translate-y-0 transition-all">
                    Use Template
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">{template.name}</h3>
                <p className="text-gray-500 text-sm">{template.category}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all">
            Load More Templates
          </button>
        </div>
      </div>
    </section>
  );
};

export default TemplateGallery;