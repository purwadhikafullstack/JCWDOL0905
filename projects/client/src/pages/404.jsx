import NotFoundImg from "../assets/images/page_not_found.svg";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const Navigate = useNavigate();

  return (
    <div>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="">
          <img
            src={NotFoundImg}
            alt="Page Not Found"
            style={{ height: "250px" }}
          />
        </div>
        <div className="mt-10 mb-5">
          <div className="font-medium self-center text-3xl text-center text-black">
            Page Not Found
          </div>
        </div>
        <div className="mt-20">
          <div className="font-medium self-center text-2xl text-center text-black">
            You seem lost
          </div>
        </div>
        <div className="flex w-1/6 mt-3 mb-5">
          <button
            type="submit"
            onClick={() => Navigate("/")}
            className="flex mt-2 p-2 items-center justify-center focus:outline-none text-white text-sm uppercase sm:text-base bg-green-500 hover:bg-green-600 rounded-2xl w-full transition duration-150 ease-in"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
