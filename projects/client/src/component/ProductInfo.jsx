import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function ProductInfo({products, openEditModal, openDeleteModal}) {
    function formatIDR(price=0) {
        let idr = Math.round(price).toLocaleString("id-ID");
        return `Rp ${idr}`;
      }

    return(
        <div>
            {products.map((product) => (
              <div className="grid grid grid-cols-1 gap-y-4 sm:grid-cols-4 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-6 lg:gap-x-4 rounded-md border border-gray-300 p-3 mb-4">
                <div className="flex w-full bg-neutral-300 shrink-0">
                  <div className="square-image-container ">
                    <img src={product.product_image} alt={product.product_image}className="h-full w-full object-cover object-center sm:h-full sm:w-full"
                    />
                  </div>
                </div>
                <div className="flex-col h-full sm:col-span-2 lg:col-span-4 mt-1">
                  <div className="flex flex-col lg:flex-row lg:justify-between">
                    <h3 className="font-bold text-gray-900 my-1 mr-4 mb-4">
                      {product.product_name}
                    </h3>
                    <div class="flex h-7 w-40 shrink-0 justify-center items-center rounded-full bg-orange-50 py-1 mb-4 text-sm font-medium text-orange-600 ring-1 ring-inset ring-red-600/10">
                      {product.Category?.category_name}
                    </div>
                  </div>
                  <p className="w-full text-md text-gray-800">
                    {product.product_description}</p>

                  <div className="items-end">
                    <span className="text-lg font-bold text-green-500">
                      {formatIDR(product.product_price)}
                    </span>
                    <span className="ml-3 text-sm text-gray-400 my-1">
                      / {product.weight} gram
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="flex justify-between">
                    <button
                      className="m-2 p-2 border border-green-600 hover:border-green-800 text-lg font-bold text-green-600 hover:text-green-800 rounded-full"
                      onClick={() => openEditModal(product)}
                    >
                      <PencilSquareIcon
                        className="block h-6 w-6"
                        aria-hidden="true"
                      />
                    </button>
                    <button
                      className="m-2 p-2 border border-red-600 text-lg font-bold text-red-600 hover:border-red-800 hover:text-red-800 rounded-full"
                      onClick={() => openDeleteModal(product.id)}
                    >
                      <TrashIcon className="block h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
    )
}