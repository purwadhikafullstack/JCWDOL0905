import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { api } from "../../api/api";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { provinceList } from "../../constant/provice";

const InitialErrorState = {
    branchName: "",
    provinceName: "",
    cityName: "",
    storeAddress: "",
};

export default function ModalEditBranchStore({ open, setOpen, setEditData, editData, getListOfStoreData, }) {
    const [cityList, setCityList] = useState([]);
  const [errorState, setErrorState] = useState(InitialErrorState);

  const closeModal = () => { setOpen(false); setEditData({}); setErrorState(InitialErrorState); };

  let validateBranchName = (value) => {
    if (value === "") {
      setErrorState({ ...errorState, adminName: "Please input branch name", });
    } else {
      setErrorState({ ...errorState, adminName: "", });
    }
  };

  let validateProvinceName = (value) => {
    if (value === "") {
      setErrorState({ ...errorState, provinceName: "Please select province", });
    } else {
      setErrorState({ ...errorState, provinceName: "", });
    }
  };

  let validateCityName = (value) => {
    if (value === "") {
      setErrorState({ ...errorState, cityName: "Please select city", });
    } else {
      setErrorState({ ...errorState, cityName: "", });
    }
  };

  let validateStoreAddress = (value) => {
    if (value === "") {
      setErrorState({ ...errorState, storeAddress: "Please input store address", });
    } else {
      setErrorState({ ...errorState, storeAddress: "", });
    }
  };

  const putEditBranchStore = async () => {
    try {
      const response = await api.put(`branch/edit-branch/${editData.id}`, {
        branch_name: editData.branchName,
        address: editData.storeAddress,
        city: editData.cityName,
        province: editData.provinceName});
      toast.success(response.data.message);
      setTimeout(() => { setOpen(false); setEditData({}); setErrorState(InitialErrorState); }, 1500);
      getListOfStoreData();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const getListOfCity = async () => {
    try {
      const response = await api.get(`city?provinceId=${editData?.provinceName}`);
      setCityList(response.data.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (editData && editData.provinceName !== undefined) {
      setEditData({ ...editData, cityName: "" });
      getListOfCity();
    }
  }, [editData.provinceName]);

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
                    <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900" > Edit Store Branch </Dialog.Title>
                    <div className="mt-2">
                      <label className="block text-sm text-left font-medium text-gray-700"> Name: </label>
                      <input
                        onChange={(e) => { setEditData({ ...editData, branchName: e.target.value, }); validateBranchName(e.target.value); }}
                        value={editData.branchName}
                        id="branchName"
                        name="branchName"
                        placeholder="Enter branch name"
                        type="text"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <div className="text-red-700 text-xs text-left font-semibold"> {errorState.branchName ? errorState.branchName : null} </div>
                    </div>
                    <div className="mt-2">
                      <label htmlFor="location" className="block text-sm text-left font-medium text-gray-700" > {" "} Province{" "} </label>
                      <select
                        id="storeId"
                        name="storeId"
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        onChange={(e) => {
                          setEditData({ ...editData, provinceName: e.target.value, });
                          validateProvinceName(e.target.value);
                        }}
                        value={editData.provinceName || ""}
                      >
                        <option value="">Select province</option>
                        {provinceList.map((data, index) => (
                          <option
                            key={index}
                            value={`${data.province_id}-${data.province}`}
                          >
                            {data.province}
                          </option>
                        ))}
                      </select>
                      <div className="text-red-700 text-xs text-left font-semibold"> {errorState.provinceName ? errorState.provinceName : null} </div>
                    </div>
                    <div className="mt-2">
                      <label htmlFor="location" className="block text-sm text-left font-medium text-gray-700" > {" "} City{" "} </label>
                      <select
                        id="storeId"
                        name="storeId"
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        onChange={(e) => {
                          setEditData({ ...editData, cityName: e.target.value, });
                          validateCityName(e.target.value)
                        }}
                        value={editData.cityName || ""}
                      >
                        <option value="">Select City</option>
                        {cityList.map((data, index) => (
                          <option
                            key={index}
                            value={`${data.city_id}-${data.city_name}`}
                          >
                            {data.city_name}
                          </option>
                        ))}
                      </select>
                      <div className="text-red-700 text-xs text-left font-semibold"> {errorState.cityName ? errorState.cityName : null} </div>
                    </div>
                    <div className="flex flex-col mt-3">
                  <label className="block text-sm text-left font-medium text-gray-700"> {" "} Store Address :{" "} </label>
                  <div className="relative">
                    <input
                      onChange={(e) => {
                        setEditData({ ...editData, storeAddress: e.target.value, });
                        validateStoreAddress(e.target.value)
                      }}
                      value={editData.storeAddress}
                      id="storeAddress"
                      name="storeAddress"
                      placeholder="Enter store address"
                      type="text"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 multiline"
                    />
                  </div>
                  <div className="text-red-700 text-xs text-left font-semibold"> {" "} {errorState.storeAddress ? errorState.storeAddress : null}{" "} </div>
                </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 flex">
                  <button type="button" className="mr-2 inline-flex w-full justify-center rounded-md border border-transparent disabled:bg-green-800 bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:text-sm" onClick={() => { putEditBranchStore() }} > Edit Admin </button>
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