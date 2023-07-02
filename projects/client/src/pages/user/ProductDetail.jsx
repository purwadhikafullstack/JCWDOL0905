import NavBar from "../../component/NavBar";
import Footer from "../../component/Footer";
import { api } from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { countItem } from "../../redux/cartSlice";


const ProductDetail = () => {
    const dispatch = useDispatch()
    const Navigate = useNavigate()

    const id = useParams().id;
    const token = localStorage.getItem("token")
    const user = useSelector((state) => state.userSlice);
    const branchId = useSelector((state) => state.branchSlice.branchId);
    const [carts, setCarts] = useState([])

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
                        toast.success(deleteCart.data.message);
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
    }, [user, branchId]);

    return(
        <>
            <NavBar/>
            <div className="mx-auto max-w-2xl py-1 px-4 sm:py-8 sm:px-6 md:max-w-4xl md:px-6 md:py-6 lg:max-w-7xl lg:px-8 md:py-6 bg-neutral-100">
                <h3 className="text-lg font-bold sm:text-xl">Inventory Id: {id}</h3>
                {token &&
                    <button onClick={() => addToCart(id)} className="w-full rounded-md border border-transparent bg-green-600 py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50">
                        Add to Cart
                    </button>
                }
                <Toaster/>
            </div>
            <Footer/>
        </>
    )
}

export default ProductDetail;