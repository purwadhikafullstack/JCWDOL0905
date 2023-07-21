import { Navigate} from "react-router-dom";
import { useSelector} from "react-redux";
import { toast } from "react-hot-toast";
import { ROLE_DEFAULT_PATH } from "../constant/role";

const ProtectedPageAdmin = ({ children, roleRequired }) => {
  const { accessTokenAdmin } = useSelector(state => state.tokenSlice)
  const { role } = useSelector(state => state.adminSlice)
  const isTokenEmpty = accessTokenAdmin === ''

  const isHaveRoleAccess = roleRequired.includes(role)

  if (isTokenEmpty) {
    toast.error("Please login");
    return <Navigate to="/login-admin" />
  }

  if (!isHaveRoleAccess) {
    const path = ROLE_DEFAULT_PATH[role]
    return <Navigate to={path} />
  }
  
  return children;
};

export default ProtectedPageAdmin;