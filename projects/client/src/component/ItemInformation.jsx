import { getTotalWeight, getTotalPrice, rupiah, checkDiscount, countDiscount } from "../function"
import { useNavigate } from "react-router-dom"

export default function ItemInformation(props) {
    const Navigate = useNavigate()
    let carts = props.carts
    return (
        <>
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
                          {checkDiscount(item) == 'price' ?
                            <div>
                              <p className="mt-1 text-sm font-medium text-gray-900 line-through">
                                {rupiah(item.product_price)}
                              </p>
                              <p className="mt-1 text-sm font-medium text-gray-900">
                                {rupiah(countDiscount(item))}
                              </p>
                            </div>
                            : 
                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {rupiah(item.product_price)}
                            </p>
                          }
                          {checkDiscount(item) == 'bonus_qty' &&
                            <p className="mt-1 text-sm font-medium text-gray-900">
                              Bonus item: {item.bonus_qty} pcs
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
        </>
    )
}