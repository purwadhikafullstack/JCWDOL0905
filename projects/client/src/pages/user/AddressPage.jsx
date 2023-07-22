import NavBar from "../../component/NavBar"
import Footer from "../../component/Footer"
import { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { PROVINCE_LIST } from "../../helper";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../../api/api";
import toast, { Toaster } from "react-hot-toast";
import { PencilSquareIcon, BackspaceIcon, ChevronLeftIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog, Transition } from '@headlessui/react'
import { useNavigate } from "react-router-dom";
import DrawerNewAddress from "../../component/DrawerNewAddress";
import DrawerEditAddress from "../../component/DrawerEditAddress";
import DeleteAddressModal from "../../component/DeleteAddressModal";
import Delivered from "../../component/Delivered";

export default function AddressPage() {
    const Navigate = useNavigate()
    const user = useSelector((state) => state.userSlice); 
    const branchId = useSelector((state) => state.branchSlice.branchId);
    const [address, setAddress] = useState([]);
    const [branch, setBranch] = useState([]);
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        async function fetchData() {
          try {
            const response = await api.get(`address/user/${user.id}`);
            const addressData = response.data.data;
            setAddress(addressData);

            const responseBranch = await api.get(`branch`);
            setBranch(responseBranch.data.data)
          } catch (error) {
            toast.error("Fetch data failed");
          }
        }
        fetchData();
    }, [user, branchId, update]);

    return (
        <>
            <NavBar/>
            <div className="mx-auto max-w-2xl py-1 px-4 sm:py-8 sm:px-6 md:max-w-4xl md:px-6 md:py-6 lg:max-w-7xl lg:px-8 md:py-6 bg-neutral-100">
                <div className="flex items-center">
                    <button onClick={()=>Navigate(-1)} class="font-medium flex-none mr-1">
                        <ChevronLeftIcon className="h-5 w-5 fill-white stroke-black stroke-2"/>
                    </button>
                    <strong className="text-lg font-bold sm:text-xl">Manage Address</strong>
                </div>
                <div className="flex-shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
                    <div className="flex justify-end space-x-3">
                        <Delivered addressData={address} branchsData={branch} addressPage={true}/>
                        <DrawerNewAddress/>
                    </div>
                </div>
                
                <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        {address.map((data) => (
                            <tbody>
                                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td class="px-6 py-4">
                                        <div className="font-bold">
                                            {data.label}
                                        </div>
                                        <div className="mt-1">
                                            {data.address_detail}
                                        </div>
                                        <div className="mt-1 font-medium">
                                            {`${data.city} - ${data.province}`}
                                        </div>
                                        {data.is_main==1 &&
                                            <div className="mt-1 font-medium">
                                                <span className="outline outline-2 outline-green-500 text-green-500 px-1">Main Address</span>
                                            </div>
                                        }
                                    </td>
                                    <td class="pl-6 py-4">
                                        <div class="flex items-center place-content-end">
                                            <DrawerEditAddress id={data.id}/>
                                        </div>
                                    </td>
                                    <td class="pr-6 py-4">
                                        <div class="flex items-center place-content-end">
                                            <DeleteAddressModal id={data.id}/>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                </div>
            </div>
            <Footer/>
        </>
    )
}
