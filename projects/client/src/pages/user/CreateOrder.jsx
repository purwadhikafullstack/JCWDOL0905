import NavBar from "../../component/NavBar";
import Footer from "../../component/Footer";
import { CheckIcon, ClockIcon, QuestionMarkCircleIcon, XMarkIcon, PlusIcon, MinusIcon } from "@heroicons/react/20/solid";
import { api } from "../../api/api";
import toast, { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import pin from "../../assets/images/pin.png"

export default function CreateOrder() {
  const Navigate = useNavigate()
  const user = useSelector((state) => state.userSlice);
  const branchId = useSelector((state) => state.branchSlice.branchId);
  const addressId = localStorage.getItem("addressId")
  const token = localStorage.getItem("token")
  const [carts, setCarts] = useState([]);
  const [addressDetail, setAddressDetail] = useState({});
  const [detail, setDetail] = useState({});
  const [voucher, setVoucher] = useState([]);
  const [voucherId, setVoucherId] = useState(0);
  const [voucherValue, setVoucherValue] = useState(0);
  const [service, setService] = useState([]);
  const [serviceId, setServiceId] = useState(1);
  const [shippingCost, setShippingCost] = useState();
  const [index, setIndex] = useState(0);
  const [update, setUpdate] = useState(false)
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

  useEffect(() => {
    async function fetchData() {
      if(branchId == 0){
        toast.error("The distance between the nearest store and the delivery location exceeds 30 km.")
        setTimeout(() => {Navigate('/')}, 500)
      }

      try {
        const response = await api.get(`cart`, {
            'headers': {
                'Authorization': `Bearer ${token}`
            }
        });
        const cartData = response.data.results;

        try{
          const response = await api.get(`address/${addressId}`);
          const addressDetail = response.data.data;
          setAddressDetail(addressDetail);

          setDetail(`${addressDetail.label} - ${addressDetail.address_detail} - ${addressDetail.city} - ${addressDetail.province}`)
        }catch(error){
          toast.error(error.response.data.message);

        }

        try{
          const response = await api.get(`voucher/user`, {
            'headers': {
                'Authorization': `Bearer ${token}`
            }
          });
          const voucherData = response.data.results

          setVoucher(voucherData)
        }catch(error){
          toast.error(error.response.data.message);

        }

        try{
            const response = await api.get(`shipping`);
            const serviceData = response.data.data;

            setService(serviceData)
        }catch(error){
            toast.error(error.response.data.message);

        }

        setCarts(cartData);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
    fetchData();
  }, [user, branchId]);

  useEffect(() => {
    async function calculateCost() {
      try {
        if(branchId != carts[0].id_branch){
          toast.error("The branch location on cart not the same as current branch location")
          setTimeout(() => {Navigate('/')}, 500)
        }
        const data = {
            branchId: carts[0].id_branch,
            addressId,
            orderWeight: getTotalWeight(),
            serviceId
        }
        const response = await api.post(`shipping`, data);
        setShippingCost(response.data.data.cost[0].value)

      } catch (error) {
        setShippingCost(null)
        toast.error(error.response.data.message);
      }
    }
    calculateCost();
  }, [serviceId, carts, update]);

  useEffect(()=>{
    async function updateVoucherValue(){
      setVoucherValue(calculateVoucher())
    }
    updateVoucherValue()
  }, [shippingCost, voucherId])

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

  function showVoucher(item){
    let text = ""
    if(item.voucher_type=="total purchase"){
      if(item.voucher_kind=='amount'){
        text += `Voucher Discount ${rupiah(item.voucher_value)}. `
      }else if(item.voucher_kind=='percentage'){
        text += `Voucher Discount ${item.voucher_value}%. `
      }

      if(item.max_discount!=null){
        text += `Max Disc ${rupiah(item.max_discount)}. `
      }
      if(item.min_purchase_amount!=null){
        text += `Min Purchase ${rupiah(item.min_purchase_amount)}. `
      }
      return text
    }else if(item.voucher_type=="shipping"){
      if(item.voucher_kind=='amount'){
        text += `Voucher Shipping Cost ${rupiah(item.voucher_value)}. `
      }else if(item.voucher_kind=='percentage'){
        text += `Voucher Shipping Cost ${item.voucher_value}%. `
      }

      if(item.max_discount!=null){
        text += `Max Disc ${rupiah(item.max_discount)}. `
      }
      if(item.min_purchase_amount!=null){
        text += `Min Purchase ${rupiah(item.min_purchase_amount)}. `
      }
      return text
    }
  }

  const rupiah = (number)=>{
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR"
    }).format(number);
  }

  function calculateVoucher(){
    if(voucherId==0){
      return 0
    }else{
      let disc = 0
      let arr = voucher.find(x => x.id == voucherId)
      if(arr.voucher_type == 'total purchase'){
        if(arr.voucher_kind=='amount'){
          disc = arr.voucher_value
          if(arr.max_discount!=null){
            if(arr.max_discount < disc) return arr.max_discount
          }
          return disc
        }else if(arr.voucher_kind=='percentage'){
          disc = arr.voucher_value/100 * getTotalPrice()
          if(arr.max_discount!=null){
            if(arr.max_discount < disc) return arr.max_discount
          }
          return disc
        }
      }
      else if(arr.voucher_type == 'shipping'){
        if(shippingCost==null) return 0
        if(arr.voucher_kind=='amount'){
          disc = arr.voucher_value
        }else if(arr.voucher_kind=='percentage'){
          disc = arr.voucher_value/100 * shippingCost
        }
        if(arr.max_discount!=null){
          if(arr.max_discount < disc && arr.max_discount <= shippingCost) return arr.max_discount
          else if(shippingCost < disc) return shippingCost
        }
        return disc
      }
    }
  }

  const handleSubmit = async () => {
    let data = {
      total_price: getTotalPrice(),
      total_weight: getTotalWeight(),
      shipping_fee: shippingCost,
      voucher_discount_amount: voucherValue,
      id_shipping_service: serviceId,
      id_user_voucher: voucherId,
      id_branch: branchId,
      id_address: addressId
    }

    try{
      const response = await api.post(`transaction`, data, {
        'headers': {
            'Authorization': `Bearer ${token}`
        }
      });
      toast.success(response.data.message);
      setTimeout(() => {
        window.location.href = '/'
      }, 500);
    }catch(error){
      toast.error(error.response.data.message);
    }
  }

  return (
    <>
      <NavBar />
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <h3 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
            Order Summary
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
                            {/* {product.size ? (
                                <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">{product.size}</p>
                            ) : null} */}
                            {/* discount? */}
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
                            <div class="flex-none">
                              x {item.product_qty}
                            </div>
                          </div>
                        </div>
                      </div>
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
              <div>
                    <label htmlFor="shipping_service" className="block text-sm font-medium text-gray-900">
                        Shipping Service
                    </label>
                    <div className="mt-1">
                        <select
                        name="shipping_service"
                        id="shipping_service"
                        onChange={(e) => setServiceId(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                        >
                            {service.map((data)=>{
                                return(
                                    <option key={data.id} value={data.id}>{`${data.courier} (${data.service_name})`}</option>
                                )
                            })}
                        </select>
                    </div>
                </div>

                <div>
                    <label htmlFor="user_voucher" className="block text-sm font-medium text-gray-900">
                        Voucher
                    </label>
                    <div className="mt-1">
                        <select
                        name="user_voucher"
                        id="user_voucher"
                        onChange={(e) => setVoucherId(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                        >
                          <option value={0}>{`Select voucher`}</option>
                          {voucher.map((data)=>{
                                return(
                                    <option key={data.id} value={data.id}>
                                      {`${data.voucher_code} - `}
                                      {showVoucher(data)}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                </div>
                
                <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-600">Total Weight</dt>
                    <dd className="text-sm font-medium text-gray-900">{getTotalWeight()} gr</dd>
                </div>
                <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-600">Subtotal</dt>
                    <dd className="text-sm font-medium text-gray-900">{rupiah(getTotalPrice())}</dd>
                </div>
                <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-600">Shipping Cost</dt>
                    <dd className="text-sm font-medium text-gray-900">{rupiah(shippingCost)}</dd>
                </div>
                <div className="flex items-center justify-between">
                    <dt className="text-sm text-gray-600">Voucher Discount</dt>
                    <dd className="text-sm font-medium text-gray-900">{rupiah(voucherValue)}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="text-base font-medium text-gray-900">
                    Final Price
                  </dt>
                  <dd className="text-base font-medium text-gray-900">
                    {rupiah(getTotalPrice() + (shippingCost || 0) - voucherValue)}
                  </dd>
                </div>
              </dl>

              {shippingCost != null &&
                <div className="mt-6">
                    <button
                    type="button"
                    onClick={()=>handleSubmit()}
                    className="w-full rounded-md border border-transparent bg-green-600 py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-green-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                    >
                      Continue Payment
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
