import React, { useEffect, useState } from 'react';
import { api } from "../../api/api";
import { useNavigate } from "react-router-dom";
import NotFoundImg from "../../assets/images/page_not_found.svg"

const VerificationBridge = () => {
  const Navigate = useNavigate();
  const [isTokenError, setIsTokenError] = useState(false)

  const verifyUser = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const idUser = urlParams.get('id_user');
      const token = urlParams.get('token');

      const response = await api.get(`users/${idUser}/verify/${token}`);

      if (response.status === 200) {
        console.log('Verification successful');
        Navigate("/verification-success")
      } else {
        console.error('Verification failed');
        setIsTokenError(true)
      }
    } catch (error) {
      console.error('Error occurred during verification:', error);
      setIsTokenError(true)
    }
  };

  useEffect(() => {
    verifyUser();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
    {isTokenError && (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <button onClick={() => Navigate("/")}><img src={NotFoundImg} alt="Not Found" style={{ height: "200px" }} /></button>
      <div className="flex flex-col bg-white shadow-md mt-8 px-4 sm:px-6 md:px-8 lg:px-10 py-5 rounded-3xl w-2/3 sm:w-3/4 md:w-2/3 lg:w-1/2 max-w-md">
        <div className="mt-5 mb-5">
          <div className="font-medium self-center text-xl text-center text-black">Invalid token for verification</div>
        </div>
        <button 
          className="flex mt-2 items-center justify-center focus:outline-none text-white text-sm uppercase sm:text-base bg-green-500 hover:bg-green-700 rounded-2xl py-2 w-full transition duration-150 ease-in"
          onClick={() => Navigate("/resend-verification")}>
            Resend Verification Email
        </button>
      </div>      
    </div>
    )}
  </div>
  );
};

export default VerificationBridge;
