import VoucherImg from "../../assets/images/voucher-illustration2.png";
import { useNavigate } from "react-router-dom";

export default function PromoBanner() {
    const navigate = useNavigate();

    return (
        <div className="flex h-full flex-col md:h-full md:flex-row lg:flex-row sm:h-64 lg:h-full items-center mb-8 justify-between bg-orange-100 rounded-md px-20 drop-shadow-lg">
          <div className="flex flex-col justify-center items-center md:flex md:justify-start md:items-start">
            <div className="text-xl mt-4 md:mt-0 lg:text-2xl text-gray-800 text-center font-extrabold md:mr-4 mb-4">
            Check promos before continue shopping
            </div>
            <button
              className="flex border border-orange-500 text-lg px-4 py-1 text-orange-500 rounded-md font-bold bg-white hover:bg-white justify-center"
              onClick={() => navigate("/voucher")}
            >
              See all promos
            </button>
          </div>

          <div className="flex mt-1 md:mt-8 lg:mt-10">
            <img
              src={VoucherImg}
              alt="Page Not Found"
              className="h-32 lg:h-60"
            />
          </div>
      </div>
    )
}