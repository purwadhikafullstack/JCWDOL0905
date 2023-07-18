import NavBar from "../../component/NavBar";
import Footer from "../../component/Footer";
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
import ReceiveOrderModal from "../../component/ReceiveOrderModal";
import { rupiah, showVoucher } from "../../function";
import OrderInformation from "../../component/OrderInformation";

export default function OrderDetail() {
  const id = useParams().id;
  const Navigate = useNavigate();
  const user = useSelector((state) => state.userSlice);
  const branchId = useSelector((state) => state.branchSlice.branchId);
  const addressId = localStorage.getItem("addressId");
  const token = localStorage.getItem("token");
  const [carts, setCarts] = useState([]);
  const [order, setOrder] = useState({});
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
        if(user.id != orderData.id_user){Navigate('/404')}
        try{
          const response = await api.get(`transaction/item/${id}`);
          const itemData = response.data.data;
          setItem(itemData)
        }catch(error){
          toast.error(error.response.data.message);
        }
        setOrder(orderData);
        setTimer(countdown)
      } catch (error) {
        toast.error(error.response.data.message);
        Navigate('/404')
      }
    }
    fetchData();
  }, [user]);

  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {cancelOrder()}
    else {
      let h = hours.toString()
      let m = minutes.toString()
      let s = seconds.toString()
      if(h.length==1) h = "0" + h
      if(m.length==1) m = "0" + m
      if(s.length==1) s = "0" + s
      return (<p> Time Remaining: {h}:{m}:{s} </p>);}
  };

  const cancelOrder = async() => {
    try{
      const response = await api.patch(`order/cancel/${id}`)
      toast.success(response.data.message)
      window.location.href = `/order/${id}`
    }catch(error){toast.error(error.response.data.message);}
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
                              <img src={'https://img1.pngdownload.id/20180802/rpw/kisspng-bank-central-asia-logo-bca-finance-business-logo-bank-central-asia-bca-format-cdr-amp-pn-5b63687e24d811.5430623715332414701509.jpg'} alt="" className="self-center h-10 rounded-full mr-1"/>
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
                    {order.order_status=='shipped' &&
                      <div className="mt-6">
                        <ReceiveOrderModal id={id}/>
                      </div>
                    }
                    
                  <p className="mt-5 font-bold">Item List</p>
                  <ul role="list" className="divide-y divide-gray-200 border-t border-b border-gray-200">
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
                    <OrderInformation order={order}/>
                    {order.order_status=='waiting for payment' &&
                      <div className="mt-6 flex">
                        <CancelOrderModal id={id}/>
                      </div>
                    }
                  </dl>
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
