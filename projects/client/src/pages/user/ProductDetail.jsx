import NavBar from "../../component/NavBar";
import Footer from "../../component/Footer";
import { api } from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { countItem } from "../../redux/cartSlice";
import { CheckIcon } from '@heroicons/react/20/solid'

const ProductDetail = () => {
    const dispatch = useDispatch()
    const Navigate = useNavigate()

    const id = useParams().id;
    const token = localStorage.getItem("token")
    const user = useSelector((state) => state.userSlice);
    const branchId = useSelector((state) => state.branchSlice.branchId);
    const [carts, setCarts] = useState([])
    const [product, setProduct] = useState({})

    async function countCart() {
        try {
          const response = await api.get(`cart/count`, {
              'headers': {
                  'Authorization': `Bearer ${token}`
              }
          });
  
          dispatch(
            countItem({
              count: response.data.data,
            })
          );
        } catch (error) {
          console.log(error.response.data.message);
        }
    }

    async function addToCart(){
        try{
            if(carts.length>0){
                let deleteCart = false;

                for(let item of carts){
                    if(item.id_branch!=branchId){
                        deleteCart = true;
                        break;
                    }
                }

                if(deleteCart){
                    if (window.confirm("You have items from other branch on your cart. Delete current cart?") == true) {
                        const deleteCart = await api.delete(`cart`, {
                            'headers': {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        toast.success(deleteCart.data.status);
                        const response = await api.post(`cart/${id}`, {}, {
                            'headers': {
                                'Authorization': `Bearer ${token}`
                            }
                        });

                        countCart()
                        toast.success(response.data.message);
                    }
                }else{
                    const response = await api.post(`cart/${id}`, {}, {
                        'headers': {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    countCart()
                    toast.success(response.data.message);
                }
            }else{
                const response = await api.post(`cart/${id}`, {}, {
                    'headers': {
                        'Authorization': `Bearer ${token}`
                    }
                });
                countCart()
                toast.success(response.data.message);
            }
        } catch(error){
            toast.error(error.response.data.message)
        }
    }

    useEffect(() => {
        async function fetchData() {
          try {
            const response = await api.get(`cart`, {
                'headers': {
                    'Authorization': `Bearer ${token}`
                }
            });
            const cartData = response.data.results;
            await api.get(`inventory/find/${id}?branchId=${branchId}`);

            setCarts(cartData);
          } catch (error) {
            if(error.response.data.navigate){
                Navigate('/404')
            }
            toast.error(error.response.data.message);
          }
        }
        fetchData();
        async function fetchProductData() {
          try {
              const result = await api.get(`/inventory/${id}`)
              setProduct(result.data.data)
              console.log("product",result.data.data)
          } catch (error) {
            if(error.response.data.navigate){
              Navigate('/404')
          }
          }
      }
      fetchProductData();
    }, [user, branchId]);

    function formatIDR(price) {
      let idr = Math.floor(price).toLocaleString("id-ID");
      return `Rp ${idr}`;
    }

    return (
      <>
        <NavBar />
        <div className="bg-white">
          <div className="mx-auto max-w-2xl py-8 px-4 sm:py-24 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-10 lg:py-10 lg:px-8">
            {/* Product image */}
            <div className=" lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:mt-0 lg:self-center">
              <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg">
                <img
                  src={product.Product?.product_image}
                  alt={product.Product?.product_name}
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>

            {/* Product details */}
            <div className="lg:max-w-lg lg:self-end lg:col-start-2 lg:self-start">
              <div className="mt-4">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-3xl">
                  {product.Product?.product_name}
                </h1>
              </div>

              <section aria-labelledby="information-heading" className="mt-4">
                <h2 id="information-heading" className="sr-only">
                  Product information
                </h2>
                <div className="flex items-center">
                  <div className="text-xl font-bold text-green-600 sm:text-2xl mr-5 pb-1">
                    {formatIDR(product?.discounted_price)}
                  </div>

                  {product.Discounts && (
                    <div className="text-sm bg-orange-400 text-white font-semibold px-2 rounded-full">
                      {product.Discounts?.[0]?.discount_type === "buy one get one"
                        ? product.Discounts?.[0]?.discount_type
                        : product.Discounts?.[0]?.discount_type === "percentage"
                        ? `${product.Discounts?.[0]?.discount_value}%`
                        : product.Discounts?.[0]?.discount_type === "amount"
                        ? `${product.Discounts?.[0]?.discount_value} off`
                        : null}
                    </div>
                  )}
                  {product.Discounts &&
                    (product.Discounts?.[0]?.discount_type === "amount" ||
                    product.Discounts?.[0]?.discount_type === "percentage") && (
                      <div className="ml-3 mb-0.5 text-lg text-gray-400 line-through">
                        {formatIDR(product.Product?.product_price)}
                      </div>
                    )}
                </div>

                <div className="mt-4 space-y-6">
                  <p className="text-lg text-gray-500">
                    {product.Product?.product_description}
                  </p>
                </div>

                <div className="mt-6 flex items-center">
                  <CheckIcon
                    className="h-5 w-5 flex-shrink-0 text-green-500"
                    aria-hidden="true"
                  />
                  <p className="ml-2 text-md text-gray-500">
                    Weight : {product.Product?.weight} gram
                  </p>
                </div>
                <div className="mt-2 flex items-center">
                      <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-500" aria-hidden="true" />
                      <p className="ml-2 text-md text-gray-500">
                        In stock : {product.stock}</p>
                </div>
              </section>
            </div>

            <div className="mt-4 lg:col-start-2 lg:row-start-2 lg:max-w-lg lg:self-start">
              <section aria-labelledby="options-heading">
                  <div className="mt-10">
                    {token && (
                      <button
                        onClick={() => addToCart(id)}
                        disabled={product.stock === 0}
                        className="flex w-full items-center justify-center rounded-md border border-transparent bg-green-600 py-2 px-8 text-lg font-bold text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
              </section>
            </div>
          </div>
        </div>
        <Toaster />
        <Footer />
      </>
    );
}

export default ProductDetail;