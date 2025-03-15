import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Loginpage from "./pages/Loginpage";
import Signuppage from "./pages/Signuppage";
import Dashboardpage from "./pages/Dashboardpage";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import { Toaster } from "sonner";
import { useAuth } from "./context/AuthContext";

export default function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <HeaderBasic>
              <Homepage />
            </HeaderBasic>
          }
        />
        <Route
          path="/login"
          element={
            <HeaderBasic>
              <Loginpage />
            </HeaderBasic>
          }
        />
        <Route
          path="/signup/*"
          element={
            <HeaderBasic>
              <Signuppage />
            </HeaderBasic>
          }
        />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboardpage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

const HeaderBasic = ({ children }) => (
  <div>
    <Header />
    {children}
  </div>
);
const ProtectedRoute = ({ children }) => {
  const { loading, isAuthenticated } = useAuth();


  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return children;
};
