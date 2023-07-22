import NavBar from "./NavBar";
import Footer from "./Footer"
import { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../api/api";
import toast, { Toaster } from "react-hot-toast";
import { PencilSquareIcon, BackspaceIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon, XMarkIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { Dialog, Transition } from '@headlessui/react'
import { useNavigate } from "react-router-dom";

export default function UserOrder(props) {
    const Navigate = useNavigate()
    const user = useSelector((state) => state.userSlice); 
    const branchId = useSelector((state) => state.branchSlice.branchId);
    const [order, setOrder] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const searchParams = new URLSearchParams(document.location.search)

    useEffect(() => {
        async function fetchData() {
          try {
            let start = searchParams.get("start")
            let end = searchParams.get("end")
            let status = searchParams.get("status")
            let order_id = searchParams.get("order_id")
            let price = searchParams.get("price")
            let date = searchParams.get("date")
            let url = ''

            if(start) url += `&start=${start}`
            if(end) url += `&end=${end}`
            if(status) url += `&status=${status}`
            if(order_id) url += `&order_id=${order_id}`
            if(price) url += `&price=${price}`
            if(date) url += `&start=${date}`

            const response = await api.get(`transaction?page=${page}&id_user=${user.id}${url}`);
            const orderData = response.data.results;

            setOrder(orderData);
            setTotalPages(response.data.total_page);
    
          } catch (error) {
            toast.error("Fetch data failed");
          }
        }
        fetchData();
    }, [user, page, props.update]);

    const rupiah = (number)=>{
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR"
        }).format(number);
    }

    return (
        <>
            <div className="mx-auto max-w-2xl py-1 px-4 sm:py-8 sm:px-6 md:max-w-4xl md:px-6 md:py-6 lg:max-w-7xl lg:px-8 md:py-6 bg-neutral-100">                
                <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead>
                            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th class="px-6 py-4 font-bold">
                                    Id
                                </th>
                                <th class="px-6 py-4 font-bold">
                                    Order Date
                                </th>
                                <th class="px-6 py-4 font-bold">
                                    Status
                                </th>
                                <th class="px-6 py-4 font-bold">
                                    Shipping Address
                                </th>
                                <th class="px-6 py-4 font-bold">
                                    Total Payment
                                </th>
                                <th class="px-6 py-4 font-bold">
                                    Order Detail
                                </th>
                            </tr>
                        </thead>
                        {order.map((data) => (
                            <tbody>
                                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td class="px-6 py-4">
                                        <div className="mt-1">
                                            {data.id}
                                        </div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <div className="mt-1 italic">
                                            {`${data.createdAt.slice(0, 10)} (${data.createdAt.slice(11, 16)})`}
                                        </div>
                                    </td>
                                    <td class="px-6 py-4">
                                        {data.order_status=='waiting for payment' &&
                                            <div className="mt-1 text-blue-400 font-bold">
                                                {`${data.order_status.toUpperCase()}`}
                                            </div>
                                        }
                                        {data.order_status=='waiting for payment confirmation' &&
                                            <div className="mt-1 text-blue-600 font-bold">
                                                {`${data.order_status.toUpperCase()}`}
                                            </div>
                                        }
                                        {(data.order_status=='processed' || data.order_status=='shipped' || data.order_status=='done') &&
                                            <div className="mt-1 text-green-600 font-bold">
                                                {`${data.order_status.toUpperCase()}`}
                                            </div>
                                        }
                                        {data.order_status=='canceled' &&
                                            <div className="mt-1 text-red-400 font-bold">
                                                {`${data.order_status.toUpperCase()}`}
                                            </div>
                                        }
                                    </td>
                                    <td class="px-6 py-4">
                                        <div className="mt-1">
                                            {data.address_detail}
                                        </div>
                                        <div className="mt-1">
                                            {`${data.address_city.toUpperCase()} - ${data.address_province.toUpperCase()}`}
                                        </div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <div className="mt-1">
                                            {`${rupiah(data.final_price)}`}
                                        </div>

                                    </td>
                                    <td class="px-6 py-4">
                                        <div className="mt-1">
                                            <button type="button" onClick={() => Navigate(`/order/${data.id}`)}>
                                                <ArrowTopRightOnSquareIcon className="h-5 w-5" onClick={() => Navigate(`/order/${data.id}`)}/>
                                            </button>
                                        </div>

                                    </td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                </div>
                {totalPages>0 &&
                    <div className="flex justify-center text-center items-center">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page-1)}
                            type="button"
                            className="relative inline-flex items-center border border-gray-300 bg-white disabled:opacity-25 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                            <ChevronLeftIcon className="w-5 h-5" />
                        </button>
                        <span className="mx-3 items-center justify-center">
                            {`Page ${page} of ${totalPages}`}
                        </span>
                        <button
                            disabled={page >= totalPages}
                            type="button"
                            onClick={() => setPage(page+1)}
                            className="relative inline-flex items-center border border-gray-300 bg-white disabled:opacity-25 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                        >
                            <ChevronRightIcon className="w-5 h-5" />
                        </button>
                    </div>
                }
            </div>
            <Footer/>
        </>
    )
}
