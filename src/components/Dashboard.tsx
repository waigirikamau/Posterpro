import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Download, Calendar, Eye } from 'lucide-react';
import { useDesignStore } from '../stores/designStore';
import { useAuthStore } from '../stores/authStore';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

interface DashboardProps {
  onCreateNew: () => void;
  onEditDesign: (design: any) => void;
}

const Dashboard = ({ onCreateNew, onEditDesign }: DashboardProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const { designs, loading, fetchDesigns, deleteDesign } = useDesignStore();
  const { profile } = useAuthStore();

  useEffect(() => {
    fetchDesigns();
  }, [fetchDesigns]);

  const categories = ['All', 'Restaurant', 'Event', 'Beauty', 'Business', 'Sale', 'Service'];

  const filteredDesigns = designs.filter(design => {
    const matchesSearch = design.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || 
      (design.template?.category === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this design?')) {
      try {
        await deleteDesign(id);
        toast.success('Design deleted successfully');
      } catch (error) {
        toast.error('Failed to delete design');
      }
    }
  };

  const getSubscriptionStatus = () => {
    if (!profile) return null;
    
    const isActive = profile.subscription_status === 'active';
    const plan = profile.subscription_plan;
    
    return (
      <div className={`px-4 py-2 rounded-full text-sm font-medium ${
        isActive 
          ? 'bg-green-100 text-green-800' 
          : 'bg-gray-100 text-gray-600'
      }`}>
        {isActive ? `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan` : 'Free Plan'}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Designs</h1>
              <p className="text-gray-600 mt-1">
                {designs.length} design{designs.length !== 1 ? 's' : ''} created
              </p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              {getSubscriptionStatus()}
              {profile && (
                <div className="text-sm text-gray-600">
                  Credits: <span className="font-semibold">{profile.credits_remaining}</span>
                </div>
              )}
              <button
                onClick={onCreateNew}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>New Design</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search your designs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Designs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredDesigns.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No designs yet</h3>
            <p className="text-gray-600 mb-6">Create your first poster design to get started</p>
            <button
              onClick={onCreateNew}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
            >
              Create Your First Design
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDesigns.map((design) => (
              <div key={design.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all group">
                {/* Preview */}
                <div className={`h-48 bg-gradient-to-br ${design.bg_color} p-4 relative`}>
                  <div className={`${design.text_color} h-full flex flex-col justify-between text-xs`}>
                    <div>
                      <h3 className="font-bold text-lg leading-tight mb-1">{design.title}</h3>
                      <p className="opacity-90 mb-2">{design.subtitle}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-baseline space-x-1">
                        <span className="text-lg font-bold">{design.price}</span>
                        <span className="text-sm line-through opacity-60">{design.original_price}</span>
                      </div>
                      <div className="bg-black/20 backdrop-blur-sm p-2 rounded text-xs">
                        <p className="font-medium">{design.contact}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEditDesign(design)}
                        className="bg-white text-purple-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Edit Design"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(design.id)}
                        className="bg-white text-red-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Delete Design"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 truncate">{design.title}</h4>
                    {design.template && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {design.template.category}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDistanceToNow(new Date(design.updated_at), { addSuffix: true })}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEditDesign(design)}
                        className="text-purple-600 hover:text-purple-700 transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-700 transition-colors"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;