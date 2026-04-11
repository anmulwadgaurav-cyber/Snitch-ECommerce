import React from 'react'
import RegisterForm from '../components/RegisterForm'

const RegisterPage = () => {
  return (
    <div className="h-screen bg-brand-bg flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side: Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10 bg-white lg:bg-transparent shadow-2xl lg:shadow-none">
        <div className="w-full max-w-md">
          <RegisterForm />
        </div>
      </div>

      {/* Right Side: Huge Faded Logo */}
      <div className="hidden lg:flex w-full lg:w-1/3 items-center justify-center relative select-none pointer-events-none">
        <h1 className="absolute text-[12rem] xl:text-[20rem] font-black text-brand-primary/5 uppercase tracking-tighter leading-none whitespace-nowrap">
          Snitch
        </h1>
      </div>
    </div>
  )
}

export default RegisterPage

