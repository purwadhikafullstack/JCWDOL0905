import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import toast, { Toaster } from "react-hot-toast";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import logo_groceria from "../../assets/images/logo-brand-groceria.png"

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorName, setErrorName] = useState();
  const [errorEmail, setErrorEmail] = useState();
  const [errorPassword, setErrorPassword] = useState();
  const [errorPhoneNumber, setErrorPhoneNumber] = useState();
  const Navigate = useNavigate();

  let validateName = (value) => {
    if (value === "") {
      setErrorName("Please input your name");
    } else {
      setErrorName("");
    }
    setName(value);
  };

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

  let validatePhoneNumber = (value) => {
    if (value === "") {
      setErrorPhoneNumber("Please input your phone number");
    } else if (isNaN(value)) {
      setErrorPhoneNumber("Phone number must be number");
    } else if (value.length < 9) {
      setErrorPhoneNumber("Input phone number less than 9 digit");
    } else if (value.length > 12) {
      setErrorPhoneNumber("Input phone number more than 12 digit");
    } else {
      setErrorPhoneNumber("");
    }
    setPhoneNumber(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post("users/register", {name: name, email: email, password: password, phone_number: phoneNumber}, {headers: {secret_key: 'apahayo'}});
      toast.success(response.data.message);
      setTimeout(() => {Navigate('/resend-verification')}, 1500);
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <button onClick={() => Navigate("/")}><img src={logo_groceria} alt="groceria" style={{ height: "75px" }}/></button>
      <div className="flex flex-col bg-white shadow-md mt-8 px-4 sm:px-6 md:px-8 lg:px-10 py-5 rounded-3xl w-2/3 sm:w-3/4 md:w-2/3 lg:w-1/2 max-w-md">
        <div className="font-medium self-center text-xl text-gray-800">Register Now</div>
        <div className="mt-5">
          <form autoComplete="off">
            <div className="flex flex-col mb-3">
              <label className="mb-1 text-xs tracking-wide text-gray-600">Name:</label>
              <div className="relative">
                <input
                  onChange={(e) => validateName(e.target.value)}
                  type="text"
                  name="name"
                  className="text-sm placeholder-gray-500 pl-5 pr-4 rounded-2xl border border-gray-400 w-full py-2 focus:outline-none focus:border-green-400"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="text-red-700 text-xs font-semibold">{errorName ? errorName : null}</div>
            </div>
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
            <div className="flex flex-col mb-3">
              <label className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">Phone Number:</label>
              <div className="relative">
                <input
                  onChange={(e) => validatePhoneNumber(e.target.value)}
                  type="text"
                  name="phone_number"
                  className="text-sm placeholder-gray-500 pl-5 pr-4 rounded-2xl border border-gray-400 w-full py-2 focus:outline-none focus:border-green-400"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              <div className="text-red-700 text-xs font-semibold">{errorPhoneNumber ? errorPhoneNumber : null}</div>
            </div>
            <div className="flex w-full mt-10">
              <button
                type="submit"
                disabled={isLoading}
                onClick={handleSubmit}
                className="flex mt-2 items-center justify-center focus:outline-none text-white text-sm uppercase sm:text-base bg-green-500 hover:bg-green-600 rounded-2xl py-2 w-full transition duration-150 ease-in"
              >
                {isLoading ? "Loading..." : "Register"}
              </button>
              <Toaster />
            </div>
          </form>
        </div>
      </div>
      <div className="flex justify-center items-center mt-6 text-sm">
        <span className="ml-2">
          Already have an account?
          <span onClick={() => Navigate("/login")} className="ml-2 text-green-500 font-semibold hover:underline cursor-pointer">
            Login here
          </span>
        </span>
      </div>
    </div>
  );
};

export default Register;
