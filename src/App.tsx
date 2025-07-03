import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import TemplateGallery from './components/TemplateGallery';
import PosterEditor from './components/PosterEditor';
import PricingSection from './components/PricingSection';
import Footer from './components/Footer';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'editor'>('home');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    setCurrentView('editor');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedTemplate(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {currentView === 'home' ? (
        <>
          <Header />
          <Hero onGetStarted={() => setCurrentView('editor')} />
          <TemplateGallery onTemplateSelect={handleTemplateSelect} />
          <PricingSection />
          <Footer />
        </>
      ) : (
        <PosterEditor 
          template={selectedTemplate} 
          onBack={handleBackToHome}
        />
      )}
    </div>
  );
}

export default App;