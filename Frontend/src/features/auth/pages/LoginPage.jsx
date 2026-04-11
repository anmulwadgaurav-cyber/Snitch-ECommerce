import React from "react";
import LoginForm from "../components/LoginForm";
import modelImage from "../../../assets/snitch-model-2.png";

const LoginPage = () => {
  return (
    <div className="h-screen relative flex items-center justify-start overflow-hidden bg-brand-bg px-4 sm:px-12 lg:px-24">
      {/* Full Bleed Image Background */}
      <div
        className="absolute h-full top-1/2 -translate-y-1/2 inset-0 bg-cover bg-center lg:bg-position-[80%_center] bg-no-repeat opacity-90 transition-all duration-1000"
        style={{ backgroundImage: `url(${modelImage})` }}
      />

      {/* Seamless Fade Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-brand-bg via-brand-bg/80 to-transparent mix-blend-normal" />

      {/* Mobile darkening overlay for readability if needed */}
      <div className="absolute inset-0 bg-brand-bg/70 lg:hidden" />

      {/* Huge Floating Watermark inside the scene */}
      <h1 className="absolute lg:-right-4 top-1/2 -translate-y-1/2 z-0 text-[10rem] md:text-[14rem] xl:text-[20rem] font-black text-brand-primary/20 uppercase tracking-tighter leading-none whitespace-nowrap select-none pointer-events-none ">
        Snitch
      </h1>

      {/* Left Aligned Floating Form */}
      <div className="relative z-10 w-full max-w-lg py-12 mx-auto lg:mx-0">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;