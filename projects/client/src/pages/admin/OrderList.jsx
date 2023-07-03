import { api } from "../../api/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function OrderList() {
    const [order, setOrder] = useState([]);

    useEffect(() => {
        async function fetchData() {
          try {
            const response = await api.get(`transaction`);
            const orderData = response.data.results;

            setOrder(orderData)
    
          } catch (error) {
            toast.error("Fetch data failed");
          }
        }
        fetchData();
    }, []);

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
                            <tr>
                                <th>Transaction Id</th>
                                <th>Date</th>
                                <th>Total Price</th>
                                <th>Shipping Fee</th>
                                <th>Voucher Discount</th>
                                <th>Final Price</th>
                                <th>Order Status</th>
                            </tr>
                        </thead>
                        {order.map((data) => (
                            <tbody>
                                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td>{data.id}</td>
                                    <td>{`${data.createdAt.slice(0,10)} ${data.createdAt.slice(11,19)}`}</td>
                                    <td>{rupiah(data.total_price)}</td>
                                    <td>{rupiah(data.shipping_fee)}</td>
                                    <td>{rupiah(data.voucher_discount_amount)}</td>
                                    <td>{rupiah(data.final_price)}</td>
                                    <td>{data.order_status}</td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                </div>
            </div>
        </>
    )
}