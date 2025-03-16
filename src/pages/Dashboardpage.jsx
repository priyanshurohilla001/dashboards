import { useSupabaseAuth } from "@/context/SupabaseAuthContext";
import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout.jsx";
import { Button } from "@/components/ui/button.jsx";

// Dashboard home component
const DashboardHome = () => {
  const { user } = useSupabaseAuth();
  return (
    <div>
      <h2 className="text-2xl font-semibold">Hello {user?.email || "User"}</h2>
      <p className="mt-2">Welcome to your dashboard</p>
    </div>
  );
};

// Products component
const Products = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold">Products</h2>
      <p className="mt-2">Manage your products here</p>
    </div>
  );
};

// Analyze Feedback component
const AnalyzeFeedback = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold">Analyze Feedback</h2>
      <p className="mt-2">View and analyze customer feedback</p>
    </div>
  );
};

const Dashboardpage = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/products" element={<Products />} />
        <Route path="/analyze" element={<AnalyzeFeedback />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboardpage;