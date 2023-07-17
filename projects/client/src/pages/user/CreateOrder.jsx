import NavBar from "../../component/NavBar";
import Footer from "../../component/Footer";
import { api } from "../../api/api";
import toast, { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import pin from "../../assets/images/pin.png"
import { getTotalPrice, getTotalWeight, checkDiscount, countDiscount, rupiah, showVoucher, calculateVoucher, checkProductVoucher } from "../../function";
import ItemInformation from "../../component/ItemInformation";
import PriceInformation from "../../component/PriceInformation";

export default function CreateOrder() {
  const Navigate = useNavigate()
  const user = useSelector((state) => state.userSlice);
  const branchId = useSelector((state) => state.branchSlice.branchId);
  const addressId = localStorage.getItem("addressId")
  const token = localStorage.getItem("token")
  const [carts, setCarts] = useState([]);
  const [detail, setDetail] = useState();
  const [voucher, setVoucher] = useState([]);
  const [voucherId, setVoucherId] = useState(0);
  const [voucherValue, setVoucherValue] = useState(0);
  const [service, setService] = useState([]);
  const [serviceId, setServiceId] = useState(1);
  const [shippingCost, setShippingCost] = useState();

  useEffect(() => {
    async function fetchData() {
      if(branchId == 0){
        toast.error("The distance between the nearest store and the delivery location exceeds 30 km.")
        setTimeout(() => {Navigate('/')}, 500)
      }

      try {
        const response = await api.get(`cart`, {'headers': {'Authorization': `Bearer ${token}`}});
        const cartData = response.data.results;

        try{
          const response = await api.get(`address/${addressId}`);
          const addressDetail = response.data.data;

          setDetail(`${addressDetail.label} - ${addressDetail.address_detail} - ${addressDetail.city} - ${addressDetail.province}`)
        }catch(error){toast.error(error.response.data.message);}

        try{
          const response = await api.get(`voucher/user`, {'headers': {'Authorization': `Bearer ${token}`}});
          const voucherData = response.data.results

          setVoucher(voucherData)
        }catch(error){toast.error(error.response.data.message);}

        try{
            const response = await api.get(`shipping`);
            const serviceData = response.data.data;
            setService(serviceData)
        }catch(error){toast.error(error.response.data.message);}

        setCarts(cartData);
      } catch (error) {toast.error(error.response.data.message);}
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
        if(addressId == undefined){
          toast.error("Shipping address not setted")
          setTimeout(() => {Navigate('/')}, 500)
        }
        const data = {branchId: carts[0].id_branch, addressId, orderWeight: getTotalWeight(carts), serviceId}
        const response = await api.post(`shipping`, data);
        setShippingCost(response.data.data.cost[0].value)

      } catch (error) {
        setShippingCost(null)
        toast.error(error.response.data.message);
      }
    }
    calculateCost();
  }, [serviceId, carts]);

  useEffect(()=>{
    async function updateVoucherValue(){setVoucherValue(calculateVoucher(shippingCost, voucher, voucherId, carts))}
    updateVoucherValue()
  }, [shippingCost, voucherId])

  useEffect(() => {
    async function updateBonus() {
      setVoucher(checkProductVoucher(voucher, carts))
      for(let item of carts){
        if(item.bonus_qty > 0 && checkDiscount(item)!='bonus_qty'){
          try{
            const response = await api.patch(`cart/bonus/${item.id}`, {bonus_qty: 0});
          }catch(error){toast.error(error.response.data.message);}
        }
        if(item.bonus_qty == 0 && checkDiscount(item)=='bonus_qty'){
          try{
            const response = await api.patch(`cart/bonus/${item.id}`, {bonus_qty: item.product_qty});
          }catch(error){toast.error(error.response.data.message);}
        }
      }
    }
    updateBonus();
  }, [carts]);

  const handleSubmit = async () => {
    let data = {total_price: getTotalPrice(carts), total_weight: getTotalWeight(carts), shipping_fee: shippingCost, voucher_discount_amount: voucherValue, id_shipping_service: serviceId, id_user_voucher: voucherId, id_branch: branchId, id_address: addressId}
    try{
      const response = await api.post(`transaction`, data, {
        'headers': {
            'Authorization': `Bearer ${token}`
        }
      });
      toast.success(response.data.message);
      setTimeout(() => {window.location.href = `/order/${response.data.data.id}`}, 500);
    }catch(error){
      toast.error(error.response.data.message);
    }
  }

  return (
    <>
      <NavBar />
      {addressId != 0 && addressId != undefined && branchId != 0 && branchId != undefined &&
        <div className="bg-white">
          <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
            <h3 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              Order Confirmation
            </h3>
            <span className="inline-flex items-start">
              {carts.length>0 ? <img src={pin} alt="" className="self-center w-4 h-4 rounded-full mr-1" /> : ""}
              <span>
                {carts.length>0 ? `${carts[0].branch_name} (${carts[0].city})` : ""}
              </span>
            </span>
          
            <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
              <ItemInformation carts={carts}/>

              <section aria-labelledby="summary-heading" className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
                <h2 id="summary-heading" className="text-lg font-medium text-gray-900">Order Detail</h2>

                <dl className="mt-6 space-y-4">
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-900">Shipping Address</label>
                    <div className="mt-1">
                      {detail && <p className="text-gray-600 sm:text-sm">{detail}</p>}
                    </div>
                </div>
                <div>
                      <label htmlFor="shipping_service" className="block text-sm font-medium text-gray-900">Shipping Service</label>
                      <div className="mt-1">
                          <select name="shipping_service" id="shipping_service" onChange={(e) => setServiceId(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm">
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
                          <select name="user_voucher" id="user_voucher" onChange={(e) => setVoucherId(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm">
                            <option value={0}>{`Select voucher`}</option>
                            {voucher.map((data)=>{
                                  return(
                                      <option key={data.id} value={data.id}>
                                        {showVoucher(data)}
                                      </option>
                                  )
                              })}
                          </select>
                      </div>
                  </div>
                  <PriceInformation carts={carts} shippingCost={shippingCost} voucherValue={voucherValue}/>
                </dl>
                {shippingCost != null &&
                  <div className="mt-6">
                      <button type="button" onClick={()=>handleSubmit()} className="w-full rounded-md border border-transparent bg-green-600 py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-green-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50">Continue Payment</button>
                  </div>}
              </section>
            </form>
          </div>
        </div>}
      <Toaster/>
      <Footer />
    </>
  );
}