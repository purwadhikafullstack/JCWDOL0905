import { rupiah, showVoucher } from "../function"

export default function OrderInformation(props) {
    let order = props.order
    let detail = `${order.address_label} - ${order.address_detail} - ${order.address_city} - ${order.address_province}`
    return (
        <>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-900">
                    Shipping Address
                </label>
                <div className="mt-1">
                <p className="text-gray-600 sm:text-sm">{detail}</p>
                </div>
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-900">
                    Shipping Service
                </label>
                <div className="mt-1">
                <p className="text-gray-600 sm:text-sm">{`${order.Shipping_Service.courier} (${order.Shipping_Service.service_name})`}</p>
                </div>
            </div>
            {order.User_Voucher &&
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-900">
                    Voucher
                </label>
                <div className="mt-1">
                <p className="text-gray-600 sm:text-sm">{showVoucher(order.User_Voucher.Voucher)}</p>
                </div>
            </div>
            }
            
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
        </>
    )
}