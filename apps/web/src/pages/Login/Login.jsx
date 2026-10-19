import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { login } from "../../redux/authSlice";
import FormGroup from "../../components/FormGroup";
import FormLayout from "../../layouts/Form/FormLayout";
import styles from "./Login.module.scss";

function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleUserChange = (e) => setUser(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ user, password }),
      });
      const data = await response.json();

      if (data.status === 404) toast.error("Wrong credentials.");
      if (data.status === 200 && data.result.token) {
        dispatch(login({ token: data.result.token, email: data.result.email }));
        toast("Welcome!", {
          icon: "✨",
        });
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      toast.error("Server error. Try again");
    }
  };

  return (
    <>
      <FormLayout>
        <form onSubmit={handleSubmit}>
          <FormGroup
            title="Username or email"
            name="user"
            value={user}
            onChange={handleUserChange}
          />
          <FormGroup
            title="Password"
            name="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          >
            <small
              style={{
                fontSize: "0.7rem",
                width: "100%",
                display: "inline-block",
                textAlign: "right",
              }}
            >
              <Link to="/auth/forgot-password">Forgot password?</Link>
            </small>
          </FormGroup>
          <button type="submit">Sign in</button>
        </form>
        <small>
          Not registered yet? <Link to="/register">Create and account</Link>
        </small>
      </FormLayout>
    </>
  );
}

export default Login;
