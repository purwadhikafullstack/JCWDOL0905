import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import toast, { Toaster } from "react-hot-toast";
import logo_groceria from "../../assets/images/logo-brand-groceria.png"

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorEmail, setErrorEmail] = useState();
  const Navigate = useNavigate();

  let validateEmail = (value) => {
    if (value === "") {
      setErrorEmail("Please input your email");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setErrorEmail("Invalid email format");
    } else {
      setErrorEmail("");
    }
    setEmail(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post("users/forgot-password", {email: email});
      toast.success(response.data.message);
      setTimeout(() => {Navigate('/resend-forgot-password')}, 1500);
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <button onClick={() => Navigate("/")}><img src={logo_groceria} alt="groceria" style={{ height: "75px" }} /></button>
      <div className="flex flex-col bg-white shadow-md mt-8 px-4 sm:px-6 md:px-8 lg:px-10 py-5 rounded-3xl w-2/3 sm:w-3/4 md:w-2/3 lg:w-1/2 max-w-md">
        <div className="font-medium self-center text-xl text-gray-800">Enter your email to reset password</div>
        <div className="mt-5">
          <form autoComplete="off">
            <div className="flex flex-col mb-3">
              <label className="mb-1 text-xs tracking-wide text-gray-600">Email:</label>
              <div className="relative">
                <input
                  onChange={(e) => validateEmail(e.target.value)}
                  type="email"
                  name="email"
                  className="text-sm placeholder-gray-500 pl-5 pr-4 rounded-2xl border border-gray-400 w-full py-2 focus:outline-none focus:border-green-400"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="text-red-700 text-xs font-semibold">{errorEmail ? errorEmail : null}</div>
            </div>
            <div className="flex w-full mt-10">
              <button
                type="submit"
                disabled={isLoading}
                onClick={handleSubmit}
                className="flex mt-2 items-center justify-center focus:outline-none text-white text-sm uppercase sm:text-base bg-green-500 hover:bg-green-600 rounded-2xl py-2 w-full transition duration-150 ease-in"
              >
                {isLoading ? "Loading..." : "Send Password Reset Link"}
              </button>
              <Toaster />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
