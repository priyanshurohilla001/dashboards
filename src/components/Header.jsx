import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [istoken, setIstoken] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIstoken(true);
    }
  }, [istoken]);

  const navigate = useNavigate();
  return (
    <div className="flex w-full justify-between p-4 bg-gray-50 shadow">
      <button onClick={() => navigate("/")}>
        <h3 className="text-2xl font-bold">Doc</h3>
      </button>
      {istoken ? (
        <div>
          <Button
            variant="destructive"
            onClick={() => {
              localStorage.removeItem("token");
              setIstoken(false);
            }}
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
