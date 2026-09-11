import { Container } from "@mui/material";

const ContainerPage = ({ children, className = "" }) => {
  return (
    <Container className={`max-w-[1600px] py-5 ${className}`}>
      {children}
    </Container>
  );
};
export default ContainerPage;
