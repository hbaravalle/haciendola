import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setOtp } from "../../../../redux/authSlice";
import toast from "react-hot-toast";
import FormGroupOTP from "../../../../components/FormGroupOTP/FormGroupOTP";
import styles from "./TypeOTP.module.scss";

function TypeOTPToken() {
  const [fullCode, setFullCode] = useState("");
  const [code1, setCode1] = useState("");
  const [code2, setCode2] = useState("");
  const [code3, setCode3] = useState("");
  const [code4, setCode4] = useState("");
  const [code5, setCode5] = useState("");
  const [code6, setCode6] = useState("");

  const navigate = useNavigate();
  const email = useSelector((state) => state.auth.email);
  const dispatch = useDispatch();

  const handleChangeCode1 = (e) => setCode1(e.target.value.toUpperCase());
  const handleChangeCode2 = (e) => setCode2(e.target.value.toUpperCase());
  const handleChangeCode3 = (e) => setCode3(e.target.value.toUpperCase());
  const handleChangeCode4 = (e) => setCode4(e.target.value.toUpperCase());
  const handleChangeCode5 = (e) => setCode5(e.target.value.toUpperCase());
  const handleChangeCode6 = (e) => setCode6(e.target.value.toUpperCase());

  const formGroupOTPProps = {
    code1,
    code2,
    code3,
    code4,
    code5,
    code6,
    handleChangeCode1,
    handleChangeCode2,
    handleChangeCode3,
    handleChangeCode4,
    handleChangeCode5,
    handleChangeCode6,
  };

  useEffect(() => {
    const updatedCode = [code1, code2, code3, code4, code5, code6].join("");
    setFullCode(updatedCode);
  }, [code1, code2, code3, code4, code5, code6]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (fullCode.length !== 6) return toast.error("Complete the entire code");
    try {
      const response = await fetch("http://localhost:3000/api/auth/otp-check", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ email, otp: fullCode }),
      });
      const data = await response.json();

      if (data.status === 401) return toast.error("Invalid code");
      if (data.status === 200) {
        dispatch(setOtp({ otp: fullCode }));
        navigate("/auth/new-password");
      }
    } catch (err) {
      console.log(err);
      toast.error("Server error. Try again");
    }
  };

  const handleResendEmail = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/otp", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.status === 200) {
        toast("Email sent to your inbox", {
          icon: "📩",
        });
      }
    } catch (err) {
      console.log(err);
      toast.error("Server error. Try again");
    }
  };

  return (
    <>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam
        voluptas laudantium maiores consequuntur minus amet enim praesentium
        saepe commodi ullam!
      </p>
      <form onSubmit={handleSubmit}>
        <FormGroupOTP
          title="Type you 6 digits security code"
          {...formGroupOTPProps}
        />
        <button type="submit">Validate code</button>
      </form>
      <small>
        Didn't get the code? <Link onClick={handleResendEmail}>Resend</Link>
      </small>
    </>
  );
}

export default TypeOTPToken;
