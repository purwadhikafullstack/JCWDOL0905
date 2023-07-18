import { useNavigate } from "react-router-dom";
import logo_groceria from "../../assets/images/warning_token.svg"

const TokenInvalidAdmin = () => {
  const Navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <button onClick={() => Navigate("/")}><img src={logo_groceria} alt="groceria" style={{ height: "200px" }} /></button>
      <div className="flex flex-col bg-white shadow-md mt-8 px-4 sm:px-6 md:px-8 lg:px-10 py-5 rounded-3xl w-2/3 sm:w-3/4 md:w-2/3 lg:w-1/2 max-w-md">
        <div className="mt-5">
          <div className="font-medium text-center text-xl text-[#C52222]">Invalid token, please login again</div>
        </div>
        <div className="mb-5">
          <div className="flex w-full mt-10">
            <button
              type="submit"
              onClick={() => Navigate("/login-admin")}
              className="flex mt-2 items-center justify-center focus:outline-none text-white text-sm uppercase sm:text-base bg-[#C52222] hover:bg-[#9C1C1C] rounded-2xl py-2 w-full transition duration-150 ease-in"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenInvalidAdmin;
