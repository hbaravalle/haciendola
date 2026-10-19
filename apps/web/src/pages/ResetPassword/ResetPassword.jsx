import { useParams } from "react-router-dom";
import FormLayout from "../../layouts/Form/FormLayout";
import SendCodeToEmail from "./steps/SendCodeToEmail";
import TypeOTP from "./steps/TypeOTP";

function ResetPassword() {
  const { step } = useParams();

  return (
    <FormLayout>
      {!step && <SendCodeToEmail />}
      {step === "otp" && <TypeOTP />}
    </FormLayout>
  );
}

export default ResetPassword;
