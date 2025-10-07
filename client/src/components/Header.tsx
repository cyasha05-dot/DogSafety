import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Shield, Users, Phone, Stethoscope } from "lucide-react";

interface HeaderProps {
  activeView: 'citizen' | 'municipal' | 'doctor';
  onViewChange: (view: 'citizen' | 'municipal' | 'doctor') => void;
}

export function Header({ activeView, onViewChange }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-primary rounded-lg p-2">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Street Guardian</h1>
              <p className="text-sm text-gray-500">Dog Incident Reporting System</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={activeView === 'citizen' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('citizen')}
                className="flex items-center space-x-2"
              >
                <Users className="h-4 w-4" />
                <span>Citizen Portal</span>
              </Button>
              <Button
                variant={activeView === 'municipal' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('municipal')}
                className="flex items-center space-x-2"
              >
                <Shield className="h-4 w-4" />
                <span>Municipal Dashboard</span>
              </Button>
              <Button
                variant={activeView === 'doctor' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('doctor')}
                className="flex items-center space-x-2"
              >
                <Stethoscope className="h-4 w-4" />
                <span>Animal Doctor</span>
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Emergency: 102</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}