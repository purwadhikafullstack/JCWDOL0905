import { api } from "../api/api";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { CheckIcon } from '@heroicons/react/20/solid'
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { checkActiveDiscount } from "../function";

const ProductInformation = (props) => {
    let product = props.product
    function formatIDR(price=0) {
        let idr = Math.ceil(price).toLocaleString("id-ID");
        return `Rp ${idr}`;
    }

    return(
        <>
            <div className=" lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:mt-0 lg:self-center">
              <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg">
                <img
                  src={product.Product?.product_image}
                  alt={product.Product?.product_name}
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>
            <div className="lg:max-w-lg lg:self-end lg:col-start-2 lg:self-start">
              <div className="mt-4">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-3xl">
                  {product.Product?.product_name}
                </h1>
              </div>

              <section aria-labelledby="information-heading" className="mt-4">
                <h2 id="information-heading" className="sr-only">
                  Product information
                </h2>
                <div className="flex items-center">
                  <div className="text-xl font-bold text-green-500 sm:text-2xl mr-5 pb-1">
                    {formatIDR(product?.discounted_price)}
                  </div>

                  {checkActiveDiscount(product.Discounts) && (
                    <div className="text-sm bg-orange-400 text-white font-semibold px-2 rounded-full">
                      {product.Discounts?.[0]?.discount_type === "buy one get one"
                        ? product.Discounts?.[0]?.discount_type
                        : product.Discounts?.[0]?.discount_type === "percentage"
                        ? `${product.Discounts?.[0]?.discount_value}%`
                        : product.Discounts?.[0]?.discount_type === "amount"
                        ? `${product.Discounts?.[0]?.discount_value} off`
                        : null}
                    </div>
                  )}
                  {checkActiveDiscount(product.Discounts) &&
                    (product.Discounts?.[0]?.discount_type === "amount" ||
                    product.Discounts?.[0]?.discount_type === "percentage") && (
                      <div className="ml-3 mb-0.5 text-lg text-gray-400 line-through">
                        {formatIDR(product.Product?.product_price)}
                      </div>
                    )}
                </div>

                <div className="mt-4 space-y-6">
                  <p className="text-lg text-gray-500">
                    {product.Product?.product_description}
                  </p>
                </div>

                <div className="mt-6 flex items-center">
                  <CheckIcon
                    className="h-5 w-5 flex-shrink-0 text-green-500"
                    aria-hidden="true"
                  />
                  <p className="ml-2 text-md text-gray-500">
                    Weight : {product.Product?.weight} gram
                  </p>
                </div>
                <div className="mt-2 flex items-center">
                      <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-500" aria-hidden="true" />
                      <p className="ml-2 text-md text-gray-500">
                        In stock : {product.stock}</p>
                </div>
              </section>
            </div>
        </>
    )
}
export default ProductInformation;