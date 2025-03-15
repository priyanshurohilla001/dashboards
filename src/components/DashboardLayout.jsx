import React from "react";
import { NavLink } from "react-router-dom";
import BreadcrumbDash from "./BreadcrumbDash";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 min-h-screen bg-gray-100 p-4">
        <nav className="space-y-2">
          <NavLink 
            to="/dashboard" 
            end
            className={({ isActive }) => 
              `block p-2 rounded ${isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`
            }
          >
            Home
          </NavLink>
          <NavLink 
            to="/dashboard/appointments" 
            className={({ isActive }) => 
              `block p-2 rounded ${isActive ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`
            }
          >
            Appointments
          </NavLink>
          {/* Add more sidebar links as needed */}
        </nav>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-4">
         <BreadcrumbDash/>
        </div>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;