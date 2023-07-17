import { api } from "../../api/api";
import toast, { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import pin from "../../assets/images/pin.png";
import Countdown from "react-countdown";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import CancelOrderModal from "../../component/CancelOrderModal";
import UploadPaymentModal from "../../component/UploadPaymentModal";
import AcceptPaymentModal from "../../component/AcceptPaymentModal";
import RejectPaymentModal from "../../component/RejectPaymentModal";
import ShipOrderModal from "../../component/ShipOrderModal";
import ShowImageFull from "../../component/ShowImageModal";
import Layout from "../../component/Layout";
import { showVoucher, rupiah } from "../../function";
import OrderInformation from "../../component/OrderInformation";

export default function DetailOrder() {
  const id = useParams().id;
  const Navigate = useNavigate();
  const role = useSelector((state) => state.adminSlice.role);
  const id_branch = useSelector((state) => state.adminSlice.id_branch);
  const [carts, setCarts] = useState([]);
  const [order, setOrder] = useState({});
  const [detail, setDetail] = useState("");
  const [item, setItem] = useState([]);
  const [timer, setTimer] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`transaction/${id}`);
        const orderData = response.data.data;
        console.log(orderData)
        console.log(role)
        console.log(id_branch)
        setOrder(orderData);

        if(id_branch != orderData.id_branch && role != 'SUPER_ADMIN'){
          Navigate('/404')
        }

        try{
          const response = await api.get(`transaction/item/${id}`);
          const itemData = response.data.data;
          setItem(itemData)
        }catch(error){
          toast.error(error.response.data.message);
        }

        setDetail(`${orderData.address_label} - ${orderData.address_detail} - ${orderData.address_city} - ${orderData.address_province}`)
      } catch (error) {
        toast.error(error.response.data.message);
        Navigate('/404')
      }
    }
    fetchData();
  }, [role, id_branch]);


  return (
    <>
        <Layout>
        <div>
          <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
              <div className="flex items-center">
                  <button onClick={()=>Navigate('/admin/orders')} class="font-medium flex-none mr-1">
                      <ChevronLeftIcon className="h-5 w-5 fill-white stroke-black stroke-2"/>
                  </button>
                  <strong className="text-lg font-bold sm:text-xl">Order Detail</strong>
              </div>

              <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
                <section aria-labelledby="cart-heading" className="lg:col-span-7">
                  <h2 id="cart-heading" className="sr-only">
                    Items in cart
                  </h2>
                  
                  {order.order_status && <p>Status: <b>{order.order_status.toUpperCase()}</b></p> }
                    {order.order_status=='waiting for payment confirmation' &&
                        <div className="mt-5">
                            <div className="flex-shrink-0">
                            <img
                                src={order.payment_proof}
                                alt={"payment proof"}
                                className="h-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                            />
                            </div>
                            <div className="mt-3">
                                <ShowImageFull image={order.payment_proof}/>
                            </div>
                        </div>
                    }

                    {order.order_status=='waiting for payment confirmation' &&
                      <div className="mt-6 flex">
                        <AcceptPaymentModal id={id}/>
                        <RejectPaymentModal id={id}/>
                      </div>
                    }
                    {order.order_status=='processed' &&
                      <div className="mt-6 flex">
                        <ShipOrderModal id={id}/>
                      </div>
                    }                    

                  <p className="mt-5 font-bold">Item List</p>

                  <ul
                    role="list"
                    className="divide-y divide-gray-200 border-t border-b border-gray-200"
                  >
                    {item.map((data) => (
                      <li key={data.id} className="flex py-6 sm:py-10">
                        <div className="flex-shrink-0">
                          <img
                            src={data.product_image}
                            alt={data.product_name}
                            className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                          />
                        </div>

                        <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                          <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                            <div>
                              <div className="flex justify-between">
                                <h3 className="text-sm">
                                  <a
                                    href={"#"}
                                    className="font-medium text-gray-700 hover:text-gray-800"
                                  >
                                    {data.product_name}
                                  </a>
                                </h3>
                              </div>
                              <div className="mt-1 flex text-sm">
                                <p className="text-gray-500">{data.weight} gr/item</p>
                              </div>
                              <p className="mt-1 text-sm font-medium text-gray-900">
                                {rupiah(data.product_price)}
                              </p>
                            </div>
                            <div className="mt-4 sm:mt-0 sm:pr-9"> 
                              <div class="flex items-center">
                                <div class="flex-none">
                                  x {data.product_qty}
                                </div>
                              </div>
                            </div>
                            {data.bonus_qty > 0 &&
                              <p className="mt-1 text-sm font-medium text-gray-900">
                                Bonus item: {data.bonus_qty} pcs
                              </p>
                            }
                            <div className="mt-4 flex text-sm">
                              <p className="text-gray-500">Stock: {data.stock}</p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>

                <section
                  aria-labelledby="summary-heading"
                  className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
                >
                  <h2
                    id="summary-heading"
                    className="text-lg font-medium text-gray-900"
                  >
                    Detail
                  </h2>

                  <dl className="mt-6 space-y-4">

                  {order.id != undefined && <OrderInformation order={order}/>}

                    {(order.order_status=='waiting for payment' || order.order_status=='waiting for payment confirmation' || order.order_status=='processed') &&
                      <div className="mt-6 flex">
                        <CancelOrderModal id={id} admin={true}/>
                      </div>
                    }
                  </dl>
                </section>
              </form>
            </div>
            <Toaster />
          </div>
        </div>
      </Layout>
    </>
  );
}
