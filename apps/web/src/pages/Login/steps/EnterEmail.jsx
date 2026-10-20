import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { login, setPendingEmail } from "../../../redux/authSlice";
import { errorMessage, useStartDemoMutation } from "../../../redux/api";
import FormGroup from "../../../components/FormGroup";
import { useRequestCode } from "../useRequestCode";
import styles from "./EnterEmail.module.scss";

function EnterEmail() {
  const pendingEmail = useSelector((state) => state.auth.pendingEmail);
  const [email, setEmail] = useState(pendingEmail ?? "");
  const [requestCode, { isLoading: sending }] = useRequestCode();
  const [startDemo, { isLoading: startingDemo }] = useStartDemoMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (await requestCode(email)) {
      dispatch(setPendingEmail(email.trim().toLowerCase()));
      navigate("/login/code");
    }
  };

  const handleDemo = async () => {
    try {
      const session = await startDemo().unwrap();
      dispatch(login(session));
      toast("Welcome to the demo!", { icon: "✨" });
      navigate("/");
    } catch (error) {
      toast.error(errorMessage(error, "Could not start the demo. Try again"));
    }
  };

  return (
    <>
      <button
        type="button"
        className={styles.demoButton}
        onClick={handleDemo}
        disabled={startingDemo}
      >
        {startingDemo ? "Opening the demo…" : "Try the demo"}
      </button>
      <p>
        Jump straight into a demo catalog shared by every visitor. It resets
        every day, and no email is needed.
      </p>

      <div className={styles.divider}>or get your own catalog</div>

      <p>
        Sign in with your email and you get a private copy of the catalog that
        only you can see. It&apos;s yours for 24 hours: then the account and
        its catalog are deleted.
      </p>

      <form onSubmit={handleSubmit}>
        <FormGroup
          title="Email address"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" disabled={sending || !email}>
          {sending ? "Sending…" : "Send me a code"}
        </button>
      </form>
      <p>
        The code comes from <strong>@demos.hernanbaravalle.com</strong>. Your
        email is only used to sign you in: no newsletters, no ads, and it&apos;s
        never shared. Rather not use your personal email? A disposable one from{" "}
        <a
          href="https://temp-mail.org/en"
          target="_blank"
          rel="noopener noreferrer"
        >
          temp-mail.org
        </a>{" "}
        works too.
      </p>
    </>
  );
}

export default EnterEmail;
