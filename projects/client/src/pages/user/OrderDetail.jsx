import NavBar from "../../component/NavBar";
import Footer from "../../component/Footer";
import {
  CheckIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
  PlusIcon,
  MinusIcon,
} from "@heroicons/react/20/solid";
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

export default function OrderDetail() {
  const id = useParams().id;
  const Navigate = useNavigate();
  const user = useSelector((state) => state.userSlice);
  const branchId = useSelector((state) => state.branchSlice.branchId);
  const addressId = localStorage.getItem("addressId");
  const token = localStorage.getItem("token");
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
        let countdown = new Date(orderData.updatedAt)
        countdown.setDate(countdown.getDate() + 1)

        if(user.id != orderData.id_user){
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
        setOrder(orderData);
        setTimer(countdown)
      } catch (error) {
        toast.error(error.response.data.message);
        Navigate('/404')
      }
    }
    fetchData();
  }, [user]);

  const rupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(number);
  };

  const TimerEnd = () => <span>Canceled</span>;

  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      cancelOrder()
      // return <TimerEnd />;
    } else {
      let h = hours.toString()
      let m = minutes.toString()
      let s = seconds.toString()
      if(h.length==1) h = "0" + h
      if(m.length==1) m = "0" + m
      if(s.length==1) s = "0" + s
      return (
        <p>
          Time Remaining: {h}:{m}:{s}
        </p>
      );
    }
  };

  const cancelOrder = async() => {
    try{
      const response = await api.patch(`order/cancel/${id}`)
      toast.success(response.data.message)
      window.location.href = `/order/${id}`
    }catch(error){
      toast.error(error.response.data.message);
    }
  }

  return (
    <>
      {user.id == order.id_user &&
        <div>
          <NavBar />
          <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
              <div className="flex items-center">
                  <button onClick={()=>Navigate('/order-history')} class="font-medium flex-none mr-1">
                      <ChevronLeftIcon className="h-5 w-5 fill-white stroke-black stroke-2"/>
                  </button>
                  <strong className="text-lg font-bold sm:text-xl">Order Summary</strong>
              </div>

              <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
                <section aria-labelledby="cart-heading" className="lg:col-span-7">
                  <h2 id="cart-heading" className="sr-only">
                    Items in your shopping cart
                  </h2>
                  
                  {order.order_status && <p>Status: <b>{order.order_status.toUpperCase()}</b></p> }

                    {order.order_status=='waiting for payment' && timer != null &&
                      <div>
                          <div className="shadow-md outline outline-offset-2 outline-gray-500 mx-2 my-2">
                          <p className="mx-1 my-1">Please pay <b>{rupiah(order.final_price)}</b> to:</p>
                          
                          <span className="inline-flex items-start px-1 py-1">
                              <img
                              src={'https://img1.pngdownload.id/20180802/rpw/kisspng-bank-central-asia-logo-bca-finance-business-logo-bank-central-asia-bca-format-cdr-amp-pn-5b63687e24d811.5430623715332414701509.jpg'}
                              alt=""
                              className="self-center h-10 rounded-full mr-1"
                              />
                              <span className="self-center"><b>{'1234 5678 90'}</b></span>
                          </span>
                          <p className="px-1 py-1">{' a/n '}<b>{'PT Groceria'}</b></p>
                      </div>
                        <Countdown date={timer} renderer={renderer}/>
                      </div>
                    }

                    {order.order_status=='waiting for payment' &&
                      <div className="mt-6 flex">
                        <UploadPaymentModal id={id}/>
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
                    Order Detail
                  </h2>

                  <dl className="mt-6 space-y-4">
                  <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-900">
                          Shipping Address
                      </label>
                      <div className="mt-1">
                          <textarea
                          id="address_detail"
                          name="address_detail"
                          readOnly
                          rows={3}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                          defaultValue={detail}
                          />
                      </div>
                  </div>
                  {/* <div>
                        <label htmlFor="shipping_service" className="block text-sm font-medium text-gray-900">
                            Shipping Service
                        </label>
                        <div className="mt-1">
                            <input
                            type="text"
                            name="shipping_service"
                            id="shipping_service"
                            readOnly
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                            >
                            </input>
                        </div>
                    </div> */}

                    {/* <div>
                        <label htmlFor="user_voucher" className="block text-sm font-medium text-gray-900">
                            Voucher
                        </label>
                        <div className="mt-1">
                            <input
                            name="user_voucher"
                            id="user_voucher"
                            readOnly
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                            >
                            </input>
                        </div>
                    </div> */}
                    
                    <div className="flex items-center justify-between">
                        <dt className="text-sm text-gray-600">Total Weight</dt>
                        <dd className="text-sm font-medium text-gray-900">{order.total_weight} gr</dd>
                    </div>
                    <div className="flex items-center justify-between">
                        <dt className="text-sm text-gray-600">Subtotal</dt>
                        <dd className="text-sm font-medium text-gray-900">{rupiah(order.total_price)}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                        <dt className="text-sm text-gray-600">Shipping Cost</dt>
                        <dd className="text-sm font-medium text-gray-900">{rupiah(order.shipping_fee)}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                        <dt className="text-sm text-gray-600">Voucher Discount</dt>
                        <dd className="text-sm font-medium text-gray-900">{rupiah(order.voucher_discount_amount)}</dd>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                      <dt className="text-base font-medium text-gray-900">
                        Final Price
                      </dt>
                      <dd className="text-base font-medium text-gray-900">
                        {rupiah(order.final_price)}
                      </dd>
                    </div>
                    {order.order_status=='waiting for payment' &&
                      <div className="mt-6 flex">
                        <CancelOrderModal id={id}/>
                      </div>
                    }
                  </dl>

                  {/* {shippingCost != null &&
                    <div className="mt-6">
                        <button
                        type="button"
                        onClick={()=>handleSubmit()}
                        className="w-full rounded-md border border-transparent bg-green-600 py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-green-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                        >
                          Continue Payment
                        </button>
                    </div>
                  } */}
                </section>
              </form>
            </div>
            <Toaster />
          </div>
          <Footer />
        </div>
      }
      
    </>
  );
}
