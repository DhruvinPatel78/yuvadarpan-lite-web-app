import { useNavigate } from "react-router-dom";
import { AuthShell, Button } from "../../Component/UI";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <AuthShell showBrand={false} maxWidthClass="sm:max-w-[520px]">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-primary">Page not found</h1>
        <p className="text-sm text-mutedText mt-2 mb-5">
          The page you are looking for does not exist or has moved.
        </p>
        <Button onClick={() => navigate("/")} fullWidth>
          Go back to Homepage
        </Button>
      </div>
    </AuthShell>
  );
};
export default NotFound;
