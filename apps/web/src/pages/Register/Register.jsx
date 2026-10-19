import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Register.module.scss";
import FormLayout from "../../layouts/Form/FormLayout";
import FormGroup from "../../components/FormGroup";
import toast from "react-hot-toast";

function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");

  const navigate = useNavigate();

  const handleNameChange = (e) => setName(e.target.value);
  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleRepasswordChange = (e) => setRepassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ name, username, email, password }),
      });
      const data = await response.json();
      if (data.status === 500) toast.error("Registration failed");
      if (data.status === 201) {
        toast.success("User created");
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <FormLayout>
      <form className={styles.formLayout__form} onSubmit={handleSubmit}>
        <FormGroup
          title="Name"
          name="name"
          value={name}
          onChange={handleNameChange}
        />
        <FormGroup
          title="Username"
          name="username"
          value={username}
          onChange={handleUsernameChange}
        />
        <FormGroup
          title="Email address"
          name="email"
          type="email"
          value={email}
          onChange={handleEmailChange}
        />
        <FormGroup
          title="Password"
          name="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
        <FormGroup
          title="Confirm password"
          name="repassword"
          type="password"
          value={repassword}
          onChange={handleRepasswordChange}
        />
        <button type="submit">Sign up</button>
      </form>
      <small>
        Already have and account? <Link to="/login">Sign in</Link>
      </small>
    </FormLayout>
  );
}

export default Register;
