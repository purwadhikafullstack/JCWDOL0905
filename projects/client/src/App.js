import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { api } from "./api/api";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "./redux/userSlice";
import { loginAdmin   } from "./redux/adminSlice";
import { setBranchId } from "./redux/branchSlice";
import { setAccessToken, setAccessTokenAdmin } from "./redux/tokenSlice";
import { Loading } from "./pages/Loading";
import ProtectedPage from "./component/ProtectedPage";
import LandingPage from "./pages/user/LandingPage";
import Register from "./pages/user/Register";
import Login from "./pages/user/Login";
import VerificationSuccess from "./pages/user/VerificationSuccess";
import ResendEmailVerification from "./pages/user/ResendEmailVerification";
import ForgotPassword from "./pages/user/ForgotPassword";
import ResetPassword from "./pages/user/ResetPassword";
import ResendEmailResetPW from "./pages/user/ResendEmailResetPW"
import VerificationBridge from "./pages/user/VerificationBridge";
import VerificationPasswordBridge from "./pages/user/VerificationPasswordBridge";
import EditProfile from "./pages/user/EditProfile";
import Page404 from "./pages/404"
import { countItem } from "./redux/cartSlice";
import ProductsPage from "./pages/user/productsPage";
import CategoryPage from "./pages/user/categoryPage";
import ChangePassword from "./pages/user/ChangePassword";
import TokenInvalid from "./pages/TokenInvalid";
import Cart from "./pages/user/Cart";
import ProductDetail from "./pages/user/ProductDetail";
import Profile from "./pages/user/Profile";
import LoginAdmin from "./pages/admin/LoginAdmin";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import { ManageCategory } from "./pages/admin/ManageCategory";
import { ManageDiscount } from "./pages/admin/ManageDiscount";
import { ManageVoucher } from "./pages/admin/ManageVoucher";
import AdminManagement from "./pages/admin/AdminManagement";
import ProtectedPageAdmin from "./component/ProtectedPageAdmin";
import TokenInvalidAdmin from "./pages/admin/TokenInvalidAdmin";
import { ROLE } from "./constant/role";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const branchId = localStorage.getItem("branchId");
    const token_admin = localStorage.getItem("token_admin");
    dispatch(setBranchId({ branchId: branchId }));
    setTimeout(() => {setIsLoading(false)}, 1000);

    const fetchUser = async (token) => {
      try {
        const res = await api.get(`/users/auth/${token}`);
        dispatch(login(res.data.user));
        dispatch(setAccessToken(token));
      } catch (error) {
        window.location.href = "/token-invalid";
        localStorage.removeItem("token");
      }
    };
    if (token) {
      fetchUser(token);
    }
    const fetchAdmin = async (token_admin) => {
      try {
        const res = await api.get(`/admins/auth/${token_admin}`);
        dispatch(loginAdmin(res.data.admin));
        dispatch(setAccessTokenAdmin(token_admin));
      } catch (error) {
        console.log(error);
        window.location.href = "/token-invalid-admin";
        localStorage.removeItem("token_admin");
      }
    };
    if (token_admin) {
      fetchAdmin(token_admin);
    } 
      
    async function countCart() {
      try {
        const response = await api.get(`cart/count`, {
          'headers': {
            'Authorization': `Bearer ${token}`,
          },
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
    if (token) {
      countCart()
    }
  },[])

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route element={<ProtectedPage guestOnly={true}><Register /></ProtectedPage>} path="/register" />
              <Route element={<ProtectedPage guestOnly={true}><Login /></ProtectedPage>} path="/login" />
              <Route element={<ProtectedPage guestOnly={true}><VerificationSuccess /></ProtectedPage>} path="/verification-success" />
              <Route element={<ProtectedPage guestOnly={true}><ResendEmailVerification /></ProtectedPage>} path="/resend-verification" />
              <Route element={<ProtectedPage guestOnly={true}><ForgotPassword /></ProtectedPage>} path="/forgot-password" />
              <Route element={<ProtectedPage guestOnly={true}><ResetPassword /></ProtectedPage>} path="/reset-password" />
              <Route element={<ProtectedPage guestOnly={true}><ResendEmailResetPW /></ProtectedPage>} path="/resend-forgot-password" />
              <Route element={<ProtectedPage guestOnly={true}><VerificationBridge /></ProtectedPage>} path="/verify" />
              <Route element={<ProtectedPage guestOnly={true}><VerificationPasswordBridge /></ProtectedPage>} path="/verify-forgot-password" />
              <Route element={<ProtectedPage needLogin={true}><EditProfile /></ProtectedPage>} path="/edit-profile" />
              <Route Component={ProductsPage} path="/product" />
              <Route Component={CategoryPage} path="/category/:id" />
              <Route element={<ProtectedPage needLogin={true}><ChangePassword /></ProtectedPage>}path="/change-password" />
              <Route Component={TokenInvalid} path="/token-invalid" />
              <Route Component={LandingPage} path="/" />
              <Route Component={Page404} path="*" />
              <Route element={<ProtectedPage needLogin={true}><Profile /></ProtectedPage>} path="/profile" />
              <Route element={<ProtectedPage needLogin={true}><Cart /></ProtectedPage>} path="/cart" />
              <Route Component={ProductDetail} path="/product/:id" />
              <Route Component={LoginAdmin} path="/login-admin" />
              <Route Component={TokenInvalidAdmin} path="/token-invalid-admin" />
              <Route element={ <ProtectedPageAdmin roleRequired={[ROLE.BRANCH_ADMIN, ROLE.SUPER_ADMIN]}> <DashboardAdmin /> </ProtectedPageAdmin> } path="/admin/dashboard" />
              <Route element={ <ProtectedPageAdmin roleRequired={[ROLE.SUPER_ADMIN]}> <AdminManagement /> </ProtectedPageAdmin> } path="/admin/admin-management" />
              <Route Component={ManageCategory} path="/manage-category" />
              <Route Component={ManageDiscount} path="/manage-discount" />
              <Route Component={ManageVoucher} path="/manage-voucher" />
            </Routes>
          </BrowserRouter>
        </>
      )}
    </>
  );
}

export default App;
