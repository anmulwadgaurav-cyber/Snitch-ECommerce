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

const RegisterForm = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registration Data:", formData);
    // Handle registration logic here
  };

  return (
    <div className="w-full max-w-md bg-white p-10 shadow-xl shadow-brand-secondary/10 border border-brand-secondary/10">
      <div className="mb-10 text-left">
        <h2 className="text-3xl font-bold text-brand-primary tracking-tight mb-2">
          Create Account
        </h2>
        <p className="text-sm text-brand-secondary">
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
      </form>
    </div>
  );
};

export default RegisterForm;
