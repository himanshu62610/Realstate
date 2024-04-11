import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/auth";
import axios from "axios";
import RedirectRoute from "./RedirectRoutes";
export default function PrivateRoute() {
  // context
  const [auth, setAuth] = useAuth();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (auth?.token) getCurrentUser();
  }, [auth?.token]);

  const getCurrentUser = async () => {
    try {
      const { data } = await axios.get("/current-user", {
        //ye server me check kar lenga token hai ki nahi

         //ye header ka kya use hai yaha par ise remove karne se bhi kuch change nahi hoga se padh lena
        headers: {
          Authorization: auth?.token,
        },
      });
      setOk(true);
    } catch (err) {
      setOk(false);
    }
  };

  return ok ? <Outlet /> : <RedirectRoute/>;
}