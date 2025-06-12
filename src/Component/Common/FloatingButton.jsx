import { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";

const FloatingButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const showVisible = () => {
    if (window.scrollY > 200) {
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
    <div className={"fixed bottom-5 right-5 z-50"}>
      <IconButton className={"bg-primary text-white"} onClick={scrollToTop}>
        <ArrowUpwardOutlinedIcon />
      </IconButton>
    </div>
  ) : null;
};
export default FloatingButton;
