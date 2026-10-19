import { Link, useParams } from "react-router-dom";
import FormLayout from "../../layouts/Form/FormLayout";
import FormGroup from "../../components/FormGroup";
import SendCodeToEmail from "./steps/SendCodeToEmail";
import TypeOTP from "./steps/TypeOTP";

function ResetPassword() {
  const { step } = useParams();

  return (
    <FormLayout>
      {!step && <SendCodeToEmail />}
      {step === "otp" && <TypeOTP />}
      {step === "reset" && <NewPassword />}
    </FormLayout>
  );
}

export default ResetPassword;
