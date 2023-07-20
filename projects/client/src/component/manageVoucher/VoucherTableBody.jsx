import moment from "moment";

export default function VoucherTableBody({ vouchers, branchId }) {
  function formatIDR(price=0) {
    if (price !== null) {
      let idr = Math.ceil(price).toLocaleString("id-ID");
      return `Rp ${idr}`;
    }
  }

  function formattedDate(date) {
    return moment(date).format("DD/MM/YYYY");
  }

  return (
    <tbody className="divide-y text-left divide-gray-200 bg-white">
      {vouchers.map((voucher) =>
        voucher.voucher_type === "product" &&
        voucher.Inventory?.id_branch !== branchId &&
        branchId !== "" ? (
          <></>
        ) : (
          <tr key={voucher.id}>
            <td
              className="
            px-3 py-3 text-sm font-medium text-gray-900 sm:pl-6"
            >
              {voucher.id}
            </td>
            <td className="px-3 py-3 text-sm text-gray-500">
              {voucher.voucher_type}
            </td>
            <td className="px-3 py-3 text-sm text-gray-500">
              {voucher?.Inventory?.Product.product_name || "-"}
              {voucher.Inventory ? (
                <span> ({voucher.Inventory?.Store_Branch?.branch_name})</span>
              ) : (
                <></>
              )}
            </td>
            <td className="px-3 py-3 text-sm text-gray-500">
              {voucher.voucher_kind === "percentage"
                ? voucher.voucher_value + "%"
                : formatIDR(voucher.voucher_value)}
            </td>
            <td className="px-3 py-3 text-sm text-gray-500">
              {formatIDR(voucher.max_discount) || "-"}
            </td>
            <td className="px-3 py-3 text-sm text-gray-500">
              {formatIDR(voucher.min_purchase_amount) || "-"}
            </td>
            <td className="px-3 py-3 text-sm text-gray-500">
              {formattedDate(voucher.start_date)} -{" "}
              {formattedDate(voucher.end_date)}
            </td>
            <td className="px-3 py-3 text-sm text-gray-500">
              {new Date(voucher.end_date) < new Date() ? (
                <div className="w-20 text-center text-red-600 border border-red-600 bg-red-100 rounded rounded-full">
                  Inactive
                </div>
              ) : new Date(voucher.start_date) <= new Date() &&
                new Date(voucher.end_date) >= new Date() ? (
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
        )
      )}
    </tbody>
  );
}
