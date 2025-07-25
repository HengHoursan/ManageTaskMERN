import { useState } from "react"; // Import useState
import { useForm } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/AuthAction.js";
import { toast } from "sonner";
import Loader from '../layouts/Loader.tsx'

type FormData = {
  email: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();
  const form = useForm<FormData>();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const LoginUser = async (data: FormData) => {
    try {
      setIsLoading(true);
      const response = await loginUser(data);
      console.log("Login successful:", response.user);

      const token = response?.user?.token;
      const userData = response?.user;
      console.log(token);
      if (token && userData) {
        localStorage.setItem("token", token);
        localStorage.setItem("userData", JSON.stringify(userData));
      }
      else {
        console.log("No token Found");
      }
      await new Promise(resolve => setTimeout(resolve, 3000));

      toast.success("Login successful!", {
        description: "You have been successfully logged in.",
        duration: 4000,
      });

      navigate("/home");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed.", {
        description: "Please check your email and password and try again.",
      });
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 min-h-screen">
      <Card className="w-full max-w-sm ">
        <CardHeader>
          <CardTitle className="text-[25px] text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(LoginUser)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
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
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="showPassword"
                  checked={showPassword}
                  onCheckedChange={(checked: any) =>
                    setShowPassword(Boolean(checked))
                  }
                />
                <Label htmlFor="showPassword">Show Password</Label>
              </div>

              <Button className="w-full" type="submit">
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <span
              className="text-blue-600 hover:underline cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Register now
            </span>
          </div>
        </CardFooter>
      </Card>
      {isLoading && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
            <Loader />
          </div>
      )}
    </div>
  );
};

export default Login;
