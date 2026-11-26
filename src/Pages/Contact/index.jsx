import React from "react";
import { Link } from "react-router-dom";
import { AuthShell } from "../../Component/UI";

const SUPPORT_EMAIL = "support@yuvadarpan.in";

const Contact = () => {
  return (
    <AuthShell showBrand maxWidthClass="sm:max-w-[520px]">
      <div className="space-y-5 text-center">
        <div className="border-b border-black/5 pb-4">
          <h1 className="text-xl sm:text-2xl font-semibold text-primary">
            Contact Us
          </h1>
          <p className="mt-2 text-sm text-mutedText leading-relaxed">
            Need help with your account, profile, or the Yuvadarpan platform?
            Reach out to our support team.
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-mutedText font-semibold">
            Support email
          </p>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="inline-block text-base sm:text-lg font-semibold text-primary underline-offset-4 hover:underline break-all"
          >
            {SUPPORT_EMAIL}
          </a>
          <p className="text-sm text-mutedText leading-relaxed pt-1">
            We typically respond as soon as possible during support hours.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/"
            className="text-sm font-medium text-primary underline-offset-2 hover:underline"
          >
            Back to home
          </Link>
        </div>
      </div>
    </AuthShell>
  );
};

export default Contact;
