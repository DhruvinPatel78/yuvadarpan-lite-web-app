import React from "react";
import { AuthShell } from "../../Component/UI";

const ThankYou = () => {
  return (
    <AuthShell showBrand>
      <p className="text-center text-primary text-base sm:text-lg font-semibold leading-relaxed">
        Thank you for your interest. Your account will be live after
        verification.
      </p>
    </AuthShell>
  );
};

export default ThankYou;
