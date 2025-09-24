import { useState } from "react";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { ReportForm } from "./components/ReportForm";
import { Dashboard } from "./components/Dashboard";
import { AnimalDoctor } from "./components/AnimalDoctor";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [activeView, setActiveView] = useState<'citizen' | 'municipal' | 'doctor'>('citizen');
  const [showReportForm, setShowReportForm] = useState(false);

  const handleStartReport = () => {
    setShowReportForm(true);
  };

  const handleBackToHome = () => {
    setShowReportForm(false);
  };

  const handleViewChange = (view: 'citizen' | 'municipal' | 'doctor') => {
    setActiveView(view);
    setShowReportForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeView={activeView} onViewChange={handleViewChange} />
      
      <main>
        {activeView === 'citizen' ? (
          <div>
            {!showReportForm ? (
              <HeroSection onStartReport={handleStartReport} />
            ) : (
              <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="mb-6">
                    <button
                      onClick={handleBackToHome}
                      className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                    >
                      <span>←</span>
                      <span>Back to Home</span>
                    </button>
                  </div>
                  <ReportForm />
                </div>
              </div>
            )}
          </div>
        ) : activeView === 'municipal' ? (
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Municipal Dashboard</h1>
                <p className="text-gray-600 mt-2">
                  Monitor and manage street dog incident reports from citizens
                </p>
              </div>
              <Dashboard />
            </div>
          </div>
        ) : (
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <AnimalDoctor />
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Street Guardian</h3>
              <p className="text-sm text-gray-600">
                Making communities safer through efficient incident reporting and municipal response coordination.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Emergency Contacts</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Emergency Services: 102</p>
                <p>Animal Control: 1800-XXX-XXXX</p>
                <p>Municipal Helpline: 1800-XXX-YYYY</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Quick Actions</h4>
              <div className="space-y-2 text-sm">
                <button 
                  onClick={handleStartReport}
                  className="block text-blue-600 hover:text-blue-800"
                >
                  Report New Incident
                </button>
                <button 
                  onClick={() => setActiveView('municipal')}
                  className="block text-blue-600 hover:text-blue-800"
                >
                  Municipal Dashboard
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-gray-500">
            <p>&copy; 2024 Street Guardian. All rights reserved. | Built for safer communities.</p>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}