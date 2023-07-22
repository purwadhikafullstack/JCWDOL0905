import React, { useState, useRef, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, ChevronDownIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import chevrondown from "../assets/images/chevron-down.png"
import pin from "../assets/images/pin.png"
import { getDistance, sortBranch, sortAddress } from "../function";
import { api } from "../api/api";

export default function Delivered(props) {
    const Navigate = useNavigate()
    const token = localStorage.getItem("token")
    const branchsData = props.branchsData
    const addressData = props.addressData
    const [location, setLocation] = useState(localStorage.getItem("address"));
    const [userLocation, setUserLocation] = useState({});
    const [addressId, setAddressId] = useState()
    const [branchId, setBranchId] = useState(0);
    const [open, setOpen] = useState(false)

    const setAddress = async () => {
        let addressId = document.getElementById("address").value;
        if(addressId==0) return 0
        localStorage.setItem("addressId", addressId);
        var index = addressData.findIndex(item => item.id == addressId)
        sortBranch(addressData[index].latitude, addressData[index].longitude, branchsData)
        if(localStorage.getItem("branchId")==0) toast.error("The distance between the nearest store and the delivery location exceeds 30 km.");
        else toast.success("Successfully set address.");

        localStorage.setItem("address", addressData[index].city);
        setLocation(addressData[index].city)
        if(props.addressPage==true)Navigate('/address')
        else Navigate('/')
    }

    useEffect(() => {
        function setStoreBranchId() {
          try{
            if(addressData.length==0) localStorage.setItem("nearestAddressId", 0);
            else sortAddress(userLocation.latitude, userLocation.longitude, addressData)

            if(localStorage.getItem("branchId")==undefined) sortBranch(userLocation.latitude, userLocation.longitude, branchsData)
            if(localStorage.getItem("branchId")==0 && !token) sortBranch(userLocation.latitude, userLocation.longitude, branchsData)
            if(branchId==0)setBranchId(localStorage.getItem("branchId"))
            if(localStorage.getItem("address")==undefined || localStorage.getItem("address")=='undefined'){localStorage.setItem("address", userLocation.position);}
            if(props.addressPage==true)Navigate('/address')
            else Navigate('/')
          }catch(error){
            console.log("Set branch failed");
          }
        }
        setStoreBranchId();
    }, [branchId, addressData, branchsData, userLocation]);

    useEffect(() => {
        function getLocation() {
          navigator.geolocation.getCurrentPosition(
            async function (position) {
              const response = await api.get(`geo?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`);
              setUserLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                position:
                  response.data.data.components.city ||
                  response.data.data.components.county ||
                  response.data.data.components.municipality ||
                  response.data.data.formatted ||
                  "...",
              })    
            },
            (error) => console.log("Get current location failed"),
            { maximumAge: 5000, timeout: 5000, enableHighAccuracy: true }
          );
        }
        getLocation();
      }, []);

    return (
        <div>
            {props.addressPage == true ?
                <button type="button" onClick={() => setOpen(true)} className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center">
                    <p>Set Shipping Address</p>
                </button> :
                <div className="bg-white">
                    <div className="mx-auto max-w-7xl py-2 px-6 md:flex md:items-center md:justify-between lg:px-8">
                        <div className="mt-8 md:order-1 md:mt-0">
                            <div>
                                <p className="inline-flex my-2">
                                    <span className="inline-flex items-start">
                                        <img src={pin} alt="" className="self-center w-4 h-4 rounded-full mr-1" />
                                        <span>
                                            Delivered to <b>{location=='undefined' || !location ? userLocation.position : location}</b> &nbsp;&nbsp;
                                            <button>
                                                <img onClick={() => setOpen(true)} src={chevrondown} alt="" className="self-center w-3 h-3 rounded-full mx-1" />
                                            </button>
                                        </span>
                                        
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={setOpen}>
                    <div className="fixed inset-0" />

                    <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                        <Transition.Child as={Fragment} enter="transform transition ease-in-out duration-500 sm:duration-700" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition ease-in-out duration-500 sm:duration-700" leaveFrom="translate-x-0" leaveTo="translate-x-full">
                            <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                            <form className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                <div className="flex-1">
                                    <div className="bg-gray-50 px-4 py-6 sm:px-6">
                                        <div className="flex items-start justify-between space-x-3">
                                        <div className="space-y-1">
                                            <Dialog.Title className="text-lg font-medium text-gray-900">Set Shipping Address ({addressData.length} registered)</Dialog.Title>
                                            <p className="text-sm text-gray-500">
                                            Current location (approximately): {userLocation.position}
                                            </p>
                                        </div>
                                        <div className="flex h-7 items-center">
                                            <button
                                            type="button"
                                            className="text-gray-400 hover:text-gray-500"
                                            onClick={() => setOpen(false)}
                                            >
                                            <span className="sr-only">Close panel</span>
                                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                            </button>
                                        </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
                                        <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                                            <div>
                                                <label
                                                htmlFor="address"
                                                className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                                >
                                                Shipping Address
                                                </label>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <select
                                                name="address"
                                                id="address"
                                                onChange={(e) => setAddressId(e.target.value)}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                                >
                                                    <option key={0} value={0}>Select Address</option>
                                                    {addressData.map((address)=>{
                                                        return(<option key={address.id} selected={address.id==localStorage.getItem("addressId")} value={address.id}>{address.label} - {address.address_detail} - {address.city} {address.id == localStorage.getItem("nearestAddressId") ? "(Nearest)" : ""}</option>)
                                                    })}
                                                </select>
                                            </div>
                                            <div className="flex mt-5">
                                                <Cog6ToothIcon className="h-6 w-6"/>
                                                <a className="ml-3 underline" href="/address">Manage Address</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {addressData.length > 0 &&
                                    <div className="flex-shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
                                        <div className="flex justify-end space-x-3">
                                            <button type="button" className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2" onClick={() => setOpen(false)}>
                                                Cancel
                                            </button>
                                            <button type="button" className="inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2" onClick={() => setAddress()}>
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                }
                            </form>
                            </Dialog.Panel>
                        </Transition.Child>
                        </div>
                    </div>
                    </div>
                </Dialog>
                </Transition.Root>
            <Toaster/>
        </div>
    )
}
  