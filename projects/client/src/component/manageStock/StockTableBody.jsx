import { PencilSquareIcon } from "@heroicons/react/24/solid";

export default function StockTableBody({ inventories, openEditModal }) {
  function formatIDR(price=0) {
    let idr = Math.ceil(price).toLocaleString("id-ID");
    return `Rp ${idr}`;
  }
  return (
    <tbody className="divide-y text-left divide-gray-200 bg-white">
      {inventories.map((inventory) => (
        <tr key={inventory.id}>
          <td className="whitespace-nowrap px-3 py-3 text-sm font-medium text-gray-900 sm:pl-6">
            {inventory.id}
          </td>
          <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
            {inventory.Product?.Category?.category_name}
          </td>
          <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
            {inventory.Product.product_name}
          </td>
          <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
            {inventory.Discounts?.[0]?.discount_type === "buy one get one"
              ? inventory.Discounts?.[0]?.discount_type
              : inventory.Discounts?.[0]?.discount_type === "percentage"
              ? `${inventory.Discounts?.[0]?.discount_value}%`
              : inventory.Discounts?.[0]?.discount_type === "amount"
              ? `${formatIDR(inventory.Discounts?.[0]?.discount_value)} off`
              : null}
          </td>
          <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
            {formatIDR(inventory.discounted_price)}
            {inventory.Discounts?.[0]?.discount_type === "amount" ||
            inventory.Discounts?.[0]?.discount_type === "percentage" ? (
              <span className="ml-2 text-sm text-gray-400 line-through">
                {formatIDR(inventory.Product.product_price)}
              </span>
            ) : (
              <></>
            )}
          </td>
          <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
            {inventory.stock}
          </td>
          <td className="flex whitespace-nowrap px-3 py-3 text-center text-sm font-medium sm:pr-3 justify-center">
            <div className="flex row">
              <button
                className="hover:bg-gray-100 hover:rounded-md active:bg-gray-200 active:rounded-md p-1"
                onClick={() => openEditModal(inventory)}
              >
                <PencilSquareIcon
                  className="fill-green-500 hover:fill-green-600 active:fill-green-600 block h-6 w-6"
                  aria-hidden="true"
                />
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
}
