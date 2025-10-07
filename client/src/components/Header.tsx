import { Button } from "./ui/button";
import { Shield, Users, Phone, Stethoscope, Key } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active view based on current path
  const getActiveView = (): "citizen" | "municipal" | "doctor" => {
    if (
      location.pathname.startsWith("/municipal") ||
      location.pathname.startsWith("/dashboard")
    )
      return "municipal";
    if (location.pathname.startsWith("/doctor")) return "doctor";
    return "citizen";
  };

  const activeView = getActiveView();

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-primary rounded-lg p-2">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Street Guardian
              </h1>
              <p className="text-sm text-gray-500">
                Dog Incident Reporting System
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={activeView === "citizen" ? "default" : "ghost"}
                size="sm"
                onClick={() => navigate("/citizen")}
                className="flex items-center space-x-2"
              >
                <Users className="h-4 w-4" />
                <span>Citizen Portal</span>
              </Button>
              <Button
                variant={activeView === "municipal" ? "default" : "ghost"}
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="flex items-center space-x-2"
              >
                <Shield className="h-4 w-4" />
                <span>Municipal Dashboard</span>
              </Button>
              <Button
                variant={activeView === "doctor" ? "default" : "ghost"}
                size="sm"
                onClick={() => navigate("/doctor")}
                className="flex items-center space-x-2"
              >
                <Stethoscope className="h-4 w-4" />
                <span>Animal Doctor</span>
              </Button>
            </div>

            {/* Emergency Contact */}
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Emergency: 102</span>
            </div>

            {/* Admin login */}
            <div
              className="flex items-center cursor-pointer ml-4"
              onClick={() => navigate("/admin-register")}
            >
              <Key className="h-5 w-5 text-gray-600 hover:text-gray-900" />
              <span className="ml-1 text-sm text-gray-600 hover:text-gray-900 hidden md:inline">
                Admin
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
