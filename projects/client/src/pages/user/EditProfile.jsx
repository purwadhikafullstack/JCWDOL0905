import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import toast, { Toaster } from "react-hot-toast";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import logo_groceria from "../../assets/images/logo-brand-groceria.png";
import NavBar from "../../component/NavBar";
import Footer from "../../component/Footer";
import { useSelector } from "react-redux";

const EditProfile = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorEmail, setErrorEmail] = useState();
  const [profiles, setProfiles] = useState({
    name: "",
    gender: "",
    email: "",
    birthdate: "",
  });
  const Navigate = useNavigate();

  const user = useSelector((state) => state.userSlice)

  useEffect(() => {
    async function fetchProfiles() {
      try {
        const response = await api.get(`profiles/${user.id}`);
        const profilesData = response.data.data;

        var birthdate = new Date(profilesData.birthdate.slice(0, 10));
        birthdate.setDate(birthdate.getDate() + 1);

        let yyyy = birthdate.getFullYear();
        let mm = birthdate.getMonth() + 1;
        let dd = birthdate.getDate();

        if (dd < 10) dd = "0" + dd;
        if (mm < 10) mm = "0" + mm;

        const formattedDate = yyyy + "-" + mm + "-" + dd;
        profilesData.birthdate = formattedDate;

        setProfiles(profilesData);
        setEmail(profilesData.email);
      } catch (error) {
        // toast.error(error.response.data.message);
        console.log(error.response.data.message)
      }
    }
    fetchProfiles();
  }, [user]);

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

    const data = {
      name: document.getElementById("name").value,
      gender: document.getElementById("gender").value,
      email: email,
      birthdate: document.getElementById("birthdate").value,
      prevEmail: profiles.email,
    };

    try {
      const response = await api.patch(`profiles/${user.id}`, data);
      toast.success(response.data.message);

      document.getElementById("name").value = "";
      document.getElementById("gender").value = "";
      document.getElementById("email").value = "";
      document.getElementById("birthdate").value = "";

      setTimeout(() => {
        Navigate("/");
      }, 1500);
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setIsLoading(false);
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <button onClick={() => Navigate("/")}>
          <img src={logo_groceria} alt="groceria" style={{ height: "75px" }} />
        </button>
        <div className="flex flex-col bg-white shadow-md mt-8 px-4 sm:px-6 md:px-8 lg:px-10 py-5 rounded-3xl w-2/3 sm:w-3/4 md:w-2/3 lg:w-1/2 max-w-md">
          <div className="font-medium self-center text-xl text-gray-800">
            Edit Profile
          </div>
          <div className="mt-5">
            <form autoComplete="off">
              <div className="flex flex-col mb-3">
                <label className="mb-1 text-xs tracking-wide text-gray-600">
                  Name:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={profiles.name}
                    className="text-sm placeholder-gray-500 pl-5 pr-4 rounded-2xl border border-gray-400 w-full py-2 focus:outline-none focus:border-green-400"
                    placeholder="Insert name"
                  />
                </div>
              </div>
              <div className="flex flex-col mb-3">
                <label className="mb-1 text-xs tracking-wide text-gray-600">
                  Gender:
                </label>
                <div className="relative">
                  <select id="gender" name="gender">
                    {profiles.gender != "male" ? (
                      <option value="male">Male</option>
                    ) : (
                      <option value="male" selected>
                        Male
                      </option>
                    )}
                    {profiles.gender == "female" ? (
                      <option value="female" selected>
                        Female
                      </option>
                    ) : (
                      <option value="female">Female</option>
                    )}
                  </select>
                </div>
              </div>
              <div className="flex flex-col mb-3">
                <label className="mb-1 text-xs tracking-wide text-gray-600">
                  Email:
                </label>
                <div className="relative">
                  <input
                    onChange={(e) => validateEmail(e.target.value)}
                    type="email"
                    id="email"
                    name="email"
                    defaultValue={profiles.email}
                    className="text-sm placeholder-gray-500 pl-5 pr-4 rounded-2xl border border-gray-400 w-full py-2 focus:outline-none focus:border-green-400"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="text-red-700 text-xs font-semibold">
                  {errorEmail ? errorEmail : null}
                </div>
              </div>
              <div className="flex flex-col mb-3">
                <label className="mb-1 text-xs tracking-wide text-gray-600">
                  Birthdate:
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="birthdate"
                    name="birthdate"
                    defaultValue={profiles.birthdate}
                    className="text-sm placeholder-gray-500 pl-5 pr-4 rounded-2xl border border-gray-400 w-full py-2 focus:outline-none focus:border-green-400"
                    placeholder="Insert birthdate"
                  />
                </div>
              </div>
              <div className="flex flex-col mb-3">
                <label className="mb-1 text-xs tracking-wide text-gray-600">
                  Profile Picture:
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="profilpicture"
                    name="profilepicture"
                    defaultValue={profiles.birthdate}
                    className="text-sm placeholder-gray-500 pl-5 pr-4 rounded-2xl border border-gray-400 w-full py-2 focus:outline-none focus:border-green-400"
                    placeholder="Choose profile picture"
                  />
                </div>
              </div>
              <div className="flex w-full mt-10">
                <button
                  type="submit"
                  disabled={isLoading}
                  onClick={handleSubmit}
                  className="flex mt-2 items-center justify-center focus:outline-none text-white text-sm uppercase sm:text-base bg-green-500 hover:bg-green-600 rounded-2xl py-2 w-full transition duration-150 ease-in"
                >
                  {isLoading ? "Loading..." : "Update"}
                </button>
                <Toaster />
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default EditProfile;