import React, { useState } from "react";
import { RiMailLine, RiLockPasswordLine, RiGoogleFill } from "@remixicon/react";
import InputField from "../../../components/ui/InputField";
import Button from "../../../components/ui/Button";
import { useAuth } from "../hook/useAuth.js";
import { useNavigate, Link } from "react-router";

const LoginForm = () => {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await handleLogin({
      email: formData.email,
      password: formData.password,
    });
    if (user == "buyer") {
      navigate("/");
    } else if (user == "seller") {
      navigate("/seller/dashboard");
    }
  };

  return (
    <div className="w-full max-w-lg bg-white/40 sm:bg-white/30 backdrop-blur-2xl p-8 sm:p-8 shadow-2xl shadow-brand-primary/10 border border-white/50 mx-auto">
      <div className="mb-8 text-left">
        <h2 className="text-3xl font-extrabold text-brand-primary tracking-tight mb-2 uppercase">
          Welcome Back
        </h2>
        <p className="text-sm font-medium text-brand-secondary/80">
          Sign in to your account to continue shopping
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-1">
        <InputField
          label="Email Address"
          id="email"
          name="email"
          type="email"
          placeholder="johndoe@example.com"
          icon={RiMailLine}
          value={formData.email}
          onChange={handleChange}
          required
        />

        <div className="flex flex-col">
          <InputField
            label="Password"
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            icon={RiLockPasswordLine}
            value={formData.password}
            onChange={handleChange}
            required
          />
          <div className="flex justify-end mt-1">
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-brand-primary hover:underline tracking-wide transition-all"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <div className="mt-6">
          <Button type="submit" fullWidth>
            Sign In
          </Button>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="w-1/4 border-b border-brand-secondary/30"></span>
          <span className="text-xs text-center text-brand-secondary/80 font-bold uppercase tracking-widest">
            or
          </span>
          <span className="w-1/4 border-b border-brand-secondary/30"></span>
        </div>

        <div className="mt-2">
          <a
            href="/api/auth/google"
            className="w-full inline-flex justify-center items-center gap-2 px-6 py-3 border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white text-sm font-bold uppercase transition-all duration-300 focus:outline-none active:scale-[0.98]"
          >
            <RiGoogleFill className="w-5 h-5" />
            Continue with Google
          </a>
        </div>

        <p className="mt-2 text-center text-sm font-medium text-brand-secondary/80">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-brand-primary font-bold hover:underline underline-offset-4 transition-all"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
