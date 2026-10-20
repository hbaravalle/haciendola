import { useRef } from "react";
import styles from "./FormGroupOTP.module.scss";

// One box per digit, with keyboard navigation, paste and code autofill.
function FormGroupOTP({ title, length, value, onChange, disabled = false }) {
  const inputs = useRef([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  const focus = (index) => {
    const input = inputs.current[Math.max(0, Math.min(index, length - 1))];
    input?.focus();
    input?.select();
  };

  // Writes `typed` from box `index` on, then focuses the next box.
  const fill = (index, typed) => {
    const clean = typed.replace(/\D/g, "");
    if (!clean) return;
    const next = [...digits];
    clean
      .slice(0, length - index)
      .split("")
      .forEach((digit, offset) => (next[index + offset] = digit));
    onChange(next.join(""));
    focus(index + clean.length);
  };

  const handleChange = (index) => (e) => fill(index, e.target.value);

  const handleKeyDown = (index) => (e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...digits];
      if (next[index]) {
        next[index] = "";
      } else if (index > 0) {
        next[index - 1] = "";
        focus(index - 1);
      }
      onChange(next.join(""));
    }
    if (e.key === "ArrowLeft") focus(index - 1);
    if (e.key === "ArrowRight") focus(index + 1);
  };

  const handlePaste = (index) => (e) => {
    e.preventDefault();
    fill(index, e.clipboardData.getData("text"));
  };

  return (
    <div className={styles.formGroupOTP}>
      <label htmlFor="otp-0" className={styles.formGroupOTP__label}>
        {title}
      </label>
      <div className={styles.otpWrapper}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputs.current[index] = el)}
            id={`otp-${index}`}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            aria-label={`Digit ${index + 1}`}
            value={digit}
            disabled={disabled}
            onChange={handleChange(index)}
            onKeyDown={handleKeyDown(index)}
            onPaste={handlePaste(index)}
            onFocus={(e) => e.target.select()}
          />
        ))}
      </div>
    </div>
  );
}

export default FormGroupOTP;
