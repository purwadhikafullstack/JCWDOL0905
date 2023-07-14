import NavBar from "../../component/NavBar";
import Delivered from "../../component/Delivered";
import Carousel from "../../component/StaticBanner";
import { Category } from "../../component/category";
import Footer from "../../component/Footer";
import Suggested from "../../component/ProductSuggestion";
import { useState, useEffect } from "react";
import axios from "axios";
import { URL_GEO } from "../../helper";
import { useDispatch, useSelector } from "react-redux";
import { setUsrLocation } from "../../redux/locationSlice";
import { setBranchId } from "../../redux/branchSlice";
import { api } from "../../api/api";
import toast, { Toaster } from "react-hot-toast";
import pin from "../../assets/images/pin.png"
import PromoBanner from "./PromoBanner";


const LandingPage = () => {
  const dispatch = useDispatch();

  dispatch(
    setBranchId({
      branchId: localStorage.getItem("branchId"),
    })
  )


  const userLocation = useSelector((state) => state.locationSlice.value.usrLocation);
  const userLat = useSelector((state) => state.locationSlice.value.usrLat);
  const userLng = useSelector((state) => state.locationSlice.value.usrLng);
  const currentLocation = { userLocation, userLat, userLng };
  const user = useSelector((state) => state.userSlice); 
  const branchId = useSelector((state) => state.branchSlice.branchId);

  const [branchs, setBranch] = useState([]);
  const [address, setAddress] = useState([]);
  const [products, setProduct] = useState([]);

  useEffect(() => {
    function getLocation() {
      navigator.geolocation.getCurrentPosition(
        async function (position) {
          const urlGetLocation = `${URL_GEO}&q=${position.coords.latitude}%2C+${position.coords.longitude}`;
          const response = await axios.get(urlGetLocation);

          dispatch(
            setUsrLocation({
              usrLat: position.coords.latitude,
              usrLng: position.coords.longitude,
              usrLocation:
                response.data.results[0].components.city ||
                response.data.results[0].components.county ||
                response.data.results[0].components.municipality ||
                response.data.results[0].formatted ||
                "...",
              usrLocation:
                response.data.results[0].components.city ||
                response.data.results[0].components.county ||
                response.data.results[0].components.municipality ||
                response.data.results[0].formatted ||
                "...",
            })
          );
        },
        (error) => console.log(error),
        { maximumAge: 5000, timeout: 5000, enableHighAccuracy: true }
      );
    }
    getLocation();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const responseBranch = await api.get(`branch`);
        const responseAddress = await api.get(`address/user/${user.id}`);
        const responseProduct = await api.get(`suggest/${branchId}`);
        const branchsData = responseBranch.data.data;
        const addressData = responseAddress.data.data;
        const productData = responseProduct.data.results;

        setBranch(branchsData);
        setAddress(addressData);
        setProduct(productData);

      } catch (error) {
        toast.error("Fetch data failed");
      }
    }
    fetchData();
  }, [user, branchId]);

  return (
    <div>
      <NavBar />
      <Delivered
        currentLocation={currentLocation}
        branchsData={branchs}
        addressData={address}
      />
      <div className="mx-auto max-w-2xl py-1 px-4 sm:py-8 sm:px-6 md:max-w-4xl md:px-6 md:py-6 lg:max-w-7xl lg:px-8 md:py-6 bg-neutral-100">
        <Carousel />
        <Category />
        <PromoBanner />
        <span className="inline-flex items-start">
          <img src={pin} alt="" className="self-center w-4 h-4 rounded-full mr-1" />
          <span>
            {products.length > 0
              ? `${products[0].branch_name} (${products[0].city})`
              : ""}
          </span>
        </span>
        <br></br>
        <span>
          <strong className="text-lg font-bold sm:text-xl">
            Product Suggestion
          </strong>
          &emsp;
          <a href="/product" className="text-md sm:text-lg text-green-700">
            See All Products
          </a>
        </span>

        <Suggested productsData={products} />
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
