import { AuthShell } from "../../Component/UI";

const Status = () => {
  return (
    <AuthShell showBrand={false}>
      <div className="text-center">
        <h1 className="text-xl font-semibold text-primary">Status</h1>
        <p className="text-sm text-mutedText mt-2">
          There is no status information to show right now.
        </p>
      </div>
    </AuthShell>
  );
};

export default Status;
