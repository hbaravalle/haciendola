import toast from "react-hot-toast";
import { errorMessage, useRequestCodeMutation } from "../../redux/api";

// Asks the API to email a login code and tells the user how it went. The
// returned function resolves to true when the code was sent.
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
