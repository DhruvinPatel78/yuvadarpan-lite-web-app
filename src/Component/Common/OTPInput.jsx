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
    <div className="flex space-x-2 w-full justify-center">
      {otp.map((digit, index) => (
        <input
          key={index}
          id={`otp-input-${index}`}
          type="text"
          maxLength="1"
          value={digit}
          onChange={(e) => handleInputChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="w-12 h-12 border border-gray-300 bg-[#f6f7ff] rounded text-center focus:outline-none focus:border-2 focus:border-primary"
          ref={inputRefs.current[index]}
        />
      ))}
    </div>
  );
});

export default OTPInput;
