import { useParams } from "react-router-dom";
import FormLayout from "../../layouts/Form/FormLayout";
import EnterEmail from "./steps/EnterEmail";
import EnterCode from "./steps/EnterCode";

// One URL per step, so the back button works.
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
