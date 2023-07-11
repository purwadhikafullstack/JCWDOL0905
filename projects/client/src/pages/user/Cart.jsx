import NavBar from "../../component/NavBar";
import Footer from "../../component/Footer";
import { CheckIcon, ClockIcon, QuestionMarkCircleIcon, XMarkIcon, PlusIcon, MinusIcon } from "@heroicons/react/20/solid";
import { api } from "../../api/api";
import toast, { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { countItem } from "../../redux/cartSlice";
import pin from "../../assets/images/pin.png"
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const Navigate = useNavigate()
  const user = useSelector((state) => state.userSlice);
  const branchId = useSelector((state) => state.branchSlice.branchId);
  const token = localStorage.getItem("token")
  const [carts, setCarts] = useState([]);
  const [update, setUpdate] = useState(false);
  const dispatch = useDispatch();

  function checkDiscount(item){
    const today = new Date()
    const start = new Date(item.start_date)
    const end = new Date(item.end_date)

    if(start <= today && end >= today && item.product_qty >= item.min_purchase_qty){
      if(item.discount_type == 'percentage' || item.discount_type == 'amount'){
        return true
      }
    }

    return false
  }

  function showDiscount(item){
    if(item.discount_type == 'amount'){
      return item.product_price - item.discount_value
    } else if(item.discount_type == 'percentage'){
      return item.product_price - (item.discount_value/100 * item.product_price)
    }
  }

  async function countCart() {
    try {
      const response = await api.get(`cart/count`, {
          'headers': {
              'Authorization': `Bearer ${token}`
          }
      });

      dispatch(
        countItem({
          count: response.data.data,
        })
      );
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`cart`, {
            'headers': {
                'Authorization': `Bearer ${token}`
            }
        });
        const cartData = response.data.results;

        setCarts(cartData);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
    fetchData();
  }, [user, branchId, update]);

  function getTotalPrice(){
    let sum = 0;
    for(let item of carts){
      if(checkDiscount(item)){
        sum += (showDiscount(item) * item.product_qty)
      } else {
        sum += (item.product_price * item.product_qty)
      }
    }
    return sum
  }

  function getTotalWeight(){
    let sum = 0;
    for(let item of carts){
        sum += (item.weight * item.product_qty)
    }
    return sum
  }

  async function updateQty(id, num){
    try {
      const response = await api.patch(`cart/${id}`, {num});
      toast.success(response.data.message);
      setUpdate(Math.random())
      countCart()
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function deleteItem(id){
    try {
      const response = await api.delete(`cart/${id}`);
      toast.success(response.data.message);
      setUpdate(Math.random())
      countCart()
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  const rupiah = (number)=>{
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR"
    }).format(number);
  }

  return (
    <>
      <NavBar />
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <h3 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
            Items on Cart
          </h3>
          <span className="inline-flex items-start">
            {carts.length>0 ? <img src={pin} alt="" className="self-center w-4 h-4 rounded-full mr-1" /> : ""}
            <span>
              {carts.length>0 ? `${carts[0].branch_name} (${carts[0].city})` : ""}
            </span>
          </span>
        
          <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            <section aria-labelledby="cart-heading" className="lg:col-span-7">
              <h2 id="cart-heading" className="sr-only">
                Items in your shopping cart
              </h2>

              <ul
                role="list"
                className="divide-y divide-gray-200 border-t border-b border-gray-200"
              >
                {carts.map((item) => (
                  <li key={item.id} className="flex py-6 sm:py-10">
                    <div className="flex-shrink-0">
                      <img
                        src={item.product_image}
                        alt={item.product_name}
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
                                {item.product_name}
                              </a>
                            </h3>
                          </div>
                          <div className="mt-1 flex text-sm">
                            <p className="text-gray-500">{item.weight} gr/item</p>
                          </div>
                          {checkDiscount(item) ?
                            <div>
                              <p className="mt-1 text-sm font-medium text-gray-900 line-through">
                                {rupiah(item.product_price)}
                              </p>
                              <p className="mt-1 text-sm font-medium text-gray-900">
                                {rupiah(showDiscount(item))}
                              </p>
                            </div>
                          : 
                          <p className="mt-1 text-sm font-medium text-gray-900">
                             {rupiah(item.product_price)}
                          </p>
                          }
                          
                        </div>

                        <div className="mt-4 sm:mt-0 sm:pr-9">
                          <div class="flex items-center">
                            <a class="flex-none mr-3">
                              <PlusIcon onClick={() => updateQty(item.id, 1)} className="h-3 w-3 fill-gray-500 hover:fill-gray-700 outline outline-offset-2 outline-1" aria-hidden="true"/>
                            </a>
                            <div class="flex-none">
                              {item.product_qty}
                            </div>
                            <a class="flex-none ml-3">
                              <MinusIcon onClick={() => updateQty(item.id, -1)}className="h-3 w-3 fill-gray-500 hover:fill-gray-700 outline outline-offset-2 outline-1" aria-hidden="true"/>
                            </a>
                          </div>

                          <div className="absolute top-0 right-0">
                            <button
                              type="button"
                              className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                              onClick={() => deleteItem(item.id)}
                            >
                              <span className="sr-only">Remove</span>
                              <XMarkIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                        <CheckIcon
                        className="h-5 w-5 flex-shrink-0 text-green-500"
                        aria-hidden="true"
                        />

                        <span>
                            Stock: {item.stock}
                        </span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Order summary */}
            <section
              aria-labelledby="summary-heading"
              className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
            >
              <h2
                id="summary-heading"
                className="text-lg font-medium text-gray-900"
              >
                Order Total
              </h2>

              <dl className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-600">Total Weight</dt>
                    <dd className="text-sm font-medium text-gray-900">{getTotalWeight()} gr</dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="text-base font-medium text-gray-900">
                    Total Price
                  </dt>
                  <dd className="text-base font-medium text-gray-900">
                    {rupiah(getTotalPrice())}
                  </dd>
                </div>
              </dl>

              {carts.length > 0 &&
                <div className="mt-6">
                  <button
                    onClick={()=> Navigate('/order')}
                    type="submit"
                    className="w-full rounded-md border border-transparent bg-green-600 py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                  >
                    Checkout
                  </button>
                </div>
              }
            </section>
          </form>
        </div>
        <Toaster/>
      </div>
      <Footer />
    </>
  );
}
