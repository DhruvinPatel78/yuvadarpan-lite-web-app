const APP_MESSAGES = {
  "no-token": "Please sign in.",
  unauthenticated: "Please sign in.",
  "token-expired": "Session expired. Sign in again.",
  "not-allowed": "You cannot do this.",
  "User not found": "User not found.",
  "password-required": "Password is required.",
  "failed-to-create-user": "Could not create user.",
  "Email-and-Mobile-is-already-exist": "Email and mobile already exist.",
  "Email-is-already-exist": "Email already exists.",
  "Mobile-is-already-exist": "Mobile already exists.",
  "email-invalid": "Email not found.",
  "otp-sent-successfully": "OTP sent.",
  "otp-email-failed": "Could not send OTP.",
  "otp-expired": "OTP expired.",
  "otp-verify-successfully": "OTP verified.",
  "invalid-otp": "Invalid OTP.",
  "otp-not-verified": "Verify OTP first.",
  "your-account-is-not-verified": "Account is not approved yet.",
  "password-or-email-incorrect": "Email or password is incorrect.",
  "password-update-successfully": "Password updated.",
  "Updated Successfully": "Updated.",
  "Update Successfully": "Updated.",
  "Delete Successfully": "Deleted.",
  "yuva-id-required": "Select a profile first.",
  "yuva-not-found": "Profile not found.",
  "failed-to-shortlist": "Could not shortlist.",
  shortlisted: "Shortlisted.",
  removed: "Removed.",
  "failed-to-fetch": "Could not load data.",
  "only-admin-can-create-yuva": "Only admin can add this.",
  "failed-to-upload": "Could not upload image.",
  "image-upload-successfully": "Image uploaded.",
  "samaj-not-assigned": "Samaj is not assigned.",
  "city-not-assigned": "City is not assigned.",
  "district-not-assigned": "District is not assigned.",
  "region-not-assigned": "Region is not assigned.",
  "state-not-assigned": "State is not assigned.",
  "country-not-assigned": "Country is not assigned.",
  "Success !": "Done.",
  "Login Success": "Signed in.",
  "OTP Send Successfully": "OTP sent.",
  "OTP Verify Successfully": "OTP verified.",
  "OTP sent to your registered email": "OTP sent to your email.",
  "OTP verified successfully": "OTP verified.",
  "Password updated successfully": "Password updated.",
  "Password not match": "Passwords do not match.",
  "confirm password not matched !": "Passwords do not match.",
  "Failed to save user.": "Could not save user.",
  "Failed to update user.": "Could not update user.",
  "Failed to update users.": "Could not update users.",
  "Registration failed.": "Could not register.",
  "Login failed.": "Could not sign in.",
  "Failed to send OTP.": "Could not send OTP.",
  "Failed to resend OTP.": "Could not send OTP.",
  "OTP verification failed.": "Could not verify OTP.",
  "Password change failed.": "Could not change password.",
  "Password update failed.": "Could not update password.",
  "Profile update failed.": "Could not update profile.",
  "Something went wrong !": "Something went wrong.",
  "Must be a valid email or phone number": "Enter a valid email or mobile.",
  "Must be a number": "Enter a number.",
  "Passwords must match": "Passwords do not match.",
  "Password updated.": "Password updated.",
  "Could not send OTP.": "Could not send OTP.",
  "Email not found.": "Email not found.",
  "Invalid OTP.": "Invalid OTP.",
  "OTP expired.": "OTP expired.",
  "Account is not approved yet.": "Account is not approved yet.",
  "Email or password is incorrect.": "Email or password is incorrect.",
  "You cannot do this.": "You cannot do this.",
  "Please sign in.": "Please sign in.",
  "Session expired. Sign in again.": "Session expired. Sign in again.",
  "Email already exists.": "Email already exists.",
  "Mobile already exists.": "Mobile already exists.",
  "Email and mobile already exist.": "Email and mobile already exist.",
  "Verify OTP first.": "Verify OTP first.",
  "OTP sent.": "OTP sent.",
  "OTP verified.": "OTP verified.",
  "Updated.": "Updated.",
  "Deleted.": "Deleted.",
  "User not found.": "User not found.",
  "Password is required.": "Password is required.",
  "Could not create user.": "Could not create user.",
  "Signed in.": "Signed in.",
  "Registration received.": "Registration received.",
  "Passwords do not match.": "Passwords do not match.",
  "Link copied.": "Link copied.",
  "Could not copy link.": "Could not copy link.",
  "Enter a valid email or mobile.": "Enter a valid email or mobile.",
};

const humanizeKey = (value) => {
  const text = String(value || "").replace(/[_-]+/g, " ").trim();
  if (!text) return "";
  return `${text.charAt(0).toUpperCase()}${text.slice(1)}.`;
};

export const formatAppMessage = (message, fallback = "Something went wrong.") => {
  if (message == null || message === "") {
    return fallback;
  }
  const raw = String(message).trim();
  if (APP_MESSAGES[raw]) {
    return APP_MESSAGES[raw];
  }
  const lower = raw.toLowerCase();
  const matched = Object.keys(APP_MESSAGES).find(
    (key) => key.toLowerCase() === lower
  );
  if (matched) {
    return APP_MESSAGES[matched];
  }
  if (/^[a-z0-9]+([-_][a-z0-9]+)+$/i.test(raw) && !raw.includes(" ")) {
    return humanizeKey(raw);
  }
  return raw;
};
