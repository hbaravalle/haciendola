import { useParams } from "react-router-dom";
import FormLayout from "../../layouts/Form/FormLayout";
import EnterEmail from "./steps/EnterEmail";
import EnterCode from "./steps/EnterCode";

// Each step has its own URL (/login, /login/code) so the back button moves
// between them.
function Login() {
  const { step } = useParams();

  return (
    <FormLayout>
      {!step && <EnterEmail />}
      {step === "code" && <EnterCode />}
    </FormLayout>
  );
}

export default Login;
