import React, { useState } from "react";
import {
  RiUserLine,
  RiMailLine,
  RiLockPasswordLine,
  RiPhoneLine,
} from "@remixicon/react";
import InputField from "../../../components/ui/InputField";
import CheckboxField from "../../../components/ui/CheckboxField";
import Button from "../../../components/ui/Button";
import { useAuth } from "../hook/useAuth.js";
import { useNavigate, Link } from "react-router";

const RegisterForm = () => {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    contactNumber: "",
    password: "",
    isSeller: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Registration Data:", formData);
    await handleRegister({
      email: formData.email,
      fullname: formData.fullname,
      contact: formData.contactNumber,
      password: formData.password,
      isSeller: formData.isSeller,
    });
    navigate("/");
  };

  return (
    <div className="w-full max-w-lg bg-white/40 sm:bg-white/30 backdrop-blur-2xl p-8 sm:p-8 shadow-2xl shadow-brand-primary/10 border border-white/50 mx-auto">
      <div className="mb-8 text-left">
        <h2 className="text-3xl font-extrabold text-brand-primary tracking-tight mb-2 uppercase">
          Create Account
        </h2>
        <p className="text-sm font-medium text-brand-secondary/80">
          Join the ultimate shopping platform for clothes
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <InputField
          label="Full Name"
          id="fullname"
          name="fullname"
          placeholder="John Doe"
          icon={RiUserLine}
          value={formData.fullname}
          onChange={handleChange}
          required
        />

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

        <InputField
          label="Contact Number"
          id="contactNumber"
          name="contactNumber"
          type="tel"
          placeholder="+91 99999-99999"
          icon={RiPhoneLine}
          value={formData.contactNumber}
          onChange={handleChange}
          required
        />

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

        <div className="mt-4">
          <CheckboxField
            id="isSeller"
            name="isSeller"
            label="Register as a Seller"
            description="I want to create a seller account to list My products."
            checked={formData.isSeller}
            onChange={handleChange}
          />
        </div>

        <div className="mt-6">
          <Button type="submit" fullWidth>
            Sign Up Now
          </Button>
        </div>

        <p className="mt-6 text-center text-sm font-medium text-brand-secondary/80">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-brand-primary font-bold hover:underline underline-offset-4 transition-all"
          >
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
