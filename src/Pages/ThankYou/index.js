import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthShell, Button } from "../../Component/UI";

const ThankYou = () => {
  const navigate = useNavigate();

  return (
    <AuthShell showBrand>
      <p className="text-center text-primary text-base sm:text-lg font-semibold leading-relaxed">
        Thank you for your interest. Your account will be live after
        verification.
      </p>
      <Button
        type="button"
        fullWidth
        className="mt-6"
        onClick={() => navigate("/login")}
      >
        Back to login
      </Button>
    </AuthShell>
  );
};

export default ThankYou;
