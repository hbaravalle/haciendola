import styles from "./FormGroup.module.scss";

function FormGroup({
  title,
  name,
  type = "text",
  value = "",
  onChange,
  children,
  size = 100,
}) {
  return (
    <div className={styles.formGroup}>
      <label className={styles.formGroup__label} htmlFor={name}>
        {title}
      </label>
      {type !== "textarea" && (
        <>
          <input
            className={styles.formGroup__input}
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
          />
          {children}
        </>
      )}
      {type === "textarea" && (
        <textarea
          name={name}
          id={name}
          className={styles.formGroup__textarea}
          rows="4"
          defaultValue={value}
          onChange={onChange}
        ></textarea>
      )}
    </div>
  );
}

export default FormGroup;
