import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Hero from './components/Hero';
import TemplateGallery from './components/TemplateGallery';
import PosterEditor from './components/PosterEditor';
import PricingSection from './components/PricingSection';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './stores/authStore';
import { useDesignStore } from './stores/designStore';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'editor' | 'dashboard'>('home');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [selectedDesign, setSelectedDesign] = useState<any>(null);

  const { initialize, user } = useAuthStore();
  const { setCurrentDesign } = useDesignStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    setSelectedDesign(null);
    setCurrentView('editor');
  };

  const handleEditDesign = (design: any) => {
    setSelectedDesign(design);
    setSelectedTemplate(design.template);
    setCurrentDesign(design);
    setCurrentView('editor');
  };

  const handleGetStarted = () => {
    if (user) {
      setCurrentView('dashboard');
    } else {
      // This will trigger the auth modal in Header
      setCurrentView('editor');
    }
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedTemplate(null);
    setSelectedDesign(null);
    setCurrentDesign(null);
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedTemplate(null);
    setSelectedDesign(null);
    setCurrentDesign(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      
      {currentView === 'home' ? (
        <>
          <Header />
          <Hero onGetStarted={handleGetStarted} />
          <TemplateGallery onTemplateSelect={handleTemplateSelect} />
          <PricingSection />
          <Footer />
        </>
      ) : currentView === 'dashboard' ? (
        <ProtectedRoute>
          <Header />
          <Dashboard 
            onCreateNew={() => setCurrentView('editor')}
            onEditDesign={handleEditDesign}
          />
        </ProtectedRoute>
      ) : (
        <ProtectedRoute fallback={
          <>
            <Header />
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign in to start creating</h2>
                <p className="text-gray-600">Please sign in to access the poster editor.</p>
              </div>
            </div>
          </>
        }>
          <PosterEditor 
            template={selectedTemplate}
            design={selectedDesign}
            onBack={user ? handleBackToDashboard : handleBackToHome}
          />
        </ProtectedRoute>
      )}
    </div>
  );
}

export default App;