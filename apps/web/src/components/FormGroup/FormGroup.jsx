import classNames from "classnames";
import styles from "./FormGroup.module.scss";

// Labelled input or textarea. `prefix`/`suffix` show a unit; `error` replaces
// `hint`. Other props go to the input.
function FormGroup({
  title,
  name,
  type = "text",
  value = "",
  onChange,
  prefix,
  suffix,
  hint,
  error,
  children,
  ...inputProps
}) {
  const note = error ?? hint;
  const noteId = note ? `${name}-note` : undefined;
  const fieldProps = {
    id: name,
    name,
    value: value ?? "",
    onChange,
    "aria-describedby": noteId,
    "aria-invalid": error ? true : undefined,
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
      {note && (
        <small
          id={noteId}
          className={classNames(styles.formGroup__hint, {
            [styles["formGroup__hint--error"]]: error,
          })}
        >
          {note}
        </small>
      )}
      {children}
    </div>
  );
}

export default FormGroup;
