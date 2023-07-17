import { getTotalWeight, getTotalPrice, rupiah } from "../function"
import { useNavigate } from "react-router-dom"

export default function CheckoutInformation(props) {
    const Navigate = useNavigate()
    let carts = props.carts
    return (
        <>
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
                    <dd className="text-sm font-medium text-gray-900">{getTotalWeight(carts)} gr</dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="text-base font-medium text-gray-900">
                    Total Price
                  </dt>
                  <dd className="text-base font-medium text-gray-900">
                    {rupiah(getTotalPrice(carts))}
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
        </>
    )
}