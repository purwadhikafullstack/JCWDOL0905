import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  EnvelopeIcon,
  PhoneIcon,
  XMarkIcon,
  MinusIcon,
  PencilIcon
} from "@heroicons/react/24/outline";
import NavBar from "../../component/NavBar";
import Footer from "../../component/Footer";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import default_picture from "../../assets/images/default.jpg"

export default function Profile() {
    const [profiles, setProfiles] = useState({});
    const [address, setAddress] = useState({})
    const Navigate = useNavigate();
    const user = useSelector((state) => state.userSlice)
    const addressId = localStorage.getItem("addressId")

    useEffect(() => {
        async function fetchData() {
        try {
            const response = await api.get(`profiles/${user.id}`);
            const profilesData = response.data.data;

            if(addressId){
                const responseAddress = await api.get(`address/${addressId}`);
                const addressData = responseAddress.data.data;
                setAddress(addressData)
            }

            var birthdate = new Date(profilesData.birthdate.slice(0, 10));

            let yyyy = birthdate.getFullYear();
            let mm = birthdate.getMonth() + 1;
            let dd = birthdate.getDate();

            if (dd < 10) dd = "0" + dd;
            if (mm < 10) mm = "0" + mm;

            const formattedDate = yyyy + "-" + mm + "-" + dd;
            profilesData.birthdate = formattedDate;

            setProfiles(profilesData);
        } catch (error) {
            // toast.error(error.response.data.message);
            console.log(error.response.data.message)
        }
        }
        fetchData();
    }, [user]);

    return (
        <>
        <NavBar />
        <div className="bg-white">
            <main className="overflow-hidden">
            {/* Contact section */}
            <section
                className="relative bg-white"
                aria-labelledby="contact-heading"
            >
                <div
                className="absolute h-1/2 w-full bg-warm-gray-50"
                aria-hidden="true"
                />
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="relative bg-white shadow-xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Contact information */}
                    <div className="relative overflow-hidden bg-gradient-to-b from-teal-500 to-teal-600 py-10 px-6 sm:px-10 xl:p-12">
                        {/* Decorative angle backgrounds */}
                        <div
                        className="pointer-events-none absolute inset-0 sm:hidden"
                        aria-hidden="true"
                        >
                        <svg
                            className="absolute inset-0 h-full w-full"
                            width={343}
                            height={388}
                            viewBox="0 0 343 388"
                            fill="none"
                            preserveAspectRatio="xMidYMid slice"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                            d="M-99 461.107L608.107-246l707.103 707.107-707.103 707.103L-99 461.107z"
                            fill="url(#linear1)"
                            fillOpacity=".1"
                            />
                            <defs>
                            <linearGradient
                                id="linear1"
                                x1="254.553"
                                y1="107.554"
                                x2="961.66"
                                y2="814.66"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#fff" />
                                <stop offset={1} stopColor="#fff" stopOpacity={0} />
                            </linearGradient>
                            </defs>
                        </svg>
                        </div>
                        <div
                        className="pointer-events-none absolute top-0 right-0 bottom-0 hidden w-1/2 sm:block lg:hidden"
                        aria-hidden="true"
                        >
                        <svg
                            className="absolute inset-0 h-full w-full"
                            width={359}
                            height={339}
                            viewBox="0 0 359 339"
                            fill="none"
                            preserveAspectRatio="xMidYMid slice"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                            d="M-161 382.107L546.107-325l707.103 707.107-707.103 707.103L-161 382.107z"
                            fill="url(#linear2)"
                            fillOpacity=".1"
                            />
                            <defs>
                            <linearGradient
                                id="linear2"
                                x1="192.553"
                                y1="28.553"
                                x2="899.66"
                                y2="735.66"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#fff" />
                                <stop offset={1} stopColor="#fff" stopOpacity={0} />
                            </linearGradient>
                            </defs>
                        </svg>
                        </div>
                        <div
                        className="pointer-events-none absolute top-0 right-0 bottom-0 hidden w-1/2 lg:block"
                        aria-hidden="true"
                        >
                        <svg
                            className="absolute inset-0 h-full w-full"
                            width={160}
                            height={678}
                            viewBox="0 0 160 678"
                            fill="none"
                            preserveAspectRatio="xMidYMid slice"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                            d="M-161 679.107L546.107-28l707.103 707.107-707.103 707.103L-161 679.107z"
                            fill="url(#linear3)"
                            fillOpacity=".1"
                            />
                            <defs>
                            <linearGradient
                                id="linear3"
                                x1="192.553"
                                y1="325.553"
                                x2="899.66"
                                y2="1032.66"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#fff" />
                                <stop offset={1} stopColor="#fff" stopOpacity={0} />
                            </linearGradient>
                            </defs>
                        </svg>
                        </div>
                        {addressId == undefined &&
                            <div>
                                <h3 className="text-lg font-medium text-white">Shipping Address</h3>
                                <p className="max-w-3xl text-base text-teal-50"><b>Shipping address has not been set</b></p>
                            </div>
                        }
                        {addressId != undefined &&
                            <div>
                                <h3 className="text-lg font-medium text-white">Shipping Address</h3>
                                <p className="max-w-3xl text-base text-teal-50"><b>{address.label}</b></p>
                                <p className="max-w-3xl text-base text-teal-50">{address.address_detail}</p>
                                <p className="max-w-3xl text-base text-teal-50">{address.city} - {address.province}</p>
                            </div>
                        }
                        <dl className="mt-8 space-y-6">
                            <dt>
                                <span className="sr-only">Phone number</span>
                            </dt>
                            <dd className="flex text-base text-teal-50">
                                <PhoneIcon
                                className="h-6 w-6 flex-shrink-0 text-teal-200"
                                aria-hidden="true"
                                />
                                <span className="ml-3">{profiles.phone_number}</span>
                            </dd>
                        </dl>
                        <ul role="list" className="mt-8 flex space-x-12">
                            <li>
                                <a className="text-teal-200 hover:text-teal-100 underline" href="#">Manage Address</a>
                            </li>
                            <li>
                                <a className="text-teal-200 hover:text-teal-100 underline" href="change-password">Change Password</a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact form */}
                    <div className="py-10 px-6 sm:px-10 lg:col-span-1 xl:p-12">
                        <div class="flex items-center">
                            <div class="items-center text-lg font-medium text-warm-gray-900">
                              Profile
                            </div>
                            <a href="/edit-profile">
                                <div class="ml-3 items-center">
                                <PencilIcon className="h-5 w-5 fill-white" aria-hidden="true"/>
                                </div>
                            </a>
                        </div>
                        <form
                        action="#"
                        method="POST"
                        className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8"
                        >
                        <div className="sm:col-span-2">
                            <label
                            htmlFor="profile-picture"
                            className="block text-sm font-medium text-warm-gray-900"
                            >
                            Profile Picture
                            </label>
                            <div className="mt-1">
                                <img src={profiles.profile_picture ? profiles.profile_picture : default_picture} className="rounded-full h-20 w-20"></img>
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <label
                            htmlFor="subject"
                            className="block text-sm font-medium text-warm-gray-900"
                            >
                            Name
                            </label>
                            <div className="mt-1">
                            <input
                                type="text"
                                name="name"
                                id="name"
                                defaultValue={profiles.name}
                                className="block w-full rounded-md border-warm-gray-300 py-3 px-4 text-warm-gray-900 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                readOnly
                            />
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <label
                            htmlFor="subject"
                            className="block text-sm font-medium text-warm-gray-900"
                            >
                            Email
                            </label>
                            <div className="mt-1">
                            <input
                                type="text"
                                name="email"
                                id="email"
                                defaultValue={profiles.email}
                                className="block w-full rounded-md border-warm-gray-300 py-3 px-4 text-warm-gray-900 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                readOnly
                            />
                            </div>
                        </div>
                        <div>
                            <label
                            htmlFor="first-name"
                            className="block text-sm font-medium text-warm-gray-900"
                            >
                            Gender
                            </label>
                            <div className="mt-1">
                            <input
                                type="text"
                                name="gender"
                                id="first-namegender"
                                defaultValue={profiles.gender}
                                autoComplete="given-name"
                                className="block w-full rounded-md border-warm-gray-300 py-3 px-4 text-warm-gray-900 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                readOnly
                            />
                            </div>
                        </div>
                        <div>
                            <label
                            htmlFor="last-name"
                            className="block text-sm font-medium text-warm-gray-900"
                            >
                            Birthdate
                            </label>
                            <div className="mt-1">
                            <input
                                type="date"
                                name="birthdate"
                                id="birthdate"
                                defaultValue={profiles.birthdate}
                                autoComplete="family-name"
                                className="block w-full rounded-md border-warm-gray-300 py-3 px-4 text-warm-gray-900 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                                readOnly
                            />
                            </div>
                        </div>
                        <div className="sm:col-span-2 sm:flex sm:justify-end">
                            {/* <button
                                    type="submit"
                                    className="mt-2 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-teal-500 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:w-auto"
                                >
                                    Submit
                                </button> */}
                        </div>
                        </form>
                    </div>
                    </div>
                </div>
                </div>
            </section>
            </main>
        </div>
        <Footer />
        </>
    );
}
