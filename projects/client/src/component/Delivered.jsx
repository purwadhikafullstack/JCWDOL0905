import React, { useState, useRef, useEffect, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import chevrondown from "../assets/images/chevron-down.png"
import pin from "../assets/images/pin.png"

export default function Delivered(props) {
    const Navigate = useNavigate()
    const dispatch = useDispatch()
    const branchsData = props.branchsData
    const addressData = props.addressData
    const currentLocation = props.currentLocation

    const usrLocation = currentLocation.userLocation
    const usrLat = currentLocation.userLat
    const usrLng = currentLocation.userLng

    const [location, setLocation] = useState(localStorage.getItem("address"));
    const [addressId, setAddressId] = useState()
    const [branchId, setBranchId] = useState(0);
    const [open, setOpen] = useState(false)

    function getDistance(lat1, lon1, lat2, lon2, unit) {
        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        }
        else {
            var radlat1 = Math.PI * lat1/180;
            var radlat2 = Math.PI * lat2/180;
            var theta = lon1-lon2;
            var radtheta = Math.PI * theta/180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180/Math.PI;
            dist = dist * 60 * 1.1515;
            if (unit=="K") { dist = dist * 1.609344 }
            if (unit=="N") { dist = dist * 0.8684 }
            return dist;
        }
    }

    function sortAddress(lat, lng){
        for(let i=0; i<addressData.length; i++){
            let dist = getDistance(parseFloat(lat), parseFloat(lng), parseFloat(addressData[i].latitude), parseFloat(addressData[i].longitude), "K").toFixed(2);
            addressData[i].distance = dist;
        }
          
        let sortedArr = addressData.sort(function(a,b) {return a.distance - b.distance});
        localStorage.setItem("nearestAddressId", sortedArr[0].id);
    }

    function sortBranch(lat, lng, update=true){
        for(let i=0; i<branchsData.length; i++){
            let dist = getDistance(parseFloat(lat), parseFloat(lng), parseFloat(branchsData[i].latitude), parseFloat(branchsData[i].longitude), "K").toFixed(2);
            branchsData[i].distance = dist;
        }
          
        let sortedArr = branchsData.sort(function(a,b) {return a.distance - b.distance});

        if(update){
            if(sortedArr[0].distance > 30){
                localStorage.setItem("branchId", 0);
                toast.error("The distance between the nearest store and the delivery location exceeds 30 km.");
            }else{
                localStorage.setItem("branchId", sortedArr[0].id);
                toast.success("Successfully set address.");
            }
            
        }else{
            return sortedArr[0]
        }
        
    }

    const setAddress = async () => {
        let addressId = document.getElementById("address").value;
        localStorage.setItem("addressId", addressId);
        var index = addressData.findIndex(item => item.id == addressId)
        sortBranch(addressData[index].latitude, addressData[index].longitude)

        localStorage.setItem("address", addressData[index].city);
        setLocation(addressData[index].city)
        setTimeout(() => {Navigate('/')}, 500);
    }

    useEffect(() => {
        function setStoreBranchId() {
          try{
            if(addressData.length==0){
                localStorage.setItem("nearestAddressId", 0);
            }else{
                sortAddress(usrLat, usrLng)
            }

            if(localStorage.getItem("branchId")==undefined){
                sortBranch(usrLat, usrLng)
            }
    
            if(branchId==0){
                setBranchId(localStorage.getItem("branchId"))
                // setTimeout(() => {Navigate('/')}, 1000);
            }

            if(localStorage.getItem("address")==undefined){
                localStorage.setItem("address", usrLocation);
            }
          }catch(error){
            toast.error("Set branch failed");
          }
        }
        setStoreBranchId();
    }, [branchId, addressData, branchsData]);

    return (
        <div>
            <div className="bg-white">
                <div className="mx-auto max-w-7xl py-2 px-6 md:flex md:items-center md:justify-between lg:px-8">
                    <div className="mt-8 md:order-1 md:mt-0">
                        <div>
                            <p className="inline-flex my-2">
                                <span className="inline-flex items-start">
                                    <img src={pin} alt="" className="self-center w-4 h-4 rounded-full mr-1" />
                                    <span>
                                        Delivered to <b>{location ? location : usrLocation}</b> &nbsp;&nbsp;
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
            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={setOpen}>
                    <div className="fixed inset-0" />

                    <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                        <Transition.Child
                            as={Fragment}
                            enter="transform transition ease-in-out duration-500 sm:duration-700"
                            enterFrom="translate-x-full"
                            enterTo="translate-x-0"
                            leave="transform transition ease-in-out duration-500 sm:duration-700"
                            leaveFrom="translate-x-0"
                            leaveTo="translate-x-full"
                        >
                            <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                            <form className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                <div className="flex-1">
                                {/* Header */}
                                <div className="bg-gray-50 px-4 py-6 sm:px-6">
                                    <div className="flex items-start justify-between space-x-3">
                                    <div className="space-y-1">
                                        <Dialog.Title className="text-lg font-medium text-gray-900">Set Shipping Address ({addressData.length} registered)</Dialog.Title>
                                        <p className="text-sm text-gray-500">
                                        Current location (approximately): {usrLocation}
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

                                {/* Divider container */}
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
                                            {addressData.map((address)=>{
                                                return(
                                                    <option key={address.id} selected={address.id==localStorage.getItem("addressId")} value={address.id}>{address.label} - {address.address_detail} - {address.city} {address.id == localStorage.getItem("nearestAddressId") ? "(Nearest)" : ""}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                    </div>

                                    {/* {addressData.length > 0 &&
                                        <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                                            <div>
                                                <label
                                                htmlFor="address-detail"
                                                className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                                >
                                                Address Detail
                                                </label>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <textarea
                                                id="address-detail"
                                                name="address-detail"
                                                rows={3}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                                defaultValue={''}
                                                readOnly
                                                />
                                            </div>
                                        </div>
                                    }

                                    {addressData.length > 0 &&
                                        <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
                                            <div>
                                                <label
                                                htmlFor="branch"
                                                className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                                                >
                                                Nearest Store Branch
                                                </label>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <input
                                                type="text"
                                                name="branch"
                                                id="branch"
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                                readOnly
                                                />
                                            </div>
                                        </div>
                                    } */}

                                </div>
                                </div>

                                {/* Action buttons */}
                                {addressData.length > 0 &&
                                    <div className="flex-shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
                                        <div className="flex justify-end space-x-3">
                                            <button
                                            type="button"
                                            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                            onClick={() => setOpen(false)}
                                            >
                                            Cancel
                                            </button>
                                            <button
                                                type="button"
                                                className="inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                                onClick={() => setAddress()}
                                                >
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
  