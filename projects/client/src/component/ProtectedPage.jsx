import { Navigate} from "react-router-dom";
import { useSelector} from "react-redux";
import { toast } from "react-hot-toast";

const ProtectedPage = ({ children, needLogin, guestOnly }) => {
  const { accessToken } = useSelector(state => state.tokenSlice)
  const accessToken_user = accessToken
  const isTokenEmpty = accessToken_user === ''

  if (needLogin && isTokenEmpty) {
    toast.error("Please login");
    return <Navigate to="/login" />
  }

  if (guestOnly && !isTokenEmpty) {
    return <Navigate to="/" />
  }
  
  return children;
};

export default ProtectedPage;