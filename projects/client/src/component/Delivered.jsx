import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Text,
    useDisclosure,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    Input,
    DrawerFooter,
    Select,
    Form,
    FormControl,
    FormHelperText,
    FormLabel,
} from '@chakra-ui/react'
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function Delivered(props) {
    const Navigate = useNavigate()
    const dispatch = useDispatch()
    const branchsData = props.branchsData
    const addressData = props.addressData
    const currentLocation = props.currentLocation

    const usrLocation = currentLocation.userLocation
    const usrLat = currentLocation.userLat
    const usrLng = currentLocation.userLng

    const [location, setLocation] = useState(localStorage.getItem("address"));
    const [branchId, setBranchId] = useState(0);

    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef()

    function getDistance(lat1, lon1, lat2, lon2, unit) {
        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        }
        else {
            var radlat1 = Math.PI * lat1/180;
            var radlat2 = Math.PI * lat2/180;
            var theta = lon1-lon2;
            var radtheta = Math.PI * theta/180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180/Math.PI;
            dist = dist * 60 * 1.1515;
            if (unit=="K") { dist = dist * 1.609344 }
            if (unit=="N") { dist = dist * 0.8684 }
            return dist;
        }
    }

    function sortAddress(lat, lng){
        for(let i=0; i<addressData.length; i++){
            let dist = getDistance(parseFloat(lat), parseFloat(lng), parseFloat(addressData[i].latitude), parseFloat(addressData[i].longitude), "K").toFixed(2);
            addressData[i].distance = dist;
        }
          
        let sortedArr = addressData.sort(function(a,b) {return a.distance - b.distance});
        localStorage.setItem("nearestAddressId", sortedArr[0].id);
    }

    function sortBranch(lat, lng){
        for(let i=0; i<branchsData.length; i++){
            let dist = getDistance(parseFloat(lat), parseFloat(lng), parseFloat(branchsData[i].latitude), parseFloat(branchsData[i].longitude), "K").toFixed(2);
            branchsData[i].distance = dist;
        }
          
        let sortedArr = branchsData.sort(function(a,b) {return a.distance - b.distance});
        localStorage.setItem("branchId", sortedArr[0].id);
    }

    const setAddress = async () => {
        let addressId = document.getElementById("selectAddress").value;
        localStorage.setItem("addressId", addressId);
        var index = addressData.findIndex(item => item.id == addressId)
        sortBranch(addressData[index].latitude, addressData[index].longitude)

        localStorage.setItem("address", addressData[index].city);
        setLocation(addressData[index].city)
        setTimeout(() => {Navigate('/')}, 500);
    }

    useEffect(() => {
        function setStoreBranchId() {
          try{
            if(addressData.length==0){
                // localStorage.setItem("addressId", 0);
                localStorage.setItem("nearestAddressId", 0);
            }else{
                sortAddress(usrLat, usrLng)
            }

            if(localStorage.getItem("branchId")==0 || localStorage.getItem("branchId")==undefined){
                sortBranch(usrLat, usrLng)
            }
    
            if(branchId==0){
                setBranchId(localStorage.getItem("branchId"))
                setTimeout(() => {Navigate('/')}, 1000);
            }

            if(localStorage.getItem("address")==undefined){
                localStorage.setItem("address", usrLocation);
            }
          }catch(error){
            toast.error("Set branch failed");
          }
        }
        setStoreBranchId();
    }, [branchId, addressData, branchsData]);

    return (
        <div>
            <div className="bg-white">
                <div className="mx-auto max-w-7xl py-2 px-6 md:flex md:items-center md:justify-between lg:px-8">
                    <div className="mt-8 md:order-1 md:mt-0">
                        <div>
                            <p className="inline-flex my-2">
                                <span className="inline-flex items-start">
                                    <img src="https://cdn-icons-png.flaticon.com/512/67/67347.png" alt="" className="self-center w-4 h-4 rounded-full mr-1" />
                                    <span>
                                        Delivered to <b>{location ? location : usrLocation}</b> &nbsp;&nbsp;
                                        <button>
                                            <img ref={btnRef} onClick={onOpen} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXXZ-FgGd7xToOSqq19X-YadFnwh3EEFJsRg&usqp=CAU" alt="" className="self-center w-3 h-3 rounded-full mx-1" />
                                        </button>
                                    </span>
                                    
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Drawer
            isOpen={isOpen}
            placement='top'
            onClose={onClose}
            finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Shipping Address ({addressData.length} registered)</DrawerHeader>
        
                    <DrawerBody>
                        <FormControl>
                            <FormLabel>Select Address</FormLabel>
                            <Select id="selectAddress">
                                {addressData.map((address)=>{
                                    return(
                                        <option key={address.id} selected={address.id==localStorage.getItem("addressId")} value={address.id}>{address.label} - {address.address_detail} - {address.city} {address.id == localStorage.getItem("nearestAddressId") ? "(Nearest)" : ""}</option>
                                    )
                                })}
                            </Select>
                            <FormHelperText>Current location (approximately): {usrLocation}</FormHelperText>
                        </FormControl>
                    </DrawerBody>
        
                    <DrawerFooter>
                        <Button variant='outline' mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme='blue' onClick={() => setAddress()}>Save</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    )
}
  