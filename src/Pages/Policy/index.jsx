import React from "react";
import { Link } from "react-router-dom";
import { AuthShell } from "../../Component/UI";

const sections = [
  {
    title: "1. Introduction",
    body: [
      "Yuvadarpan (“we”, “our”, or “us”) provides a digital platform for community youth introduction. This Policy explains how we collect, use, store, and protect information when you use our website and application.",
      "By accessing or using Yuvadarpan, you agree to this Policy. If you do not agree, please do not use the platform.",
    ],
  },
  {
    title: "2. Information we collect",
    body: [
      "Account details such as name, email address, mobile number, and login credentials.",
      "Profile information you choose to share, including personal, family, education, occupation, and location details relevant to community introductions.",
      "Photos and documents you upload for your profile or verification.",
      "We do not collect or store device type, browser details, or IP addresses as part of your account or profile data.",
    ],
  },
  {
    title: "3. How we use your information",
    body: [
      "To create and manage your account, and to verify eligible users where required.",
      "To display profiles and enable community introduction features as intended by the platform.",
      "To communicate important updates, account notices, and support responses.",
      "To protect accounts and prevent misuse. For example, your IP address may be checked temporarily during password-reset or OTP requests for rate limiting, and is not saved to your account.",
    ],
  },
  {
    title: "4. Sharing of information",
    body: [
      "Profile information you provide may be visible to authorized users of the platform according to your account status and community access rules.",
      "We do not sell your personal information.",
      "We may disclose information if required by law or to protect the rights, safety, and integrity of users and the platform.",
    ],
  },
  {
    title: "5. Data security",
    body: [
      "We take reasonable technical and organizational measures to protect your information against unauthorized access, loss, or misuse.",
      "No method of transmission or storage is completely secure. You are responsible for keeping your login credentials confidential.",
    ],
  },
  {
    title: "6. Your choices and responsibilities",
    body: [
      "You are responsible for the accuracy of the information you submit.",
      "You should only share information you are comfortable making available to authorized users of the community platform.",
      "You may request updates or corrections to your account information through the available profile or support channels.",
      "Misuse of the platform, including false information, harassment, or unauthorized access, may result in account suspension or removal.",
    ],
  },
  {
    title: "7. Local storage and session",
    body: [
      "We use local browser storage to keep you signed in (for example, your authentication token) and to remember basic preferences needed for the app to work.",
      "We do not use third-party analytics cookies to track your browsing across other sites.",
    ],
  },
  {
    title: "8. Retention",
    body: [
      "We retain your information for as long as your account remains active or as needed to provide the service, meet legal obligations, resolve disputes, and enforce our policies.",
    ],
  },
  {
    title: "9. Changes to this Policy",
    body: [
      "We may update this Policy from time to time. The revised version will be posted on this page with an updated effective date. Continued use of Yuvadarpan after changes means you accept the updated Policy.",
    ],
  },
  {
    title: "10. Contact",
    body: [
      "If you have questions about this Policy or your data, please email support@yuvadarpan.in or visit the Contact Us page.",
    ],
  },
];

const Policy = () => {
  return (
    <AuthShell showBrand maxWidthClass="sm:max-w-[720px]">
      <div className="space-y-5">
        <div className="text-center border-b border-black/5 pb-4">
          <h1 className="text-xl sm:text-2xl font-semibold text-primary">
            Privacy &amp; Policy
          </h1>
          <p className="mt-2 text-sm text-mutedText">
            Last updated: {new Date().toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="space-y-6 max-h-[65vh] overflow-y-auto pr-1">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-base font-semibold text-primary mb-2">
                {section.title}
              </h2>
              <ul className="space-y-2">
                {section.body.map((paragraph) => (
                  <li
                    key={paragraph}
                    className="text-sm leading-relaxed text-mutedText list-none"
                  >
                    {paragraph}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="pt-2 text-center">
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

export default Policy;
