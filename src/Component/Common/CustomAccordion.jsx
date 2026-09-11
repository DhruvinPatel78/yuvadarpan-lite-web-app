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
      className="w-full !shadow-none"
      expanded={expanded}
      onChange={handleExpansion}
    >
      <AccordionSummary
        expandIcon={<ExpandIcon className="text-primary" />}
        aria-controls="panel1-content"
        id="panel1-header"
        className="bg-white font-semibold text-sm sm:text-base text-primary rounded-t-xl min-h-[48px]"
      >
        {headerTitle}
      </AccordionSummary>
      <AccordionDetails className="p-4 sm:p-5 border-t border-line">
        {children}
      </AccordionDetails>
    </Accordion>
  );
};
export default CustomAccordion;
