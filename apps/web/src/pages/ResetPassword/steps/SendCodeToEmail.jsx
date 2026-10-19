import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { login } from "../../../redux/authSlice";
import FormGroup from "../../../components/FormGroup";

function SendCodeToEmail() {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChangeEmail = (e) => setEmail(e.target.value);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/auth/otp", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (data.status === 404) toast.error("Email provided is not registered");
      if (data.status === 200) {
        dispatch(login({ email }));
        toast("Email sent to your inbox", {
          icon: "📩",
        });
        navigate("/auth/forgot-password/otp");
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
        <FormGroup
          title="Email address"
          type="text"
          name="email"
          value={email}
          onChange={handleChangeEmail}
        />
        <button type="submit">Recover password</button>
        <button onClick={() => navigate("/login")}>Back to login</button>
      </form>
      <small>
        Already have and account? <Link to="/login">Sign in</Link>
      </small>
    </>
  );
}

export default SendCodeToEmail;
