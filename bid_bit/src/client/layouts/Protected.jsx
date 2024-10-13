import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import UserDataContext from "../contexts/UserDataContext";
import axios from "axios";

export default function Protected() {
  const [userData, setUserData] = useState(null);

  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const response = await axios.request({
        baseURL: import.meta.env.VITE_APP_SERVER_ADDRESS,
        url: "/api/user/me",
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (!response.data) {
        throw new Error("error fetching");
      }
      if (response.data) {
        setUserData(response.data);
        return { status: 200 };
      } else {
        setUserData(null);
        return { status: 400 };
      }
    } catch (err) {
      if (err.status === 401) {
        return { status: 401 };
      }
      console.error(err);
      return { status: 400 };
    }
  };

  useEffect(() => {
    const handler = async () => {
      const resp = await fetchUser();
      if (resp.status === 401) {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          navigate("/logout");
        } else {
          try {
            const response = await axios.request({
              baseURL: import.meta.env.VITE_APP_SERVER_ADDRESS,
              url: "/api/v1" + `/auth/refresh-token`,
              method: "POST",
              data: {
                refreshToken,
              },
            });
            localStorage.setItem("accessToken", response.data.accessToken);
            await fetchUser();
          } catch {
            navigate("/logout");
          }
        }
      } else if (resp.status === 400) {
        navigate("/logout");
      }
    };

    handler();
  }, []);
  return (
    <UserDataContext.Provider value={{ userData, setUserData }}>
      <Outlet />
    </UserDataContext.Provider>
  );
}
