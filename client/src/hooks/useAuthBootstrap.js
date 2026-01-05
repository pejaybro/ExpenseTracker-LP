import { fetchMe } from "@/redux/slices/user-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useAuthBootstrap = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchMe());
    }
  }, [dispatch]);
};

export default useAuthBootstrap;
