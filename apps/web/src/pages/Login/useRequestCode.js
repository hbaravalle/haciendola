import toast from "react-hot-toast";
import { errorMessage, useRequestCodeMutation } from "../../redux/api";

// Requests a login code and toasts the result. Resolves to true if sent.
export function useRequestCode() {
  const [requestCode, { isLoading }] = useRequestCodeMutation();

  const send = async (email) => {
    try {
      await requestCode(email).unwrap();
      toast("Check your inbox for the code", { icon: "📩" });
      return true;
    } catch (error) {
      toast.error(errorMessage(error, "Could not send the code. Try again"));
      return false;
    }
  };

  return [send, { isLoading }];
}
