import { setUser } from "@/redux/slices/user-slice";
import { PATH } from "@/router/routerConfig";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

const GoogleAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      navigate("/login", { replace: true });
    }

    localStorage.setItem("token", token);
    dispatch(setUser(token));
    navigate(PATH.home, { replace: true });
  }, []);
};

export default GoogleAuthSuccess;
