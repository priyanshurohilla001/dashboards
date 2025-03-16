import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

const OtpVerification = () => {
  const [loading, setLoading] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [formData, setFormData] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    // Get form data from sessionStorage
    const storedData = sessionStorage.getItem('signupFormData');
    if (!storedData) {
      // If no form data exists, redirect back to signup form
      toast.error("Please complete the signup form first");
      navigate("/signup");
      return;
    }
    setFormData(JSON.parse(storedData));
  }, [navigate]);

  const handleVerifySubmit = async () => {
    if (otpValue.length !== 6) {
      toast.error("Please enter a valid verification code");
      return;
    }

    try {
      setLoading(true);
      const serverUrl = import.meta.env.VITE_SERVER_URL;
      
      // In a real application, send the complete registration request with OTP
      const res = await axios.post(`${serverUrl}/api/doctor/register`, {
        ...formData,
        otp: otpValue
      });
      
      // Clear stored form data
      sessionStorage.removeItem('signupFormData');
      
      toast.success("Account created successfully!");
      login(res.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = () => {
    // In a real application, send API request to resend OTP
    toast.success("New verification code sent");
  };

  if (!formData) {
    return null; // Don't render until data is loaded or redirect happens
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Verify your email</CardTitle>
        <CardDescription>
          We've sent a verification code to {formData.email}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-6">
          <div>
            <Label htmlFor="otp-input">Verification Code</Label>
            <div className="mt-2 flex justify-center">
              <InputOTP
                id="otp-input"
                maxLength={6}
                value={otpValue}
                onChange={setOtpValue}
                pattern={REGEXP_ONLY_DIGITS}
              >
                <InputOTPGroup>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <InputOTPSlot key={index} index={index} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
          <Button 
            onClick={handleVerifySubmit} 
            className="w-full" 
            disabled={loading || otpValue.length !== 6}
          >
            {loading ? "Verifying..." : "Create Account"}
          </Button>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Didn't receive the code?{" "}
              <button 
                onClick={resendOtp}
                className="text-sm font-medium underline-offset-4 hover:underline"
                type="button"
              >
                Resend
              </button>
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button 
          variant="ghost" 
          className="text-sm"
          onClick={() => navigate("/signup")}
        >
          Back to sign up
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OtpVerification;
