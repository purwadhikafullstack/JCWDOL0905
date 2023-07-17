import { getTotalWeight, getTotalPrice, rupiah, checkDiscount, countDiscount } from "../function"
import { useNavigate } from "react-router-dom"

export default function PriceInformation(props) {
    const Navigate = useNavigate()
    let carts = props.carts
    let shippingCost = props.shippingCost
    let voucherValue = props.voucherValue
    return (
        <>
            <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Total Weight</dt>
                <dd className="text-sm font-medium text-gray-900">{getTotalWeight(carts)} gr</dd>
            </div>
            <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">{rupiah(getTotalPrice(carts))}</dd>
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
                {rupiah(getTotalPrice(carts) + (shippingCost || 0) - voucherValue)}
            </dd>
            </div>
        </>
    )
}