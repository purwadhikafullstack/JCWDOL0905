import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "react-hot-toast";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { api } from "../../api/api";
import { useSelector } from "react-redux";

export default function ModalChangePassword({ open, setOpen }) {
  const [oldPassword, setOldPassword] = useState("");
  const [errorOldPassword, setErrorOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("");
  const [errorNewPassword, setErrorNewPassword] = useState("")
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [errorNewPasswordConfirm, setErrorNewPasswordConfirm] = useState("")
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useSelector((state) => state.adminSlice);

  let validateNewPassword = (value) => {
    if (value === "") {
      setErrorNewPassword("Please input new password");
    } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+=[\]{}|\\,./?'":;<>~`])(?!.*\s).{8,}$/.test(value)) {
      setErrorNewPassword("Password must contain at least 8 characters including an uppercase letter, a symbol, and a number");
    } else {
      setErrorNewPassword("");
    }
    setNewPassword(value);
  };


  let validateNewPasswordConfirm = (value) => {
    if (value === "") {
      setErrorNewPasswordConfirm("Please input new password");
    } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+=[\]{}|\\,./?'":;<>~`])(?!.*\s).{8,}$/.test(value)) {
        setErrorNewPasswordConfirm("Password must contain at least 8 characters including an uppercase letter, a symbol, and a number");
    } else {
        setErrorNewPasswordConfirm("");
    }
    setNewPasswordConfirm(value);
  };

  let validateOldPassword = (value) => {
    if (value === "") {
        setErrorOldPassword("Please input old password");
    } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+=[\]{}|\\,./?'":;<>~`])(?!.*\s).{8,}$/.test(value)) {
        setErrorOldPassword("Password must contain at least 8 characters including an uppercase letter, a symbol, and a number");
    } else {
        setErrorOldPassword("");
    }
    setOldPassword(value);
  };


  let handleCheckConfirmPassword = () => {
    const isPasswordSame = newPassword === newPasswordConfirm;
    if (isPasswordSame) {
     setErrorNewPasswordConfirm("");
    } else {
        setErrorNewPasswordConfirm("Password doesn't match");
    }
  };

  const postCreateBranchAdmin = async () => {
    setIsLoading(true);
    try {
      const response = await api.post("admins/change-password", { id: id, oldPassword: oldPassword, newPassword: newPassword, newPasswordConfirm: newPasswordConfirm});
      toast.success(response.data.message);
      setTimeout(() => {
        setOldPassword("")
        setNewPassword("")
        setNewPasswordConfirm("")
        setOpen(false);
      }, 1500);
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setIsLoading(false);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0" >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900" >
                      Edit Super Admin Password
                    </Dialog.Title>
                    <div className="flex flex-col mb-3">
                      <label className="block text-sm text-left font-medium text-gray-700">Old Password: </label>
                      <div className="relative">
                        <input
                          onChange={(e) => validateOldPassword(e.target.value)}
                          value={oldPassword}
                          id="oldPassword"
                          name="oldPassword"
                          placeholder="Enter old password"
                          type={showOldPassword ? "text" : "password"}
                          required
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">                        {showOldPassword ? (<AiFillEye onClick={() => setShowOldPassword((showOldPassword) => !showOldPassword)}/>) : (<AiFillEyeInvisible onClick={() => setShowOldPassword((showOldPassword) => !showOldPassword)}/>)}</div>
                      </div>
                      <div className="text-red-700 text-xs text-left font-semibold"> {errorOldPassword ? errorOldPassword : null} </div>
                    </div>
                    <div className="flex flex-col mb-3">
                      <label className="block text-sm text-left font-medium text-gray-700">New Password: </label>
                      <div className="relative">
                        <input
                          onChange={(e) => validateNewPassword(e.target.value)}
                          value={newPassword}
                          id="newPassword"
                          name="newPassword"
                          placeholder="Enter new password"
                          type={showNewPassword ? "text" : "password"}
                          required
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">{showNewPassword ? (<AiFillEye onClick={() => setShowNewPassword((showNewPassword) => !showNewPassword)}/>) : (<AiFillEyeInvisible onClick={() => setShowNewPassword((showNewPassword) => !showNewPassword)}/>)}</div>
                      </div>
                      <div className="text-red-700 text-xs text-left font-semibold"> {errorNewPassword ? errorNewPassword : null} </div>
                    </div>
                    <div className="flex flex-col mb-3">
                      <label className="block text-sm text-left font-medium text-gray-700">Confirm New Password: </label>
                      <div className="relative">
                        <input
                          onChange={(e) => validateNewPasswordConfirm(e.target.value)}
                          onBlur={handleCheckConfirmPassword}
                          value={newPasswordConfirm}
                          id="newPasswordConfirm"
                          name="newPasswordConfirm"
                          placeholder="Enter confirm new password"
                          type={showConfirmNewPassword ? "text" : "password"}
                          required
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2"> {showConfirmNewPassword ? (<AiFillEye onClick={() => setShowConfirmNewPassword((showConfirmNewPassword) => !showConfirmNewPassword)}/>) : (<AiFillEyeInvisible onClick={() => setShowConfirmNewPassword((showConfirmNewPassword) => !showConfirmNewPassword)}/>)} </div>
                      </div>
                      <div className="text-red-700 text-xs text-left font-semibold"> {errorNewPasswordConfirm ? errorNewPasswordConfirm : null} </div>
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
                    Edit Password
                  </button>
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:text-sm"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}