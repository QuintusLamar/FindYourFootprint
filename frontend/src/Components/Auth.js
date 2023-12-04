import axios from "axios";

const checkTokenExpiration = async (token) => {
  try {
    const response = await axios.post("http://127.0.0.1:5000/valid_token", {
      token: token,
      "Access-Control-Allow-Origin": "*",
    });

    const res = response.data;

    if (res.status === "success") {
      return false; // Token is still valid
    } else {
      return true; // Token has expired or is invalid
    }
  } catch (error) {
    console.error("Error:", error);
    return true; // Treat errors as expired tokens for simplicity
  }
};

export default checkTokenExpiration;
