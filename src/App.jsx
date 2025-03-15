import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Loginpage from "./pages/Loginpage";
import Signuppage from "./pages/Signuppage";
import Dashboardpage from "./pages/Dashboardpage";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";
import { Toaster } from "sonner";

const HeaderBasic = ({ children }) => (
  <div>
    <Header />
    {children}
  </div>
);

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
          path="/signup"
          element={
            <HeaderBasic>
              <Signuppage />
            </HeaderBasic>
          }
        />
        <Route
          path="/dashboard"
          element={
            <HeaderBasic>
              <Dashboardpage />
            </HeaderBasic>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}
