import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Signuppage = () => {
  const [step, setStep] = useState(1); // 1: Sign up form, 2: OTP verification
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(null);
  const [otpValue, setOtpValue] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSignupSubmit = (values) => {
    // Store form data locally and move to OTP step
    setFormData(values);
    setStep(2);
    
    // In a real application, you would send an API request to send OTP
    toast.success("Verification code sent to your email");
  };

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {step === 1 ? (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>
              Enter your details below to create your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form 
                onSubmit={form.handleSubmit(handleSignupSubmit)} 
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="m@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full mt-6">
                  Continue
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-sm text-center">
              Already have an account?{" "}
              <a href="/login" className="text-sm underline-offset-4 hover:underline">
                Login
              </a>
            </p>
          </CardFooter>
        </Card>
      ) : (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Verify your email</CardTitle>
            <CardDescription>
              We've sent a verification code to {formData?.email}
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
              onClick={() => setStep(1)}
            >
              Back to sign up
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default Signuppage;