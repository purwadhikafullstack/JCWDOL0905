import NavBar from "../../component/NavBar";
import Delivered from "../../component/Delivered";
import Carousel from "../../component/StaticBanner";
import Footer from "../../component/Footer";
import Suggested from "../../component/ProductSuggestion";
import { useState, useEffect } from "react";
import axios from "axios";
import { URL_GEO } from "../../helper";
import { useDispatch, useSelector } from "react-redux";
import { setUsrLocation } from "../../redux/locationSlice";
import { api } from "../../api/api";
import toast, { Toaster } from "react-hot-toast";

const LandingPage = () => {
  const userLocation = useSelector(
    (state) => state.locationSlice.value.usrLocation
  );
  const userLat = useSelector((state) => state.locationSlice.value.usrLat);
  const userLng = useSelector((state) => state.locationSlice.value.usrLng);
  const user = useSelector((state) => state.userSlice)

  const currentLocation = { userLocation, userLat, userLng };
  const branchId = localStorage.getItem("branchId");

  const dispatch = useDispatch();

  const [branchs, setBranch] = useState([]);
  const [address, setAddress] = useState([]);
  const [products, setProduct] = useState([]);

  useEffect(() => {
    function getLocation() {
      navigator.geolocation.getCurrentPosition(
        async function (position) {
          console.log("Latitude is :", position.coords.latitude);
          console.log("Longitude is :", position.coords.longitude);
          console.log("Accuracy :", position.coords.accuracy);
          const urlGetLocation = `${URL_GEO}&q=${position.coords.latitude}%2C+${position.coords.longitude}`;
          const response = await axios.get(urlGetLocation);

          let result = response.data.results[0].components.city;
          if (!result) {
            result = response.data.results[0].components.county;
          } else if (!result) {
            result = response.data.results[0].components.village;
          } else if (!result) {
            result = response.data.results[0].formatted;
          }

          dispatch(
            setUsrLocation({
              usrLat: position.coords.latitude,
              usrLng: position.coords.longitude,
              usrLocation: result,
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
      try{
        const responseBranch = await api.get(`branch`);
        const responseAddress = await api.get(`address/${user.id}`);
        const responseProduct = await api.get(`suggest/${branchId}`);
        const branchsData = responseBranch.data.data;
        const addressData = responseAddress.data.data;
        const productData = responseProduct.data.results;

        setBranch(branchsData);
        setAddress(addressData);
        setProduct(productData);
      }catch(error){
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
      <Carousel />
      <Suggested productsData={products} />
      <Footer />
    </div>
  );
 
};

export default LandingPage;
