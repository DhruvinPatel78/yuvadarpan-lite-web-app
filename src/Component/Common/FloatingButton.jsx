import { useEffect, useState } from "react";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import { IconBtn } from "../UI";

const FloatingButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const showVisible = () => {
    if (window.scrollY > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", showVisible);
    return () => window.removeEventListener("scroll", showVisible);
  }, []);

  return isVisible ? (
    <div className={"fixed bottom-5 right-5 z-50 mb-[env(safe-area-inset-bottom)] mr-[env(safe-area-inset-right)]"}>
      <IconBtn
        aria-label="Scroll to top"
        onClick={scrollToTop}
        className="!bg-primary !text-white hover:!bg-primary hover:!opacity-90 !border-primary"
      >
        <ArrowUpwardOutlinedIcon fontSize="small" />
      </IconBtn>
    </div>
  ) : null;
};
export default FloatingButton;
