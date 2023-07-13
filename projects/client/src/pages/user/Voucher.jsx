import moment from "moment";
import NavBar from "../../component/NavBar";
import Footer from "../../component/Footer";
import {
  ReceiptPercentIcon,
  TruckIcon,
} from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VoucherImg from "../../assets/images/voucher-illustration2.png";
// import default_picture from "../assets/images/default.jpg"

const vouchers = [
  {
    id: 1,
    voucher_type: "product",
    voucher_kind: "amount",
    // voucher_code: "ABC",
    voucher_value: 5000,
    max_discount: null,
    min_purchase_amount: null,
    start_date: "2023-06-19 17:00:00",
    end_date: "2023-07-18 17:00:00",
    id_inventory: 1,
    product_name: "Daging Sapi Impor Giling"
  },
  {
    id: 2,
    voucher_type: "shipping",
    voucher_kind: "percentage",
    // voucher_code: "FREEONGKIR",
    voucher_value: 100,
    max_discount: null,
    min_purchase_amount: 50000,
    start_date: "2023-06-19 17:00:00",
    end_date: "2023-07-25 17:00:00",
    id_inventory: null,
    product_name: null
  },
  {
    id: 3,
    voucher_type: "total purchase",
    voucher_kind: "percentage",
    // voucher_code: "PROMO77",
    voucher_value: 10,
    max_discount: 20000,
    min_purchase_amount: 100000,
    start_date: "2023-06-19 17:00:00",
    end_date: "2023-08-01 17:00:00",
    id_inventory: null,
    product_name: null
  },
  {
    id: 4,
    voucher_type: "shipping",
    voucher_kind: "amount",
    // voucher_code: "FREESHIP30K",
    voucher_value: 30000,
    max_discount: null,
    min_purchase_amount: 200000,
    start_date: "2023-06-19 17:00:00",
    end_date: "2023-07-25 17:00:00",
    id_inventory: null,
    product_name: null
  },
];

const user_vouchers = [
  {
    id_voucher: 1,
    is_used: 0
  },
  {
    id_voucher: 2,
    is_used: 1
  },
]
export default function Voucher() {
  const [userClaimedVouchers, setUserClaimedVouchers] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch the user's claimed vouchers from the `user_vouchers` array
    const claimedVouchers = user_vouchers
      .filter((voucher) => voucher.is_used === 0)
      .map((voucher) => voucher.id_voucher);

    setUserClaimedVouchers(claimedVouchers);
  }, []);

    function formatIDR(price) {
        if (price !== null) {
          let idr = Math.floor(price).toLocaleString("id-ID");
          return `Rp ${idr}`;
        }
      }

    function formattedDate(date) {
        return moment(date).format("DD-MM-YYYY");
      }

  return (
    <div className="bg-neutral-100 min-h-screen">
      <NavBar />
      <div className="mx-auto max-w-2xl py-1 px-4 sm:py-8 sm:px-6 md:max-w-4xl md:px-6 md:py-6 lg:max-w-7xl lg:px-8 md:py-6 mb-10">
        <h2 className="sr-only">Voucher</h2>

        <div className="flex h-full flex-col md:h-full md:flex-row lg:flex-row sm:h-64 lg:h-full items-center mb-8 justify-center bg-gray-100 rounded-md mb-4">
            <div className=" text-2xl lg:text-3xl text-gray-700 text-center font-black p-5 mr-4">Promotion Vouchers</div>
            <div className="flex mt-1 md:mt-8 lg:mt-10">
          <img
            src={VoucherImg}
            alt="Page Not Found"
            className=" h-44 lg:h-72"
          />
        </div>
        </div>

        <h3 className="mb-6">Enjoy the best promotion vouchers at the moment!</h3>
        <div className="grid grid-cols-1 gap-y-4  md:grid-cols-2 md:gap-x-4 md:gap-y-4 lg:grid-cols-2 lg:gap-x-6 lg:gap-y-6">
          {vouchers.map((voucher) => {
            
            const isVoucherClaimed = userClaimedVouchers.includes(voucher.id);
        const isVoucherUsed = user_vouchers.find(
          (userVoucher) => userVoucher.id_voucher === voucher.id && userVoucher.is_used === 1
        );

        if (isVoucherUsed) {
          // Skip rendering if the voucher is already claimed and used
          return null;
        }
            return (
            <div
              className="flex rounded-lg border border-gray-200 min-h-32 h-32 lg:h-36"
              key={voucher.id}
            >
              <div className="flex w-full items-center">
                <div className="flex mr-4 w-44 min-h-28 h-full bg-green-500 rounded-l-lg justify-center items-center">
                  
                  <div className="flex-col justify-center items-center">
                  <div className="flex justify-center items-center mb-2">
                  {voucher.voucher_type === "shipping" ? (
                    <TruckIcon
                      className="fill-white block h-9 w-9"
                      aria-hidden="true"
                    />
                  ) : (
                    <ReceiptPercentIcon
                      className="fill-white block h-9 w-9"
                      aria-hidden="true"
                    />
                  )}
                  </div>
                  <div className="flex text-xs font-bold text-center text-white uppercase tracking-widest">
                    {voucher.voucher_type === "total purchase" ? "shopping" : voucher.voucher_type}
                  </div>
                  </div>
                </div>
                <div className="w-full py-2">
                  <div className="text-lg font-bold text-orange-400 my-0 leading-6 mb-0.5">
                    {voucher.voucher_type === "shipping" ? "FREE SHIPPING  " : "DISCOUNT  "} {voucher.voucher_kind === "percentage" ? voucher.voucher_value + "%" : formatIDR(voucher.voucher_value)}
                  </div>
                  {voucher.max_discount ? 
                    <div className="text-md font-semibold text-gray-700">UP TO {formatIDR(voucher.max_discount)}</div> : <></>
                    }
                    {voucher.min_purchase_amount ? 
                    <div className="text-sm font-semibold text-gray-500">min. purchase {formatIDR(voucher.min_purchase_amount)}</div> : <></>
                    }
                    {voucher.voucher_type === "product" ? 
                    <div className="text-sm font-semibold text-gray-500">on purchase: {voucher.product_name}</div> : <></>
                    } 

                  {/* <div className="text-sm font-semibold text-gray-500 items-end mt-3">Voucher code: <span className="text-green-500 font-bold">{voucher.voucher_code}</span></div> */}

                  <div className="text-xs text-gray-400 mt-3">valid until : {formattedDate(voucher.end_date)}</div>
                </div>

                <div className="justify-end">
                  <div className="flex justify-between">
                  {isVoucherClaimed ? 
                  <button
                  className="m-1 mr-5 w-20 h-8 border border-green-500 hover:border-green-600 text-md font-bold text-green-500 active:border-green-700 rounded-md "
                  onClick={() => navigate("/")}
                >
                  Use
                </button>
                  : 
                  <button
                      className="m-1 mr-5 w-20 h-8 bg-green-500 hover:bg-green-600 text-md font-bold text-white active:bg-green-700 rounded-md"
                      // onClick={() => claim(voucher)}
                    >
                      Claim
                    </button>}
                    
                    
                  </div>
                </div>
              </div>
            </div>
          )})}
        </div>
      </div>
      <Footer/>
    </div>
  );
}
