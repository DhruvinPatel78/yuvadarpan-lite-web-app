import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";

const OTPInput = forwardRef(({ length = 6, onComplete }, ref) => {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current = Array(length)
      .fill(null)
      .map(() => React.createRef());
  }, [length]);

  const handleInputChange = (index, value) => {
    if (!/^[0-9]*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);
    setTimeout(() => {
      if (value && index < length - 1) {
        inputRefs.current[index + 1]?.current?.focus();
      }
      if (newOtp.every(Boolean)) {
        if (onComplete) {
          onComplete(newOtp.join(""));
        }
      }
    }, 0);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.current?.focus();
    }
  };

  useImperativeHandle(ref, () => ({
    resetOtp: () => {
      setOtp(Array(length).fill(""));
      inputRefs.current[0]?.current?.focus();
    },
  }));

  return (
    <div className="flex gap-1.5 sm:gap-2 w-full justify-center max-w-full">
      {otp.map((digit, index) => (
        <input
          key={index}
          id={`otp-input-${index}`}
          type="text"
          maxLength="1"
          value={digit}
          onChange={(e) => handleInputChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          aria-label={`Digit ${index + 1} of ${length}`}
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          className="flex-1 min-w-0 max-w-[48px] h-11 sm:w-11 sm:h-11 sm:flex-none border border-line-strong bg-white rounded-lg text-center text-base font-semibold text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          ref={inputRefs.current[index]}
        />
      ))}
    </div>
  );
});

export default OTPInput;
