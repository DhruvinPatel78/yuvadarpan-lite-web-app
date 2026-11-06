import { Container } from "@mui/material";

const ContainerPage = ({ children, className = "" }) => {
  return (
    <Container maxWidth={false} className={`min-w-0 w-full py-3 md:py-5 ${className}`}>
      {children}
    </Container>
  );
};
export default ContainerPage;
