import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const Header = () => {

  const {token , login , logout , isAuthenticated} = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex w-full justify-between p-4 bg-gray-50 shadow">
      <a onClick={() => navigate("/")}>
        <h3 className="text-2xl font-bold">Doc</h3>
      </a>
      {isAuthenticated ? (
        <div>
          <Button
            variant="destructive"
            onClick={logout}
          >
            Logout
          </Button>
          <Button
            className="ml-2"
            onClick={() => {
              navigate("/dashboard");
            }}
          >
            Dashboard
          </Button>
        </div>
      ) : (
        <div>
          <Button
            onClick={() => {
              navigate("/signup");
            }}
          >
            Signup
          </Button>
          <Button
            variant="secondary"
            className="ml-2"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </Button>
        </div>
      )}
    </div>
  );
};

export default Header;
