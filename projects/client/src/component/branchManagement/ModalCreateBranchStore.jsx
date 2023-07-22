import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { api } from "../../api/api";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { provinceList } from "../../constant/provice";

export default function ModalCreateBranchStore({ open, setOpen, getListOfStoreData, }) {
  const [branchName, setBranchName] = useState("");
  const [provinceName, setProvinceName] = useState("");
  const [cityName, setCityName] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [errorBranchName, setErrorBranchName] = useState("");
  const [errorProvinceName, setErrorProvinceName] = useState("");
  const [errorCityName, setErrorCityName] = useState("");
  const [errorAddress, setErrorAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cityList, setCityList] = useState([]);

  let validateBranchName = (value) => {
    if (value === "") {
      setErrorBranchName("Please input branch name");
    } else {
      setErrorBranchName("");
    }
    setBranchName(value);
  };

  let validateProvinceName = (value) => {
    if (value === "") {
      setErrorProvinceName("Please select province");
    } else {
      setErrorProvinceName("");
    }
    setProvinceName(value);
  };

  let validateCityName = (value) => {
    if (value === "") {
      setErrorCityName("Please select province");
    } else {
      setErrorCityName("");
    }
    setCityName(value);
  };

  let validateStoreAddress = (value) => {
    if (value === "") {
      setErrorAddress("Please select province");
    } else {
      setErrorAddress("");
    }
    setStoreAddress(value);
  };

  const postCreateBranchAdmin = async () => {
    setIsLoading(true);
    try {
      const response = await api.post("branch/create-branch", {
        branch_name: branchName,
        address: storeAddress,
        city: cityName,
        province: provinceName,
      });
      toast.success(response.data.message);
      setTimeout(() => {
        setOpen(false);
        setBranchName('')
        setStoreAddress('')
        setCityName('')
        setProvinceName('')
      }, 1500);
      getListOfStoreData();
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setIsLoading(false);
  };

  const getListOfCity = async () => {
    try {
      const provinceId = provinceName.split("-")[0]
      const response = await api.get(`city?provinceId=${provinceId}`);
      setCityList(response.data.data);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (provinceName !== "") {
      setCityName("")
      getListOfCity();
    }
  }, [provinceName]);

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
                      Add New Branch Store
                    </Dialog.Title>
                    <div className="flex flex-col mb-3">
                      <label className="block text-sm text-left font-medium text-gray-700"> {" "} Store name :{" "} </label>
                      <div className="relative">
                        <input
                          onChange={(e) => validateBranchName(e.target.value)}
                          value={branchName}
                          id="branchName"
                          name="branchName"
                          placeholder="Enter branch name"
                          type="text"
                          required
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                      <div className="text-red-700 text-xs text-left font-semibold"> {" "} {errorBranchName ? errorBranchName : null}{" "} </div>
                    </div>
                    <div className="mt-2">
                      <label htmlFor="location" className="block text-sm text-left font-medium text-gray-700" > {" "} Province{" "} </label>
                      <select
                        id="storeId"
                        name="storeId"
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        onChange={(e) => validateProvinceName(e.target.value)}
                        value={provinceName || ""}
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
                      <div className="text-red-700 text-xs text-left font-semibold"> {errorProvinceName ? errorProvinceName : null} </div>
                    </div>
                    <div className="mt-2">
                      <label htmlFor="location" className="block text-sm text-left font-medium text-gray-700" > {" "} City{" "} </label>
                      <select
                        id="storeId"
                        name="storeId"
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        onChange={(e) => validateCityName(e.target.value)}
                        value={cityName || ""}
                      >
                        <option value="">Select City</option>
                        {cityList.map((data, index) => (
                          <option
                            key={index}
                            value={`${data.city_id}-${data.type} ${data.city_name}`}
                          >
                            {`${data.type} ${data.city_name}`}
                          </option>
                        ))}
                      </select>
                      <div className="text-red-700 text-xs text-left font-semibold"> {errorCityName ? errorCityName : null} </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col mt-3">
                  <label className="block text-sm text-left font-medium text-gray-700"> {" "} Store Address :{" "} </label>
                  <div className="relative">
                    <textarea
                    value={storeAddress}
                    onChange={(e) => validateStoreAddress(e.target.value)}
                    id="description"
                    name="description"
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    defaultValue={''}
                  />
                  </div>
                  <div className="text-red-700 text-xs text-left font-semibold"> {" "} {errorAddress ? errorAddress : null}{" "} </div>
                </div>
                <div className="mt-5 sm:mt-6 flex">
                  <button disabled={isLoading} type="button" className={`mr-2 inline-flex w-full justify-center rounded-md border border-transparent ${ isLoading ? "bg-gray-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700" } px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:text-sm`} onClick={() => { postCreateBranchAdmin() }} > Add Branch Store </button>
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