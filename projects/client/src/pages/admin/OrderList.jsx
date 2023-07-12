import { api } from "../../api/api";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Layout from "../../component/Layout";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useSelector } from "react-redux";
import ModalFilterOrder from "../../component/ModalFilterOrder";

export default function OrderList() {
    const navigate = useNavigate()
    const searchParams = new URLSearchParams(document.location.search)
    const [order, setOrder] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [branchId, setBranchId] = useState(0);
    const [branchDetail, setBranchDetail] = useState();
    const [branch, setBranch] = useState();
    const role = useSelector((state) => state.adminSlice.role);
    const id_branch = useSelector((state) => state.adminSlice.id_branch);

    useEffect(() => {
        async function fetchData() {
          try {
            let data = {}

            if(searchParams.get("start")) data.start = searchParams.get("start")
            if(searchParams.get("end")) data.end = searchParams.get("end")
            if(searchParams.get("status")) data.status = searchParams.get("status")
            if(searchParams.get("date")) data.date = searchParams.get("date")
            if(searchParams.get("price")) data.price = searchParams.get("price")

            let url = `transaction?page=${page}`
            if(branchId!=0) url += `&id_branch=${branchId}`
            if(data.start) url += `&start=${data.start}`
            if(data.end) url += `&end=${data.end}`
            if(data.status) url += `&status=${data.status}`
            if(data.date) url += `&date=${data.date}`
            if(data.price) url += `&price=${data.price}`

            console.log("url:", url)

            const response = await api.get(url);
            const orderData = response.data.results;

            if(id_branch){
                const responseDetail = await api.get(`branch/${id_branch}`)
                const branchDetail = responseDetail.data.data
                setBranchDetail(branchDetail)
                setBranchId(id_branch)
            }

            const responseBranch = await api.get(`branch`)
            setBranch(responseBranch.data.data)

            setOrder(orderData)
            setTotalPages(response.data.total_page)
    
          } catch (error) {
            toast.error("Fetch data failed");
          }
        }
        fetchData();
    }, [page, branchId, navigate]);

    const rupiah = (number)=>{
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR"
        }).format(number);
    }

    return (
        <>
            <Layout>
            <div className="flex min-w-screen min-h-screen">
                <Toaster />
                <div className="flex mx-auto rounded-md w-full max-w-xl max-h-5xl px-2 bg-white md:w-full md:px-4 lg:w-full lg:max-w-7xl lg:h-7xl lg:px-0">
                    <div className="w-full lg:w-full p-4 lg:p-8 justify-start ">
                        <div className="flex justify-between items-center my-3 mb-8">
                            <h2>Order List</h2>
                        </div>
                        <div className="flex-shrink-0 border-t border-gray-200 py-5">
                            {branchDetail && <p className="font-bold">Store Branch: {`${branchDetail.branch_name} (${branchDetail.city})`}</p>}
                            <div className="flex justify-end">
                                {role == 'SUPER_ADMIN' && branch != undefined &&
                                    <select
                                    name="branch"
                                    id="branch"
                                    onChange={(e) => setBranchId(e.target.value)}
                                    className="mx-2 block w-fit rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm font-bold"
                                    >
                                        <option key={'all'} value={0}>All Branchs</option>
                                        {branch.map((data)=>{
                                            return(
                                                <option key={data.id} value={data.id}>{data.branch_name}</option>
                                            )
                                        })}
                                    </select>
                                }
                                <ModalFilterOrder/>
                            </div>
                        </div>

                        {order.length == 0 ?
                            <div>No Result</div> :
                            <div>
                                <div className="flex flex-col">
                                    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                                        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                                        <div className="overflow-hidden">
                                            <table className="min-w-full text-left text-md font-light">
                                                <thead className="border-b font-medium dark:border-neutral-500">
                                                    <tr>
                                                        <th scope="col" className="pr-6 py-4">
                                                            Id
                                                        </th>
                                                        <th scope="col" className="px-6 py-4">
                                                            Branch
                                                        </th>
                                                        <th scope="col" className="px-6 py-4">
                                                            Date
                                                        </th>
                                                        <th scope="col" className="px-6 py-4" colspan="2">
                                                            Price Detail
                                                        </th>
                                                        <th scope="col" className="px-6 py-4">
                                                            Order Status
                                                        </th>
                                                        <th scope="col" className="pl-4 py-4">
                                                            Action
                                                        </th>
                                                    </tr>
                                                </thead>
                                                
                                                <tbody>
                                                    {order.map((data) => (
                                                            <tr className="border-b dark:border-neutral-500">
                                                                <td className="whitespace-nowrap pr-6 py-4 font-medium align-top font-semibold">{data.id}</td>
                                                                <td className="whitespace-nowrap px-6 py-4 align-top font-semibold">{data.branch_name}</td>
                                                                <td className="whitespace-nowrap px-6 py-4 align-top">{`${data.createdAt.slice(0,10)} ${data.createdAt.slice(11,19)}`}</td>
                                                                <td className="whitespace-nowrap pl-6 pr-1 py-4 font-semibold">
                                                                    <div>
                                                                        Subtotal
                                                                    </div>
                                                                    <div className="mt-2 font-semibold">
                                                                        Shipping Fee
                                                                    </div>
                                                                    {data.voucher_discount_amount !=0 &&
                                                                        <div className="mt-2 font-semibold">
                                                                            Voucher Discount
                                                                        </div>
                                                                    }
                                                                    <div className="mt-2 font-semibold">
                                                                        Final Price
                                                                    </div>
                                                                </td>
                                                                <td className="whitespace-nowrap pl-1 pr-6 py-4">
                                                                    <div>
                                                                        {rupiah(data.total_price)}
                                                                    </div>
                                                                    <div className="mt-2">
                                                                        {rupiah(data.shipping_fee)}
                                                                    </div>
                                                                    {data.voucher_discount_amount !=0 &&
                                                                        <div className="mt-2">
                                                                            {rupiah(data.voucher_discount_amount)}
                                                                        </div>
                                                                    }
                                                                    <div className="mt-2 font-semibold">
                                                                        {rupiah(data.final_price)}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 font-semibold align-top">{data.order_status}</td>
                                                                <td className="whitespace-nowrap px-4 py-4 align-top"><a href={`/admin/orders/${data.id}`}>See Details</a></td>
                                                            </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center text-center items-center">
                                    <button
                                        disabled={page === 1}
                                        onClick={() => setPage(page-1)}
                                        type="button"
                                        className="relative inline-flex items-center border border-gray-300 bg-white disabled:bg-gray-500 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
                                        className="relative inline-flex items-center border border-gray-300 bg-white disabled:bg-gray-500 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    >
                                        <ChevronRightIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        }

                        

                    </div>
                </div>
            </div>
            </Layout>
        </>
    )
}