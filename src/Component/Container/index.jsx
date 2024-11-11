import { Container } from "@mui/material";

const ContainerPage = ({ children, className }) => {
  return (
    <Container className={`max-w-[1600px] ${className}`}>{children}</Container>
  );
};
export default ContainerPage;
