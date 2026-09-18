import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

const OTPInput = forwardRef(({ length = 6, onComplete, onChange }, ref) => {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputRefs = useRef([]);

  const emit = (next) => {
    const value = next.join("");
    onChange?.(value);
    if (next.every(Boolean) && onComplete) {
      onComplete(value);
    }
  };

  const applyDigits = (startIndex, digits) => {
    const next = [...otp];
    digits.slice(0, length - startIndex).split("").forEach((digit, offset) => {
      next[startIndex + offset] = digit;
    });
    setOtp(next);
    const focusAt = Math.min(startIndex + digits.length, length - 1);
    inputRefs.current[focusAt]?.focus();
    emit(next);
  };

  const handleInputChange = (index, value) => {
    const digits = String(value).replace(/\D/g, "");
    if (!digits) {
      const next = [...otp];
      next[index] = "";
      setOtp(next);
      emit(next);
      return;
    }
    applyDigits(index, digits);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (index, e) => {
    const digits = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!digits) return;
    e.preventDefault();
    applyDigits(index, digits);
  };

  useImperativeHandle(ref, () => ({
    resetOtp: () => {
      const next = Array(length).fill("");
      setOtp(next);
      emit(next);
      inputRefs.current[0]?.focus();
    },
  }));

  return (
    <div className="flex justify-center gap-2 w-full">
      {otp.map((digit, index) => (
        <input
          key={index}
          id={`otp-input-${index}`}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={index === 0 ? length : 1}
          value={digit}
          onChange={(e) => handleInputChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={(e) => handlePaste(index, e)}
          aria-label={`Digit ${index + 1} of ${length}`}
          className="w-10 h-12 sm:w-11 sm:h-12 shrink-0 rounded-xl border border-line-strong bg-muted text-center text-lg font-semibold text-primary caret-primary transition-colors focus:outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20"
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
        />
      ))}
    </div>
  );
});

export default OTPInput;
