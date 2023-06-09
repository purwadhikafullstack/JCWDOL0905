import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import toast, { Toaster } from "react-hot-toast";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import logo_groceria from "../../assets/images/logo-brand-groceria.png"

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("token");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errorPassword, setErrorPassword] = useState();
  const [errorConfirmPassword, setErrorConfirmPassword] = useState();
  const Navigate = useNavigate();

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

  let handleCheckPassword = () => {
    const isPasswordSame = password === confirmPassword;
    if (isPasswordSame) {
      setErrorConfirmPassword("");
    } else {
      setErrorConfirmPassword("Password doesn't match");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post("users/reset-password", {token: token, password: password, confirmPassword: confirmPassword});
      toast.success(response.data.message);
      setTimeout(() => {Navigate('/login')}, 1500);
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <button onClick={() => Navigate("/")}><img src={logo_groceria} alt="groceria" style={{ height: "75px" }} /></button>
      <div className="flex flex-col bg-white shadow-md mt-8 px-4 sm:px-6 md:px-8 lg:px-10 py-5 rounded-3xl w-2/3 sm:w-3/4 md:w-2/3 lg:w-1/2 max-w-md">
        <div className="font-medium self-center text-xl text-gray-800">Please enter new password</div>
        <div className="mt-5">
          <form autoComplete="off">
            <div className="flex flex-col mb-3">
              <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">New password:</label>
              <div className="relative">
                <input
                  onChange={(e) => validatePassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="text-sm placeholder-gray-500 pl-5 pr-4 rounded-2xl border border-gray-400 w-full py-2 focus:outline-none focus:border-green-400"
                  placeholder="Enter your new password"
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {showPassword ? (<AiFillEye onClick={() => setShowPassword((showPassword) => !showPassword)}/>) : (<AiFillEyeInvisible onClick={() => setShowPassword((showPassword) => !showPassword)}/>)}
                </div>
              </div>
              <div className="text-red-700 text-xs font-semibold">{errorPassword ? errorPassword : null}</div>
            </div>
            <div className="flex flex-col mb-3">
              <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">Confirm password:</label>
              <div className="relative">
                <input
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={handleCheckPassword}
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassowrd"
                  className="text-sm placeholder-gray-500 pl-5 pr-4 rounded-2xl border border-gray-400 w-full py-2 focus:outline-none focus:border-green-400"
                  placeholder="Enter confirm password"
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {showConfirmPassword ? (<AiFillEye onClick={() => setShowConfirmPassword((showConfirmPassword) => !showConfirmPassword)}/>) : (<AiFillEyeInvisible onClick={() => setShowConfirmPassword((showConfirmPassword) => !showConfirmPassword)}/>)}
                </div>
              </div>
              <div className="text-red-700 text-xs font-semibold">{errorConfirmPassword ? errorConfirmPassword : null}</div>
            </div>
            <div className="flex w-full mt-10">
              <button
                type="submit"
                disabled={isLoading}
                onClick={handleSubmit}
                className="flex mt-2 items-center justify-center focus:outline-none text-white text-sm uppercase sm:text-base bg-green-500 hover:bg-green-600 rounded-2xl py-2 w-full transition duration-150 ease-in"
              >
                {isLoading ? "Loading..." : "Reset Password"}
              </button>
              <Toaster />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
