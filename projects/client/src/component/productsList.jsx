export const ProductsList = ({ productsInfo }) => {

  function formatIDR(price) {
    let idr = Math.floor(price).toLocaleString("id-ID");
    return `Rp ${idr}`;
  }

    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-4 lg:gap-x-6">
        {productsInfo.map((productInfo) => (
          <div
            key={productInfo.id}
            className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white drop-shadow-md"
          >
            <div className=" bg-gray-200 group-hover:opacity-75 sm:aspect-none">
              <div className="square-image-container">
                <img
                  src={productInfo.Product.product_image}
                  alt={productInfo.Product.product_name}
                  className="h-full w-full object-cover object-center sm:h-full sm:w-full"
                />
              </div>
            </div>
            <div className="flex flex-1 flex-col px-4 py-3">
              <a href={`/product/${productInfo.id}`}>
                <h3 className="text-md font-medium text-gray-900 my-1">
                  <span aria-hidden="true" className="absolute inset-0" />
                  {productInfo.Product.product_name}
                </h3>
              </a>

              <p className="text-md text-gray-500 my-1">
                {productInfo.Product.weight} gram
              </p>

              <div className="flex flex-1 flex-col justify-end">
                <div className="text-lg font-bold text-green-600">
                  {formatIDR(productInfo.discounted_price)}
                </div>
              </div>

              <div className="flex">
                {productInfo.Discounts && (
                  <div className="text-sm bg-orange-400 text-white font-semibold px-2 my-0.5 rounded-full">
                    {productInfo.Discounts?.[0]?.discount_type ===
                    "buy one get one"
                      ? productInfo.Discounts?.[0]?.discount_type
                      : productInfo.Discounts?.[0]?.discount_type ===
                        "percentage"
                      ? `${productInfo.Discounts?.[0]?.discount_value}%`
                      : productInfo.Discounts?.[0]?.discount_type === "amount"
                      ? `${productInfo.Discounts?.[0]?.discount_value} off`
                      : null}
                  </div>
                )}

                {productInfo.Discounts &&
                  (productInfo.Discounts?.[0]?.discount_type === "amount" ||
                    productInfo.Discounts?.[0]?.discount_type ===
                      "percentage") && (
                    <div className="ml-2 mb-0.5 text-md text-gray-400 line-through">
                      {formatIDR(productInfo.Product?.product_price)}
                    </div>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
}