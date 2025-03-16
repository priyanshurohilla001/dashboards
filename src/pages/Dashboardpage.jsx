import { useAuth } from "@/context/AuthContext";
import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout.jsx";
import { Button } from "@/components/ui/button.jsx";
import SingleProduct from "./SingleProduct.jsx";

// Dashboard home component
const DashboardHome = () => {
  const { user } = useAuth();
  return (
    <div>
      <h2 className="text-2xl font-semibold">Hello {user?.name || "Doctor"}</h2>
      <p className="mt-2">Welcome to your dashboard</p>
      <Button>
        hello
      </Button>
    </div>
  );
};

// Appointments component
const Appointments = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold">Your Appointments</h2>
      <p className="mt-2">Manage your appointments here</p>
      {/* Appointment-specific content goes here */}
    </div>
  );
};

const Dashboardpage = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/product/:id" element={<SingleProduct />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboardpage;