import { alpha, styled, Switch } from "@mui/material";

const PrimarySwitch = styled(Switch)(({ theme }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "#542b2b",
    "&:hover": {
      backgroundColor: alpha("#542b2b", theme.palette.action.hoverOpacity),
    },
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#542b2b",
  },
}));

const CustomSwitch = ({ onClick, onChange, ...rest }) => {
  return (
    <PrimarySwitch
      {...rest}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.(event);
      }}
      onChange={(event, checked) => {
        event.stopPropagation();
        onChange?.(event, checked);
      }}
    />
  );
};

export default CustomSwitch;
