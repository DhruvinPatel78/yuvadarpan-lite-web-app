import React from "react";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const CustomAccordion = ({
  ExpandIcon = ExpandMoreIcon,
  headerTitle = "Filters",
  children,
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const handleExpansion = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };
  return (
    <Accordion
      disableGutters
      className="w-full !shadow-none border border-solid border-line !rounded-xl overflow-visible"
      expanded={expanded}
      onChange={handleExpansion}
      sx={{
        border: "1px solid #e4ddd4",
        borderRadius: "12px !important",
        boxShadow: "none",
        overflow: "visible",
        "&:before": { display: "none" },
        "&.Mui-expanded": {
          margin: 0,
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandIcon className="text-primary" />}
        aria-controls="panel1-content"
        id="panel1-header"
        className="bg-white font-semibold text-sm sm:text-base text-primary min-h-[48px] !px-3 sm:!px-4"
      >
        {headerTitle}
      </AccordionSummary>
      <AccordionDetails className="p-3 sm:p-5 border-t border-line">
        {children}
      </AccordionDetails>
    </Accordion>
  );
};
export default CustomAccordion;
