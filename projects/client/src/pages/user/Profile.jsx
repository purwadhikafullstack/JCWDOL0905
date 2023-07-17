import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { Bars3Icon, EnvelopeIcon, PhoneIcon, DocumentDuplicateIcon, XMarkIcon, PencilSquareIcon, PencilIcon } from "@heroicons/react/24/outline";
import NavBar from "../../component/NavBar";
import Footer from "../../component/Footer";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import InsertReferralModal from "../../component/InsertReferralModal";
import ProfileInformation from "../../component/ProfileInformation";

export default function Profile() {
    const [profiles, setProfiles] = useState({});
    const [address, setAddress] = useState({})
    const [refVoucher, setRefVoucher] = useState(false)
    const Navigate = useNavigate();
    const user = useSelector((state) => state.userSlice)
    const addressId = localStorage.getItem("addressId")

    useEffect(() => {
        async function fetchData() {
        try {
            const response = await api.get(`profiles/${user.id}`);
            const profilesData = response.data.data;

            try{
                const response = await api.get(`profiles/voucher/${user.id}`)
                if(response.data.data != null) setRefVoucher(true)
            } catch(error){
                toast.error(error.response.data.message);
            }

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
            toast.error(error.response.data.message);
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
                        <svg className="absolute inset-0 h-full w-full" width={343} height={388} viewBox="0 0 343 388" fill="none" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                            <path
                            d="M-99 461.107L608.107-246l707.103 707.107-707.103 707.103L-99 461.107z"
                            fill="url(#linear1)"
                            fillOpacity=".1"
                            />
                            <defs>
                            <linearGradient id="linear1" x1="254.553" y1="107.554" x2="961.66" y2="814.66" gradientUnits="userSpaceOnUse">
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
                        <svg className="absolute inset-0 h-full w-full" width={359} height={339} viewBox="0 0 359 339" fill="none" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                            <path d="M-161 382.107L546.107-325l707.103 707.107-707.103 707.103L-161 382.107z" fill="url(#linear2)" fillOpacity=".1"/>
                            <defs>
                            <linearGradient id="linear2" x1="192.553" y1="28.553" x2="899.66" y2="735.66" gradientUnits="userSpaceOnUse">
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
                        <svg className="absolute inset-0 h-full w-full" width={160} height={678} viewBox="0 0 160 678" fill="none" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                            <path d="M-161 679.107L546.107-28l707.103 707.107-707.103 707.103L-161 679.107z" fill="url(#linear3)" fillOpacity=".1"/>
                            <defs>
                            <linearGradient id="linear3" x1="192.553" y1="325.553" x2="899.66" y2="1032.66" gradientUnits="userSpaceOnUse">
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
                        <dl className="mt-8 space-y-6">
                            <dt>
                                <span className="sr-only">Referal</span>
                            </dt>
                            <dd className="flex text-base text-teal-50">
                                <DocumentDuplicateIcon
                                className="h-6 w-6 flex-shrink-0 text-teal-200"
                                aria-hidden="true"
                                />
                                <span className="ml-3">Referral Code: {profiles.referral_code}</span>
                            </dd>
                        </dl>
                        <div className="mt-10">
                            <a className="text-teal-200 hover:text-teal-100 underline" href="/address">Manage Address</a>
                        </div>
                        <div className="mt-3">
                            <a className="text-teal-200 hover:text-teal-100 underline" href="/order-history">Order History</a>
                        </div>
                        <div className="mt-3">
                            <a className="text-teal-200 hover:text-teal-100 underline" href="/change-password">Change Password</a>
                        </div>
                        {!refVoucher &&
                            <div className="mt-3">
                                <InsertReferralModal id={user.id}/>
                            </div>
                        }
                    </div>

                    <ProfileInformation profiles={profiles}/>
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
