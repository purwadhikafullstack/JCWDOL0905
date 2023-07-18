import React, { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import Layout from '../../component/Layout'
import { api } from '../../api/api';
import { ROLE, ROLE_TO_TEXT } from '../../constant/role';
import ModalChangePassword from '../../component/adminProfile/ModalChangePassword';
import { useSelector } from 'react-redux';

function AdminProfile() {
    const token_admin = localStorage.getItem("token_admin");
    const [adminProfileData, setAdminProfileData] = useState("")
    const [open, setOpen] = useState(false)
    const { role } = useSelector((state) => state.adminSlice);


    const renderChangePasswordButton = () => {
        return role === ROLE.SUPER_ADMIN ? (
            <div className='mb-4'>
            <button className="mt-10 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto" 
            onClick={() => setOpen(true)}>Change Password</button>
        </div>
        ): null;
    };

    const renderBranchData = () => {
        return role === ROLE.BRANCH_ADMIN ? (
        <>
            <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="address">Store Name:</label>
                        <p className="text-gray-900 text-lg" id="address">{adminProfileData?.Store_Branch?.branch_name}</p>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="address">Province:</label>
                        <p className="text-gray-900 text-lg" id="address">{adminProfileData?.Store_Branch?.province}</p>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="address">City:</label>
                        <p className="text-gray-900 text-lg" id="address">{adminProfileData?.Store_Branch?.city}</p>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="address">Address:</label>
                        <p className="text-gray-900 text-lg" id="address">{adminProfileData?.Store_Branch?.address}</p>
                    </div>
        </>
        ): null;
    }
    const fetchAdmin = async () => {
        const config = {
            headers: { Authorization: `Bearer ${token_admin}` },
          };
        try {
            const res = await api.get(`/profiles/admin/profile`, config);
            setAdminProfileData(res.data.data)

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchAdmin();
    }, [])

    return (
        <Layout>
            <div className="px-4 sm:px-6 lg:px-8">
                <div className='border-b-2 border-blue-900 p-5'>
                    <h1 className="text-xl font-semibold text-gray-900 text-center justify-center">
                        Admin Profile
                    </h1>
                </div>
                <div className="py-4 px-6">
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="name">Name :</label>
                        <p className="text-gray-900 text-lg" id="name">{adminProfileData.admin_name}</p>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="email">Role :</label>
                        <p className="text-gray-900 text-lg" id="email">{ROLE_TO_TEXT[adminProfileData.role]}</p>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="email">Email :</label>
                        <p className="text-gray-900 text-lg" id="email">{adminProfileData.email}</p>
                    </div>
                    {renderBranchData()}
                    {renderChangePasswordButton()}
                </div>
            </div>
            <ModalChangePassword open={open} setOpen={setOpen} />
            <Toaster />
        </Layout>
    )
}

export default AdminProfile