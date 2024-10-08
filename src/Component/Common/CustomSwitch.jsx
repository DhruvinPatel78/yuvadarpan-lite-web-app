import { alpha, styled, Switch } from "@mui/material";

const CustomSwitch = ({ ...rest }) => {
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
  return <PrimarySwitch {...rest} />;
};
export default CustomSwitch;
