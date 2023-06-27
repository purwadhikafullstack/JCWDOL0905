import { useState } from "react";
import { useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import toast, { Toaster } from "react-hot-toast";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import logo_groceria from "../../assets/images/logo-brand-groceria.png"

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)
  const [errorOldPassword, setErrorOldPassword] = useState();
  const [errorNewPassword, setErrorNewPassword] = useState();
  const [errorConfirmNewPassword, setErrorConfirmNewPassword] = useState();
  const Navigate = useNavigate();

  const { id } = useSelector(state => state.userSlice)
  const id_user = id

  let validateOldPassword = (value) => {
    if (value === "") {
      setErrorOldPassword("Please input your current password");
    } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+=[\]{}|\\,./?'":;<>~`])(?!.*\s).{8,}$/.test(value)) {
      setErrorOldPassword("Password must contain at least 8 characters including an uppercase letter, a symbol, and a number");
    } else {
      setErrorOldPassword("");
    }
    setOldPassword(value);
  };

  let validateNewPassword = (value) => {
    if (value === "") {
      setErrorNewPassword("Please input your password");
    } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+=[\]{}|\\,./?'":;<>~`])(?!.*\s).{8,}$/.test(value)) {
      setErrorNewPassword("Password must contain at least 8 characters including an uppercase letter, a symbol, and a number");
    } else {
      setErrorNewPassword("");
    }
    setNewPassword(value);
  };

  let handleCheckConfirmPassword = () => {
    const isPasswordSame = newPassword === confirmNewPassword;
    if (isPasswordSame) {
      setErrorConfirmNewPassword("");
    } else {
      setErrorConfirmNewPassword("Password doesn't match");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post("users/change-password", {id_user: id_user, oldPassword: oldPassword, newPassword: newPassword, confirmNewPassword: confirmNewPassword});
      toast.success(response.data.message);
      setTimeout(() => {Navigate('/profile')}, 1500);
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <button onClick={() => Navigate("/")}><img src={logo_groceria} alt="groceria" style={{ height: "75px" }} /></button>
      <div className="flex flex-col bg-white shadow-md mt-8 px-4 sm:px-6 md:px-8 lg:px-10 py-5 rounded-3xl w-2/3 sm:w-3/4 md:w-2/3 lg:w-1/2 max-w-md">
        <div className="font-medium self-center text-xl text-gray-800">Change Password</div>
        <div className="mt-5">
          <form autoComplete="off">
          <div className="flex flex-col mb-3">
              <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">Old password:</label>
              <div className="relative">
                <input
                  onChange={(e) => validateOldPassword(e.target.value)}
                  type={showOldPassword ? "text" : "password"}
                  name="password"
                  className="text-sm placeholder-gray-500 pl-5 pr-4 rounded-2xl border border-gray-400 w-full py-2 focus:outline-none focus:border-green-400"
                  placeholder="Enter current password"
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {showOldPassword ? (<AiFillEye onClick={() => setShowOldPassword((showOldPassword) => !showOldPassword)}/>) : (<AiFillEyeInvisible onClick={() => setShowOldPassword((showOldPassword) => !showOldPassword)}/>)}
                </div>
              </div>
              <div className="text-red-700 text-xs font-semibold">{errorOldPassword ? errorOldPassword : null}</div>
            </div>
            <div className="flex flex-col mb-3">
              <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">New password:</label>
              <div className="relative">
                <input
                  onChange={(e) => validateNewPassword(e.target.value)}
                  type={showNewPassword ? "text" : "password"}
                  name="password"
                  className="text-sm placeholder-gray-500 pl-5 pr-4 rounded-2xl border border-gray-400 w-full py-2 focus:outline-none focus:border-green-400"
                  placeholder="Enter new password"
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {showNewPassword ? (<AiFillEye onClick={() => setShowNewPassword((showNewPassword) => !showNewPassword)}/>) : (<AiFillEyeInvisible onClick={() => setShowNewPassword((showNewPassword) => !showNewPassword)}/>)}
                </div>
              </div>
              <div className="text-red-700 text-xs font-semibold">{errorNewPassword ? errorNewPassword : null}</div>
            </div>
            <div className="flex flex-col mb-3">
              <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">Confirm new password:</label>
              <div className="relative">
                <input
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  onBlur={handleCheckConfirmPassword}
                  type={showConfirmNewPassword ? "text" : "password"}
                  name="confirmPassword"
                  className="text-sm placeholder-gray-500 pl-5 pr-4 rounded-2xl border border-gray-400 w-full py-2 focus:outline-none focus:border-green-400"
                  placeholder="Enter confirm new password"
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {showConfirmNewPassword ? (<AiFillEye onClick={() => setShowConfirmNewPassword((showConfirmNewPassword) => !showConfirmNewPassword)}/>) : (<AiFillEyeInvisible onClick={() => setShowConfirmNewPassword((showConfirmNewPassword) => !showConfirmNewPassword)}/>)}
                </div>
              </div>
              <div className="text-red-700 text-xs font-semibold">{errorConfirmNewPassword ? errorConfirmNewPassword : null}</div>
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
            <div className="flex w-full mt-5">
              <button
                className="flex mt-2 items-center justify-center focus:outline-none text-white text-sm uppercase sm:text-base bg-red-500 hover:bg-red-600 rounded-2xl py-2 w-full transition duration-150 ease-in"
              >
                Cancel
              </button>
              <Toaster />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
