import NavBar from "../../component/NavBar";
import Footer from "../../component/Footer";
import { api } from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { countItem } from "../../redux/cartSlice";
import { CheckIcon } from '@heroicons/react/20/solid'
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import ProductInformation from "../../component/ProductInformation";
import { checkDiscount } from "../../function";

const ProductDetail = () => {
    const dispatch = useDispatch()
    const Navigate = useNavigate()

    const id = useParams().id;
    const token = localStorage.getItem("token")
    const user = useSelector((state) => state.userSlice);
    const branchId = useSelector((state) => state.branchSlice.branchId);
    const [carts, setCarts] = useState([])
    const [product, setProduct] = useState({})
    const [productQty, setProductQty] = useState(1)
    const [errorQuantity, setErrorQuantity] = useState();
    const [bonusQty, setBonusQty] = useState(0)

    let validateQuantity = (value) => {
      if (value == "") {
        setErrorQuantity("Please input quantity");
      } else if (value < 1) {
        setErrorQuantity("Quantity must be at least 1");
      } else if (value > product.stock ){
        setErrorQuantity(`Quantity can't be more than ${product.stock}`);
      } else {
        setErrorQuantity("")
      }
      inputQty(value);
    };

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
                        const deleteCart = await api.delete(`cart`, {'headers': {'Authorization': `Bearer ${token}`}});
                        toast.success(deleteCart.data.message);
                        const response = await api.post(`cart/${id}`, {quantity: productQty, bonusQty}, {'headers': {'Authorization': `Bearer ${token}`}});
                        toast.success(response.data.message);
                        window.location.href = `/product/${id}`
                    }
                }else{
                    const response = await api.post(`cart/${id}`, {quantity: productQty, bonusQty}, {'headers': {'Authorization': `Bearer ${token}`}});
                    countCart()
                    toast.success(response.data.message);
                }
            }else{
                const response = await api.post(`cart/${id}`, {quantity: productQty, bonusQty}, {'headers': {'Authorization': `Bearer ${token}`}});
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
          }
        }
        fetchData();
        async function fetchProductData() {
          try {
              const result = await api.get(`/inventory/${id}`)
              const productData = result.data.data
              setProduct(productData)
              if(productData.Discounts[0].discount_type=='buy one get one') setBonusQty(productQty)
          } catch (error) {
            if(error.response.data.navigate){
              Navigate('/404')
          }
          }
      }
      fetchProductData();
    }, [user, branchId, productQty]);

    function increaseQty(e) {
      e.preventDefault()
      if (productQty < product.stock) {
        setProductQty(parseInt(productQty) + 1)
      } else if (productQty == "") {
        setProductQty(1)
      }
    }

    function decreaseQty(e) {
      e.preventDefault()
      if (productQty > 1) {
        setProductQty(parseInt(productQty) - 1)
        if (parseInt(productQty) - 1 <= product.stock) {
          setErrorQuantity("")
        }
      }
    }

    function inputQty(qty) {
      if (qty === 0) {
        setProductQty(1)
      } else (
        setProductQty(qty)
      )
    }

    return (
      <>
        <NavBar />
        <div className="bg-white">
          <div className="mx-auto max-w-2xl py-8 px-4 sm:py-24 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-10 lg:py-10 lg:px-8">
            <ProductInformation product={product}/>
            <div className="mt-4 lg:col-start-2 lg:row-start-2 lg:max-w-lg lg:self-start">
              <section aria-labelledby="options-heading">
                  <div className="mt-10">
                    {token && (
                      <div className="flex">
                        <div className="flex mr-8">
                          <button disabled={productQty <= 1} className="flex items-center justify-center disabled:opacity-50" onClick={decreaseQty}>
                            <MinusCircleIcon className="
                            block h-7 w-7 stroke-gray-600 hover:stroke-green-600 active:stroke-green-600 " />
                          </button>
                          <input id="quantity" className={`w-16 mx-3 border border-gray-300 border-b-2 border-t-0 border-x-0  rounded-md justify-center items-center focus:border-green-500 focus:ring-green-500 active:border-green-500 text-xl font-bold text-gray-600 text-center ${errorQuantity ? "focus:border-red-500 focus:ring-red-500 active:border-red-500" : ""}`} type="number" defaultValue={1} value={productQty} onChange={(e) => validateQuantity(e.target.value)}/>
                          <button disabled={productQty >= product.stock || errorQuantity} onClick={increaseQty} className="flex items-center justify-center disabled:opacity-50 disabled:stroke-gray">
                            <PlusCircleIcon className="block h-7 w-7 stroke-gray-600 hover:stroke-green-600 active:stroke-green-600" />

                          </button>
                        </div>
                        <button
                        onClick={() => addToCart(id)}
                        disabled={productQty > product.stock || product.stock <= 0 || productQty < 1 || errorQuantity}
                        className="flex items-center justify-center disabled:opacity-60 rounded-md border border-transparent bg-green-500 py-2 px-8 text-lg font-bold text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                      >
                        Add to Cart
                      </button>
                      </div>
                    )}
                  </div>
              </section>
              <div className="text-red-700 text-sm font-semibold mt-2 h-10">{errorQuantity ? errorQuantity : " "}</div>
            </div>
          </div>
        </div>
        <Toaster />
        <Footer />
      </>
    );
}

export default ProductDetail;