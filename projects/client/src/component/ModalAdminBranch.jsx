import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { api } from "../api/api";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function ModalAdminBranch({ open, setOpen, getListOfAdmin }) {
  const [storeData, setStoreData] = useState([]);
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [branchId, setBranchId] = useState("");
  const [errorAdminName, setErrorAdminName] = useState("")
  const [errorAdminEmail, setErrorAdminEmail] = useState("")
  const [errorAdminPassword, setErrorAdminPassword] = useState("")
  const [errorStoreBranch, setErrorStoreBranch] = useState("")
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  let validateName = (value) => {
    if (value === "") {
      setErrorAdminName("Please input admin name");
    } else {
      setErrorAdminName("");
    }
    setAdminName(value);
  };

  let validateEmail = (value) => {
    if (value === "") {
      setErrorAdminEmail("Please input admin email");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setErrorAdminEmail("Invalid email format");
    } else {
      setErrorAdminEmail("");
    }
    setAdminEmail(value);
  };

  let validatePassword = (value) => {
    if (value === "") {
      setErrorAdminPassword("Please input admin password");
    } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+=[\]{}|\\,./?'":;<>~`])(?!.*\s).{8,}$/.test(value)) {
      setErrorAdminPassword("Password must contain at least 8 characters including an uppercase letter, a symbol, and a number");
    } else {
      setErrorAdminPassword("");
    }
    setAdminPassword(value);
  };

  let validateStoreBranch = (value) => {
    if (value === "") {
      setErrorStoreBranch("Please select store branch");
    } else {
      setErrorStoreBranch("");
    }
    setBranchId(value);
  };

  const postCreateBranchAdmin = async () => {
    setIsLoading(true);
    try {
      const response = await api.post("admins/create-admin", { name: adminName, email: adminEmail, password: adminPassword, branchId: branchId });
      toast.success(response.data.message);
      setTimeout(() => {
        setOpen(false);
        setAdminName('')
        setAdminEmail('')
        setAdminPassword('')
        setBranchId('')
      }, 1500);
      getListOfAdmin()
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setIsLoading(false);
  };

  const getListOfStoreData = async () => {
    try {
      const response = await api.get(`branch`);
      setStoreData(response.data.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    getListOfStoreData();
  }, []);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0" > <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" /> </Transition.Child>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900" > Add New Branch Admin </Dialog.Title>
                    <div className="flex flex-col mb-3">
                      <label className="block text-sm text-left font-medium text-gray-700"> Name: </label>
                      <div className="relative">
                        <input
                          onChange={(e) => validateName(e.target.value)}
                          value={adminName}
                          id="adminName"
                          name="adminName"
                          placeholder="Enter admin name"
                          type="text"
                          required
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                      <div className="text-red-700 text-xs text-left font-semibold"> {errorAdminName ? errorAdminName : null} </div>
                    </div>
                    <div className="flex flex-col mb-3">
                      <label className="block text-sm text-left font-medium text-gray-700"> Email: </label>
                      <div className="relative">
                        <input
                          onChange={(e) => validateEmail(e.target.value)}
                          value={adminEmail}
                          id="adminEmail"
                          name="adminEmail"
                          placeholder="Enter admin email"
                          type="text"
                          required
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                      <div className="text-red-700 text-xs text-left font-semibold"> {errorAdminEmail ? errorAdminEmail : null} </div>
                    </div>
                    <div className="flex flex-col mb-3">
                      <label className="block text-sm text-left font-medium text-gray-700"> Password: </label>
                      <div className="relative">
                        <input
                          onChange={(e) => validatePassword(e.target.value)}
                          value={adminPassword}
                          id="password"
                          name="password"
                          placeholder="Enter password"
                          type={showPassword ? "text" : "password"}
                          required
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2"> {showPassword ? ( <AiFillEye onClick={() => setShowPassword((showPassword) => !showPassword) } /> ) : ( <AiFillEyeInvisible onClick={() => setShowPassword((showPassword) => !showPassword) } /> )} </div>
                      </div>
                      <div className="text-red-700 text-xs text-left font-semibold"> {errorAdminPassword ? errorAdminPassword : null} </div>
                    </div>
                    <div className="mt-2">
                      <label htmlFor="location" className="block text-sm text-left font-medium text-gray-700" > Branch Store Name </label>
                      <select
                        id="storeId"
                        name="storeId"
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        onChange={(e) => validateStoreBranch(e.target.value)}
                        value={branchId || ""}
                      >
                        <option value="">Select branch store</option>
                        {storeData.map((data, index) => (
                          <option key={index} value={data.id}>
                            {data.branch_name}
                          </option>
                        ))}
                      </select>
                      <div className="text-red-700 text-xs text-left font-semibold"> {errorStoreBranch ? errorStoreBranch : null} </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 flex">
                  <button
                    disabled={isLoading}
                    type="button"
                    className={`mr-2 inline-flex w-full justify-center rounded-md border border-transparent ${
                      isLoading
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    } px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:text-sm`}
                    onClick={() => {
                      postCreateBranchAdmin();
                    }}
                  >
                    Add Branch Admin
                  </button>
                  <button type="button" className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:text-sm" onClick={() => setOpen(false)} > Cancel </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}