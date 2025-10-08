import { useState, useEffect } from "react";
import { Outlet  } from "react-router-dom";
import axios from "axios";
import Spinner from "../../spinner/Spinner"
import { useAuth } from "../../Context/Auth";

export default function PrivateRoute() {
  const [ok, setOk] = useState(false);
  const [auth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/user-required`)
      if (res.data.ok) {
        setOk(true);
      } else {
        setOk(false);
      }
    };

    if (auth?.token) authCheck();
     //eslint-disable-next-line
  }, [auth?.token]);

  return ok ? <Outlet /> : <Spinner />;
}