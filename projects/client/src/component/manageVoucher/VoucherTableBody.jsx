import moment from "moment";

export default function VoucherTableBody({ vouchers, branchId }) {
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
              {voucher.voucher_kind === "percentage" ? voucher.voucher_value + "%" : formatIDR(voucher.voucher_value)}
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
          </tr>
        )
      )}
    </tbody>
  );
}
