import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { rupiah, checkDiscount, countDiscount } from "../function";

export default function Suggested(props) {

  const productsData = props.productsData;

  const checkDiscount = (item) => {
    let today = new Date()
    let start = new Date(item.start_date)
    let end = new Date(item.end_date)
    end.setDate(end.getDate() + 1);

    if(start <= today && end >= today){
      if(item.discount_type == 'percentage' || item.discount_type == 'amount'){
          if(!item.product_qty) return 'price'
          else if(item.min_purchase_qty == null || item.product_qty >= item.min_purchase_qty) return 'price'
          else return false
        }
      else if(item.discount_type == 'buy one get one') return 'bonus_qty'
    }
    return false
}

  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 4000,
    slidesToShow: 4,
    slidesToScroll: 1,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <>
          <Slider {...settings}>
            
            {productsData.map((product) => (
              <a href={`product/${product.id}`}>
                <div
                  key={product.id}
                  className="mx-2 mt-2 group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white drop-shadow-md"
                >
                  <div className=" bg-gray-200 group-hover:opacity-75 sm:aspect-none">
                    <div className="square-image-container">
                      <img
                        src={product.product_image}
                        alt={product.product_name}
                        className="h-full w-full object-cover object-center sm:h-full sm:w-full"
                      />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col px-4 py-3">
                    <a href={`/product/${product.id}`}>
                      <h3 className="text-md font-medium text-gray-900 my-1">
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.product_name}
                      </h3>
                    </a>

                    <p className="text-md text-gray-500 my-1">
                      {product.weight} gram
                    </p>

                    {checkDiscount(product) == "price" ? (
                      <div>
                        <div className="flex flex-1 flex-col justify-end">
                          <div className="text-lg font-bold text-green-600">
                            {rupiah(countDiscount(product))}
                          </div>
                        </div>
                        <div className="flex">
                          <div className="text-sm bg-orange-400 text-white font-semibold px-2 my-0.5 rounded-full">
                            {product.discount_type === "amount"
                              ? `${product.discount_value} off`
                              : `${product.discount_value}%`}
                          </div>
                          <div className="ml-2 mb-0.5 text-md text-gray-400 line-through">
                            {rupiah(product.product_price)}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex flex-1 flex-col justify-end">
                          <div className="text-lg font-bold text-green-600">
                            {rupiah(product.product_price)}
                          </div>

                          {checkDiscount(product) == "bonus_qty" && (
                            <div className="flex">
                              <div className="text-sm bg-orange-400 text-white font-semibold px-2 my-0.5 rounded-full">
                                buy one get one
                              </div>
                            </div>)
                          }
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </Slider>
    </>
  );
}
