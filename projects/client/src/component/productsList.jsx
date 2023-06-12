export const ProductsList = ({ productsInfo }) => {
    function rupiah(price) {
        const priceString = price.toString();
        const len = priceString.length;
        let str = "";
        for (let i = 0; i < len; i++) {
          str += priceString[i];
          if ((len - i - 1) % 3 === 0 && i !== len - 1) {
            str += ".";
          }
        }
        return `Rp ${str}`;
      }
    return (
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-4 lg:gap-x-6">
          {productsInfo.map((productInfo) => (
            <div key={productInfo.id} className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white drop-shadow-md">
              <div className=" bg-gray-200 group-hover:opacity-75 sm:aspect-none">
                <div className="square-image-container">
                  <img src={productInfo.Product.product_image} alt={productInfo.Product.product_name} className="h-full w-full object-cover object-center sm:h-full sm:w-full" />
                </div>
              </div>
              <div className="flex flex-1 flex-col px-4 py-3">
                <h3 className="text-md font-medium text-gray-900 my-1">
                  {productInfo.Product.product_name}
                  {/* <a href={productInfo.Product.href}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {productInfo.Product.name}
                  </a> */}
                </h3>

                <p className="text-md text-gray-500 my-1">{productInfo.Product.weight} gram</p>

                <div className="flex flex-1 flex-col justify-end">
                  <p className=" text-lg font-bold text-green-600">{rupiah(productInfo.Product.product_price)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
    )
}