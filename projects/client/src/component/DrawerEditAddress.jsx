import { useState, useEffect, Fragment } from "react";
import { PROVINCE_LIST } from "../helper";
import { api } from "../api/api";
import toast, { Toaster } from "react-hot-toast";
import { PencilSquareIcon, BackspaceIcon, ChevronLeftIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog, Transition } from '@headlessui/react'

export default function DrawerEditAddress(props) {
    const [open, setOpen] = useState(false);
    const [city, setCity] = useState([]);
    const [provinceId, setProvinceId] = useState(1);
    const [detail, setDetail] = useState({});
    const token = localStorage.getItem("token")
    const idAddress = props.id

    useEffect(() => {
        async function fetchData() {
          try {
            const response = await api.get(`address/${idAddress}`);
            const addressDetail = response.data.data;
            setDetail(addressDetail);
            setProvinceId(addressDetail.province_id)
    
          } catch (error) {
            toast.error(error.response.data.message);
          }
        }
        fetchData();
    }, [open]);

    useEffect(() => {
        async function fetchCity(){
            try{
                const response = await api.get(`city?provinceId=${provinceId}`)
                const cityData = response.data.data
                setCity(cityData)
            }catch(error){
                toast.error(error.response.data.message);
            }
        }
        fetchCity()
    }, [open, provinceId])

    const handleSubmit = async () => {
        try {
            const data = {
                address_detail : document.getElementById("address_detail").value,
                label : document.getElementById("label").value,
                cityId : document.getElementById("city").value,
                provinceId : document.getElementById("province").value,
                is_main : document.getElementById("is_main").checked,
            }

            if(data.address_detail == '' || data.label == ''){
                throw({response: {data: {message: "Please fill all required fields"}}})
            }
            
            const response = await api.patch(`address/${idAddress}`, data, {
                'headers': {
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success(response.data.message);

            document.getElementById("address_detail").value = "";
            document.getElementById("label").value = "";

            setTimeout(() => { window.location.href = '/address' }, 200);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    return (
        <>
            <button class="font-medium flex-none mr-5"><PencilSquareIcon className="h-5 w-5 fill-white stroke-blue-600" onClick={() => setOpen(true)}/></button>
            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={()=> {}}>
                    <div className="fixed inset-0" />

                    <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                        <Transition.Child as={Fragment} enter="transform transition ease-in-out duration-500 sm:duration-700" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition ease-in-out duration-500 sm:duration-700" leaveFrom="translate-x-0" leaveTo="translate-x-full">   
                            <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                            <form className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl">
                                <div className="h-0 flex-1 overflow-y-auto">
                                <div className="bg-green-700 py-6 px-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                    <Dialog.Title className="text-lg font-medium text-white">Update Address</Dialog.Title>
                                    <div className="ml-3 flex h-7 items-center">
                                        <button type="button" className="rounded-md bg-green-700 text-green-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white" onClick={() => setOpen(false)}>
                                            <span className="sr-only">Close panel</span>
                                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                        </button>
                                    </div>
                                    </div>
                                </div>
                                <div className="flex flex-1 flex-col justify-between">
                                    <div className="divide-y divide-gray-200 px-4 sm:px-6">
                                    <div className="space-y-6 pt-6 pb-5">
                                        <div>
                                            <label htmlFor="project-name" className="block text-sm font-medium text-gray-900">
                                                Address Label
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                type="text"
                                                name="label"
                                                id="label"
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                                defaultValue={detail.label}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="description" className="block text-sm font-medium text-gray-900">
                                                Address Detail
                                            </label>
                                            <div className="mt-1">
                                                <textarea
                                                id="address_detail"
                                                name="address_detail"
                                                rows={3}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                                defaultValue={detail.address_detail}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="province" className="block text-sm font-medium text-gray-900">Province</label>
                                            <div className="mt-1">
                                                <select
                                                name="province"
                                                id="province"
                                                onChange={(e) => setProvinceId(e.target.value)}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                                >
                                                    {PROVINCE_LIST.map((data)=>{
                                                        return(
                                                            <option selected={data.province_id==detail.province_id} key={data.province_id} value={data.province_id}>{data.province}</option>
                                                        )
                                                    })}
                                                </select>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label htmlFor="project-name" className="block text-sm font-medium text-gray-900">City</label>
                                            <div className="mt-1">
                                                <select
                                                name="city"
                                                id="city"
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                                >
                                                    {city.map((data)=>{
                                                        return(
                                                            <option selected={data.city_id==detail.city_id} key={data.city_id} value={data.city_id}>{data.city_name}</option>
                                                        )
                                                    })}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="relative flex items-start py-4">
                                            <div className="min-w-0 flex-1 text-sm">
                                                <label htmlFor="is_main" className="font-medium text-gray-700">
                                                Set as Main Address
                                                </label>
                                            </div>
                                            <div className="ml-3 flex h-5 items-center">
                                                <input
                                                id="is_main"
                                                name="is_main"
                                                type="checkbox"
                                                defaultChecked={detail.is_main}
                                                className="h-4 w-4 rounded border-gray-500 text-green-600 focus:ring-green-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                </div>
                                <div className="flex flex-shrink-0 justify-end px-4 py-4">
                                <button type="button" className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2" onClick={() => setOpen(false)}>Cancel</button>
                                <button type="button" onClick={() => handleSubmit()} className="ml-4 inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">Update</button>
                                </div>
                            </form>
                            </Dialog.Panel>
                        </Transition.Child>
                        </div>
                    </div>
                    </div>
                </Dialog>
            </Transition.Root>
            <Toaster/>
        </>
    )
}