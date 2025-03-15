import { useAuth } from "@/context/AuthContext";
import React from "react";

const Dashboardpage = () => {
  const { user, loading } = useAuth();

  return (
    <div>
      <h2 className="text-2xl font-semibold">Hello {user.name}</h2>
    </div>
  );
};

export default Dashboardpage;
