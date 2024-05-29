import {ButtonBase, styled, TextField} from "@mui/material";

export const ImageButton = styled(ButtonBase)(({ theme }) => ({
    position: "relative",
    height: 110,
    borderRadius: "150px",
    "&:hover, &.Mui-focusVisible": {
        zIndex: 1,
        "& .MuiImageBackdrop-root": {
            opacity: 0.4,
        },
        "& .MuiImageMarked-root": {
            opacity: 1,
        },
        "& .MuiTypography-root": {
            border: "4px solid currentColor",
        },
    },
}));
export const ImageSrc = styled("span")({
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: "cover",
    backgroundPosition: "center 40%",
    borderRadius: "150px",
});
export const ImageBackdrop = styled("span")(({ theme }) => ({
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#0000006e",
    opacity: 0.15,
    transition: theme.transitions.create("opacity"),
    borderRadius: "150px",
}));