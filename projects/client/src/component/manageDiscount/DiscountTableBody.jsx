import moment from "moment";

export default function DiscountTableBody({ discounts }) {
  function formatIDR(price) {
    if (price !== null) {
      let idr = Math.floor(price).toLocaleString("id-ID");
      return `Rp ${idr}`;
    }
  }
  function formattedDate(date) {
    return moment(date).format("DD/MM/YYYY");
  }

  return (
    <tbody className="divide-y text-left divide-gray-200 bg-white">
      {discounts.map((discount) => (
        <tr key={discount.id}>
          <td className="whitespace-nowrap px-3 py-3 text-sm font-medium text-gray-900 sm:pl-6">
            {discount.id}
          </td>
          <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
            {discount.Inventory?.Product?.product_name}
          </td>
          <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
            {discount.discount_type}
          </td>
          <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
            {discount.discount_type === "percentage"
              ? `${discount.discount_value}%`
              : discount.discount_type === "amount"
              ? formatIDR(discount.discount_value)
              : "-"}
          </td>
          <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
            {formattedDate(discount.start_date)} -{" "}
            {formattedDate(discount.end_date)}
          </td>
          <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
            {new Date(discount.end_date) < new Date() ? (
              <div className="w-20 text-center text-red-600 border border-red-600 bg-red-100 rounded rounded-full">
                Inactive
              </div>
            ) : new Date(discount.start_date) <= new Date() &&
              new Date(discount.end_date) >= new Date() ? (
              <div className="text-green-600 text-center w-20 border border-green-600 bg-green-100 rounded rounded-full">
                Active
              </div>
            ) : (
              <div className="text-blue-600 text-center w-20 border border-blue-600 bg-blue-100 rounded rounded-full">
                Upcoming
              </div>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  );
}
