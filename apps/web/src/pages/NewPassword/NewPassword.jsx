import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import FormLayout from "../../layouts/Form/FormLayout";
import FormGroup from "../../components/FormGroup";
import { recover, setOtp } from "../../redux/authSlice";

function NewPassword() {
  const userOtp = useSelector((state) => state.auth.otp);
  const email = useSelector((state) => state.auth.email);
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChangePassword = (e) => setPassword(e.target.value);
  const handleChangeRepassword = (e) => setRepassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ email, otp: userOtp, newPassword: password }),
        }
      );
      const data = await response.json();
      if (data.status === 401) return toast.error("Invalid code");
      if (data.status === 200) {
        dispatch(setOtp({ otp: null }));
        dispatch(recover({ email: null }));
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
      toast.error("Server error. Try again");
    }
  };

  useEffect(() => {
    const checkOtp = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/auth/otp-check",
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({ email, otp: userOtp }),
          }
        );
        const data = await response.json();
        if (data.status === 401 || data.status === 500) {
          toast.error("Invalid code");
          navigate("/auth/forgot-password/otp");
        }
      } catch (err) {
        console.log(err);
      }
    };
    checkOtp();
  }, []);

  return (
    <FormLayout>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam
        voluptas laudantium maiores consequuntur minus amet enim praesentium
        saepe commodi ullam!
      </p>
      <form onSubmit={handleSubmit}>
        <FormGroup
          title="New password"
          name="newpassword"
          type="password"
          value={password}
          onChange={handleChangePassword}
        />
        <FormGroup
          title="Repeat password"
          name="repassword"
          type="password"
          value={repassword}
          onChange={handleChangeRepassword}
        />
        <button type="submit">Change password</button>
      </form>
    </FormLayout>
  );
}

export default NewPassword;
