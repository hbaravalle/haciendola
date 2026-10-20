import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { OTP_LENGTH, OTP_RESEND_SECONDS } from "@haciendola/shared";
import { login } from "../../../redux/authSlice";
import FormGroupOTP from "../../../components/FormGroupOTP";
import { API_URL } from "../../../config.js";
import { requestCode } from "../requestCode";

function EnterCode() {
  const email = useSelector((state) => state.auth.pendingEmail);
  const token = useSelector((state) => state.auth.token);
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resendIn, setResendIn] = useState(OTP_RESEND_SECONDS);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  const verify = async (fullCode) => {
    setVerifying(true);
    try {
      const response = await fetch(`${API_URL}/auth/verify`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ email, otp: fullCode }),
      });
      const data = await response.json();

      if (data.status === 200) {
        // Storing the session clears the pending email; the redirect below
        // then takes the user to the catalog.
        dispatch(login(data.result));
        toast("Welcome!", { icon: "✨" });
        return;
      }
      toast.error(data.message ?? "Invalid code");
      setCode("");
    } catch (err) {
      console.log(err);
      toast.error("Server error. Try again");
    }
    setVerifying(false);
  };

  // Send the code as soon as the last digit is typed or pasted.
  const handleCodeChange = (next) => {
    setCode(next);
    if (next.length === OTP_LENGTH && !verifying) verify(next);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.length !== OTP_LENGTH) return toast.error("Complete the entire code");
    verify(code);
  };

  const handleResend = async () => {
    if (await requestCode(email)) {
      setCode("");
      setResendIn(OTP_RESEND_SECONDS);
    }
  };

  if (token) return <Navigate to="/" replace />;
  if (!email) return <Navigate to="/login" replace />;

  return (
    <>
      <p>
        We sent a {OTP_LENGTH}-digit code to <strong>{email}</strong>. It
        expires in 10 minutes.
      </p>
      <form onSubmit={handleSubmit}>
        <FormGroupOTP
          title="Login code"
          length={OTP_LENGTH}
          value={code}
          onChange={handleCodeChange}
          disabled={verifying}
        />
        <button type="submit" disabled={verifying}>
          {verifying ? "Checking…" : "Sign in"}
        </button>
        <button type="button" onClick={() => navigate("/login")}>
          Use another email
        </button>
      </form>
      <small>
        Didn&apos;t get the code?{" "}
        {resendIn > 0 ? (
          `Resend in ${resendIn}s`
        ) : (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleResend();
            }}
          >
            Resend
          </a>
        )}
      </small>
    </>
  );
}

export default EnterCode;
