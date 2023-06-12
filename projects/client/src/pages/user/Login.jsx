import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import toast, { Toaster } from "react-hot-toast";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import logo_groceria from "../../assets/images/logo-brand-groceria.png"
import { useDispatch, useSelector } from "react-redux";
import userSlice, { login } from "../../redux/userSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorEmail, setErrorEmail] = useState();
  const [errorPassword, setErrorPassword] = useState();
  const Navigate = useNavigate();

  const dispatch = useDispatch()


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

  let validatePassword = (value) => {
    if (value === "") {
      setErrorPassword("Please input your password");
    } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+=[\]{}|\\,./?'":;<>~`])(?!.*\s).{8,}$/.test(value)) {
      setErrorPassword("Password must contain at least 8 characters including an uppercase letter, a symbol, and a number");
    } else {
      setErrorPassword("");
    }
    setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post("users/login", {email: email, password: password});
      toast.success(response.data.message);
      localStorage.setItem("token", `${response.data.data.access_token}`);

      dispatch(
       login(response.data.data.user)
      );

      setTimeout(() => {Navigate('/')}, 1500);
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <button onClick={() => Navigate("/")}><img src={logo_groceria} alt="groceria" style={{ height: "75px" }} /></button>
      <div className="flex flex-col bg-white shadow-md mt-8 px-4 sm:px-6 md:px-8 lg:px-10 py-5 rounded-3xl w-2/3 sm:w-3/4 md:w-2/3 lg:w-1/2 max-w-md">
        <div className="font-medium self-center text-xl text-gray-800">Login</div>
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
            <div className="flex flex-col mb-3">
              <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">Password:</label>
              <div className="relative">
                <input
                  onChange={(e) => validatePassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="text-sm placeholder-gray-500 pl-5 pr-4 rounded-2xl border border-gray-400 w-full py-2 focus:outline-none focus:border-green-400"
                  placeholder="Enter your password"
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {showPassword ? (<AiFillEye onClick={() => setShowPassword((showPassword) => !showPassword)}/>) : (<AiFillEyeInvisible onClick={() => setShowPassword((showPassword) => !showPassword)}/>)}
                </div>
              </div>
              <div className="text-red-700 text-xs font-semibold">{errorPassword ? errorPassword : null}</div>
            </div>
            <div className="flex justify-left items-left mt-1">
              <span onClick={() => Navigate("/forgot-password")} className="ml-2 text-green-500 font-semibold hover:underline cursor-pointer text-sm">
                Forgot Password?
              </span>
            </div>
            <div className="flex w-full mt-10">
              <button
                type="submit"
                disabled={isLoading}
                onClick={handleSubmit}
                className="flex mt-2 items-center justify-center focus:outline-none text-white text-sm uppercase sm:text-base bg-green-500 hover:bg-green-600 rounded-2xl py-2 w-full transition duration-150 ease-in"
              >
                {isLoading ? "Loading..." : "Login"}
              </button>
              <Toaster />
            </div>
          </form>
        </div>
        <div className="flex justify-center items-center mt-12 text-sm">
          <span className="ml-2">
            Don't have an account?
            <span onClick={() => Navigate("/register")} className="ml-2 text-green-500 font-semibold hover:underline cursor-pointer">
              Register here
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
