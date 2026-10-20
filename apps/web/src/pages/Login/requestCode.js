import toast from "react-hot-toast";
import { API_URL } from "../../config.js";

// Asks the API to email a login code and tells the user how it went. Returns
// true when the code was sent.
export async function requestCode(email) {
  try {
    const response = await fetch(`${API_URL}/auth/otp`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();

    if (data.status === 200) {
      toast("Check your inbox for the code", { icon: "📩" });
      return true;
    }
    toast.error(data.message ?? "Could not send the code. Try again");
    return false;
  } catch (err) {
    console.log(err);
    toast.error("Server error. Try again");
    return false;
  }
}
