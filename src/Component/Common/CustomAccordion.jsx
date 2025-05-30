import React from "react";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const CustomAccordion = ({
  ExpandIcon = ExpandMoreIcon,
  headerTitle = "Filter & Search",
  children,
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const handleExpansion = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };
  return (
    <Accordion
      className={"w-full rounded"}
      expanded={expanded}
      onChange={handleExpansion}
    >
      <AccordionSummary
        expandIcon={<ExpandIcon className={"text-primary"} />}
        aria-controls="panel1-content"
        id="panel1-header"
        className={`bg-white font-extrabold text-[18px] text-primary rounded-t border-primary ${expanded ? "rounded-t" : "rounded"}`}
        sx={{ border: "2px solid" }}
      >
        {headerTitle}
      </AccordionSummary>
      <AccordionDetails className={"p-4"}>{children}</AccordionDetails>
    </Accordion>
  );
};
export default CustomAccordion;
