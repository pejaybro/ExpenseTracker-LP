import axios from "axios";

export const apiCLient = axios.create({
  baseURL: "http://127.0.0.1:8080",
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ---------------------------------------------------
   REQUEST INTERCEPTOR
   - Automatically attach JWT token (if present)
--------------------------------------------------- */
apiCLient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/* ---------------------------------------------------
   RESPONSE INTERCEPTOR
   - Centralized error handling
   - Keeps your existing clean error messages
--------------------------------------------------- */
apiCLient.interceptors.response.use(
  (response) => response,
  (err) => {
    let errorMsg = "An Unknown Error Occurred";

    if (err.code === "ECONNABORTED") {
      errorMsg = "Server timed out. Please try again.";
    } else if (err.response) {
      // backend-sent error message
      errorMsg = err.response.data?.message || "A server error occurred.";

      // OPTIONAL: auto-logout on auth failure
      if (err.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } else if (err.request) {
      errorMsg =
        "No response from server. Please check your network connection.";
    } else {
      errorMsg = err.message;
    }

    return Promise.reject(new Error(errorMsg));
  },
);
