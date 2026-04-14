import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center flex-col justify-center lg:flex-row p-4 gap-16 lg:gap-28 h-screen">
      <div className="flex flex-col justify-center align-center">
        <img
          className="hidden lg:block"
          src="https://i.ibb.co/v30JLYr/Group-192-2.png"
          alt=""
        />
        <img
          className="hidden md:block lg:hidden"
          src="https://i.ibb.co/c1ggfn2/Group-193.png"
          alt=""
        />
        <img
          className="md:hidden"
          src="https://i.ibb.co/8gTVH2Y/Group-198.png"
          alt=""
        />
        <button
          className="w-full lg:w-auto my-4 border rounded-md px-1 sm:px-16 py-5 bg-primary text-white font-bold"
          onClick={() => navigate("/")}
        >
          Go back to Homepage
        </button>
      </div>
    </div>
  );
};
export default NotFound;
