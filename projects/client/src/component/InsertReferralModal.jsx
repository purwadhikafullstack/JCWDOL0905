import { Fragment, useRef, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { useDispatch, useSelector } from "react-redux";
import { api } from "../api/api";
import toast, { Toaster } from "react-hot-toast";
import { PencilSquareIcon, BackspaceIcon, ChevronLeftIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export default function InsertReferralModal(props) {
  const [open, setOpen] = useState(false)
  const cancelButtonRef = useRef(null)


  const handleSubmit = async () => {
    let data = {referral_code : document.getElementById("referral").value}
    let valid = true
    if(data.referral_code.length != 10) valid = false

    if(valid){
        try{
            const response = await api.post(`profiles/voucher/${props.id}`, data);
            toast.success(response.data.message)
            window.location.href = `/profile`
        }catch(error){
            toast.error(error.response.data.message)
        }
    }else{
        toast.error("Referral code not valid")
    }
  };

  return (
    <>
        <a onClick={() => setOpen(true)} className="text-teal-200 hover:text-teal-100 underline" href='#'>Insert Friend's Referral</a>
        <Toaster/>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ArrowUpTrayIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        Insert Friend's Referral Code
                      </Dialog.Title>
                      <div className="mt-2">
                      <input
                        type="text"
                        id="referral"
                        name="referral"
                        className="text-sm placeholder-black-400 pl-5 pr-4 rounded-2xl border border-gray-200 w-full py-2 focus:border-gray-200 outline"
                        placeholder="Type here"
                      />
                      </div>
                    </div>                    
                  </div>

                  <div className="mt-5 sm:mt-4 sm:ml-10 sm:flex sm:pl-4">
                    <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto sm:text-sm"
                        onClick={() => handleSubmit()}
                        >
                        Done
                    </button>
                    
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => setOpen(false)}
                      ref={cancelButtonRef}
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
    </>
  )
}
