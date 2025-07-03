import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Download, Share2, Palette, Type, Image, Wand2, Save, Eye } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useDesignStore } from '../stores/designStore';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

interface PosterEditorProps {
  template?: any;
  design?: any;
  onBack: () => void;
}

const PosterEditor = ({ template, design, onBack }: PosterEditorProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { updateDesign, createDesign, setCurrentDesign } = useDesignStore();
  const { profile } = useAuthStore();
  
  const [currentDesign, setCurrentDesignLocal] = useState(design);
  const [posterData, setPosterData] = useState({
    title: design?.title || 'Your Amazing Offer',
    subtitle: design?.subtitle || 'Limited Time Only',
    description: design?.description || 'Get the best deals and offers from our amazing collection. Don\'t miss out on this incredible opportunity!',
    price: design?.price || 'KES 2,999',
    originalPrice: design?.original_price || 'KES 4,999',
    contact: design?.contact || '+254 700 123 456',
    bgColor: design?.bg_color || template?.color_scheme || 'from-purple-600 to-blue-600',
    textColor: design?.text_color || 'text-white',
    logo: design?.logo_url || null
  });

  const [activeTab, setActiveTab] = useState<'text' | 'design' | 'images'>('text');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Create design if it doesn't exist
    if (!design && template) {
      createDesign(template.id).then((newDesign) => {
        setCurrentDesignLocal(newDesign);
        setCurrentDesign(newDesign);
      });
    }
  }, [template, design, createDesign, setCurrentDesign]);

  const backgroundOptions = [
    { name: 'Purple Blue', class: 'from-purple-600 to-blue-600' },
    { name: 'Red Orange', class: 'from-red-500 to-orange-500' },
    { name: 'Green Teal', class: 'from-green-500 to-teal-500' },
    { name: 'Pink Rose', class: 'from-pink-500 to-rose-500' },
    { name: 'Yellow Orange', class: 'from-yellow-400 to-orange-500' },
    { name: 'Indigo Purple', class: 'from-indigo-600 to-purple-600' }
  ];

  const aiSuggestions = [
    "Flash Sale - Up to 70% Off!",
    "Grand Opening Special - Visit Us Today!",
    "New Collection Now Available",
    "Weekend Special - Don't Miss Out!",
    "Limited Time Offer - Act Fast!"
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPosterData(prev => ({ ...prev, logo: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const generateAiText = () => {
    const randomSuggestion = aiSuggestions[Math.floor(Math.random() * aiSuggestions.length)];
    setPosterData(prev => ({ ...prev, title: randomSuggestion }));
  };

  const saveDesign = async () => {
    if (!currentDesign) return;
    
    setSaving(true);
    try {
      await updateDesign(currentDesign.id, {
        title: posterData.title,
        subtitle: posterData.subtitle,
        description: posterData.description,
        price: posterData.price,
        original_price: posterData.originalPrice,
        contact: posterData.contact,
        bg_color: posterData.bgColor,
        text_color: posterData.textColor,
        logo_url: posterData.logo,
        design_data: posterData
      });
      toast.success('Design saved successfully!');
    } catch (error) {
      toast.error('Failed to save design');
    } finally {
      setSaving(false);
    }
  };

  const downloadPoster = async () => {
    // Check if user has credits or subscription
    if (profile?.subscription_status !== 'active' && profile?.credits_remaining <= 0) {
      toast.error('You need credits or a subscription to download posters');
      return;
    }

    if (canvasRef.current) {
      try {
        const canvas = await html2canvas(canvasRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true
        });
        
        // Download as PNG
        const link = document.createElement('a');
        link.download = `${posterData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
        link.href = canvas.toDataURL();
        link.click();
        
        // Also create PDF version
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`${posterData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);

        // Deduct credit if not on active subscription
        if (profile?.subscription_status !== 'active') {
          // This would be handled by the backend in a real app
          toast.success('Poster downloaded! 1 credit used.');
        } else {
          toast.success('Poster downloaded successfully!');
        }
      } catch (error) {
        console.error('Error generating poster:', error);
        toast.error('Failed to download poster');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Editor Panel */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>
            
            <button
              onClick={saveDesign}
              disabled={saving}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save'}</span>
            </button>
          </div>
        </div>

        <div className="flex border-b border-gray-200">
          {[
            { id: 'text', icon: Type, label: 'Text' },
            { id: 'design', icon: Palette, label: 'Design' },
            { id: 'images', icon: Image, label: 'Images' }
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 font-medium transition-colors ${
                activeTab === id
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          {activeTab === 'text' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <button
                    onClick={generateAiText}
                    className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 text-sm"
                  >
                    <Wand2 className="h-4 w-4" />
                    <span>AI Generate</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={posterData.title}
                  onChange={(e) => setPosterData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                <input
                  type="text"
                  value={posterData.subtitle}
                  onChange={(e) => setPosterData(prev => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={posterData.description}
                  onChange={(e) => setPosterData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <input
                    type="text"
                    value={posterData.price}
                    onChange={(e) => setPosterData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Original Price</label>
                  <input
                    type="text"
                    value={posterData.originalPrice}
                    onChange={(e) => setPosterData(prev => ({ ...prev, originalPrice: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact</label>
                <input
                  type="text"
                  value={posterData.contact}
                  onChange={(e) => setPosterData(prev => ({ ...prev, contact: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {activeTab === 'design' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Background Color</label>
                <div className="grid grid-cols-2 gap-3">
                  {backgroundOptions.map((bg) => (
                    <button
                      key={bg.name}
                      onClick={() => setPosterData(prev => ({ ...prev, bgColor: bg.class }))}
                      className={`h-16 rounded-lg bg-gradient-to-r ${bg.class} border-2 transition-all ${
                        posterData.bgColor === bg.class ? 'border-gray-900 scale-105' : 'border-gray-200'
                      }`}
                      title={bg.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Text Color</label>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setPosterData(prev => ({ ...prev, textColor: 'text-white' }))}
                    className={`w-12 h-12 bg-black rounded-lg border-2 ${
                      posterData.textColor === 'text-white' ? 'border-gray-900' : 'border-gray-200'
                    }`}
                  />
                  <button
                    onClick={() => setPosterData(prev => ({ ...prev, textColor: 'text-gray-900' }))}
                    className={`w-12 h-12 bg-white rounded-lg border-2 ${
                      posterData.textColor === 'text-gray-900' ? 'border-gray-900' : 'border-gray-200'
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'images' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Upload Logo</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors"
                >
                  <Image className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-600">Click to upload logo</p>
                </button>
                {posterData.logo && (
                  <div className="mt-4">
                    <img src={posterData.logo} alt="Logo" className="w-20 h-20 object-contain mx-auto rounded-lg" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 space-y-3">
          <button
            onClick={downloadPoster}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download Poster</span>
          </button>
          <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center space-x-2">
            <Share2 className="h-4 w-4" />
            <span>Share Design</span>
          </button>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="flex-1 p-8 bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-2xl">
          <div
            ref={canvasRef}
            className={`w-96 h-[28rem] bg-gradient-to-br ${posterData.bgColor} p-6 rounded-xl ${posterData.textColor} relative overflow-hidden`}
          >
            {/* Logo */}
            {posterData.logo && (
              <div className="absolute top-4 right-4">
                <img src={posterData.logo} alt="Logo" className="w-16 h-16 object-contain bg-white/20 rounded-lg p-2" />
              </div>
            )}

            {/* Content */}
            <div className="h-full flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2 leading-tight">{posterData.title}</h1>
                <p className="text-xl opacity-90 mb-4">{posterData.subtitle}</p>
                <p className="text-sm opacity-80 leading-relaxed">{posterData.description}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold">{posterData.price}</span>
                  <span className="text-lg line-through opacity-60">{posterData.originalPrice}</span>
                </div>
                
                <div className="bg-black/20 backdrop-blur-sm p-3 rounded-lg">
                  <p className="text-sm font-medium">Contact us:</p>
                  <p className="text-lg font-bold">{posterData.contact}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosterEditor;