import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { api } from "../api/api";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const InitialErrorState = {
  adminName: "",
  adminPassword: "",
  adminEmail: "",
  adminIdBranch: "",
};

const isObjectNotEmpty = (objectTarget) => {
  return Object.values(objectTarget).some((value) => value !== "");
};

export default function ModalEditAdminBranch({ open, setOpen, setEditData, editData, getListOfAdmin, }) {
  const [storeData, setStoreData] = useState([]);
  const [adminPassword, setAdminPassword] = useState("");
  const [errorState, setErrorState] = useState(InitialErrorState);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditPassword, setIsEditPassword] = useState(false);

  const postCreateBranchAdmin = async () => {
    try {
      const response = await api.put(`admins/edit-admin/${editData.id}`, { name: editData.admin_name, email: editData.email, password: adminPassword, branchId: editData.id_branch, });
      toast.success(response.data.message);
      setTimeout(() => { setOpen(false); setAdminPassword(""); setEditData({}); setErrorState(InitialErrorState); }, 1500);
      getListOfAdmin();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const validateName = (value) => {
    if (value === "") {
      setErrorState({ ...errorState, adminName: "Please input admin name", });
    } else {
      setErrorState({ ...errorState, adminName: "", });
    }
  };

  const validateEmail = (value) => {
    if (value === "") {
      setErrorState({ ...errorState, adminEmail: "Please input admin email", });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setErrorState({ ...errorState, adminEmail: "Invalid email format", });
    } else {
      setErrorState({ ...errorState, adminEmail: "", });
    }
  };

  const validatePassword = (value) => {
    if (value === "") {
      setErrorState({ ...errorState, adminPassword: "Please input admin password", });
    } else if ( !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+=[\]{}|\\,./?'":;<>~`])(?!.*\s).{8,}$/.test( value ) ) {
      setErrorState({ ...errorState, adminPassword: "Password must contain at least 8 characters including an uppercase letter, a symbol, and a number", });
    } else {
      setErrorState({ ...errorState, adminPassword: "", });
    }
  };

  const validateStoreBranch = (value) => {
    if (value === "") {
      setErrorState({ ...errorState, adminIdBranch: "Please select store branch", });
    } else {
      setErrorState({ ...errorState, adminIdBranch: "", });
    }
  };

  const getListOfStoreData = async () => {
    try {
      const response = await api.get(`branch`);
      setStoreData(response.data.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const closeModal = () => { setOpen(false); setAdminPassword(""); setEditData({}); setErrorState(InitialErrorState); };
  useEffect(() => {
    getListOfStoreData();
  }, []);

  const checkPassword = () => {
    if (isEditPassword) {
      return adminPassword === ""
    } else {
      return false
    }
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0" > <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" /> </Transition.Child>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900" > Edit Branch Admin </Dialog.Title>
                    <div className="mt-2">
                      <label className="block text-sm text-left font-medium text-gray-700"> Name: </label>
                      <input
                        onChange={(e) => { setEditData({ ...editData, admin_name: e.target.value, }); validateName(e.target.value); }}
                        value={editData.admin_name}
                        name="adminName"
                        placeholder="Enter admin name"
                        type="text"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <div className="text-red-700 text-xs text-left font-semibold"> {errorState.adminName ? errorState.adminName : null} </div>
                    </div>
                    <div className="mt-2">
                      <label className="block text-sm text-left font-medium text-gray-700"> Email: </label>
                      <input
                        onChange={(e) => {
                          setEditData({ ...editData, email: e.target.value, });
                          validateEmail(e.target.value);
                        }}
                        value={editData.email}
                        name="adminEmail"
                        placeholder="Enter admin email"
                        type="text"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <div className="text-red-700 text-xs text-left font-semibold"> {errorState.adminEmail ? errorState.adminEmail : null} </div>
                    </div>
                    <div className="mt-2">
                      <label htmlFor="location" className="block text-sm text-left font-medium text-gray-700" > Store Branch Name: </label>
                      <select
                        name="storeId"
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        onChange={(e) => {
                          setEditData({ ...editData, id_branch: e.target.value, });
                          validateStoreBranch(e.target.value);
                        }}
                        value={editData.id_branch || ""}
                      >
                        <option value="">Select store</option>
                        {storeData.map((data, index) => (
                          <option key={index} value={data.id}> {data.branch_name} </option>
                        ))}
                      </select>
                      <div className="text-red-700 text-xs text-left font-semibold"> {errorState.adminIdBranch ? errorState.adminIdBranch : null} </div>
                    </div>
                    <div className="mt-2 flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={isEditPassword}
                        onClick={() => {
                          setIsEditPassword((isEditPassword) => !isEditPassword)
                          setAdminPassword('')
                          setErrorState({ ...errorState, adminPassword: '' })
                        }}
                      />
                      <label> Change admin password? </label>
                    </div>
                    {isEditPassword && (
                      <div className="mt-2">
                      <label className="block text-sm text-left font-medium text-gray-700"> Password: </label>
                      <div className="relative">
                        <input
                          onChange={(e) => {
                            setAdminPassword(e.target.value);
                            validatePassword(e.target.value);
                          }}
                          value={adminPassword}
                          name="password"
                          placeholder="Enter password"
                          type={showPassword ? "text" : "password"}
                          required
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2"> {showPassword ? ( <AiFillEye onClick={() => setShowPassword((showPassword) => !showPassword) } /> ) : ( <AiFillEyeInvisible onClick={() => setShowPassword((showPassword) => !showPassword) } /> )} </div>
                      </div>
                      <div className="text-red-700 text-xs text-left font-semibold"> {errorState.adminPassword ? errorState.adminPassword : null} </div>
                    </div>)}
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 flex">
                  <button
                    disabled={ editData.admin_name === "" || editData.email === "" || editData.id_branch === "" || isObjectNotEmpty(errorState) || checkPassword() } type="button" className="mr-2 inline-flex w-full justify-center rounded-md border border-transparent disabled:bg-green-800 bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:text-sm" onClick={() => { postCreateBranchAdmin(); }} > Edit Admin </button>
                  <button type="button" className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:text-sm" onClick={() => setOpen(false)} > Close </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}