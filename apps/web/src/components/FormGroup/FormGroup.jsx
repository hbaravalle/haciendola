import classNames from "classnames";
import styles from "./FormGroup.module.scss";

// A labelled input or textarea. `prefix` and `suffix` show a unit inside the
// field ($, g), `hint` a short note under it. Any other prop (required, min,
// inputMode, placeholder...) goes straight to the input.
function FormGroup({
  title,
  name,
  type = "text",
  value = "",
  onChange,
  prefix,
  suffix,
  hint,
  children,
  ...inputProps
}) {
  const hintId = hint ? `${name}-hint` : undefined;
  const fieldProps = {
    id: name,
    name,
    value: value ?? "",
    onChange,
    "aria-describedby": hintId,
    ...inputProps,
  };

  return (
    <div className={styles.formGroup}>
      <label className={styles.formGroup__label} htmlFor={name}>
        {title}
        {inputProps.required && (
          <span className={styles.formGroup__required} aria-hidden="true">
            *
          </span>
        )}
      </label>
      {type === "textarea" ? (
        <textarea className={styles.formGroup__textarea} rows="4" {...fieldProps} />
      ) : (
        <div
          className={classNames(styles.formGroup__field, {
            [styles["formGroup__field--prefixed"]]: prefix,
            [styles["formGroup__field--suffixed"]]: suffix,
          })}
        >
          {prefix && <span className={styles.formGroup__prefix}>{prefix}</span>}
          <input className={styles.formGroup__input} type={type} {...fieldProps} />
          {suffix && <span className={styles.formGroup__suffix}>{suffix}</span>}
        </div>
      )}
      {hint && (
        <small id={hintId} className={styles.formGroup__hint}>
          {hint}
        </small>
      )}
      {children}
    </div>
  );
}

export default FormGroup;
