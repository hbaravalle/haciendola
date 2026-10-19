import { useState } from "react";
import styles from "./FormGroupOTP.module.scss";

function FormGroupOTP({
  title,
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
}) {
  return (
    <div className={styles.formGroupOTP}>
      <label htmlFor="" className={styles.formGroupOTP__label}>
        {title}
      </label>
      <div className={styles.otpWrapper}>
        <input
          type="text"
          maxLength="1"
          name="code1"
          id="code1"
          onChange={handleChangeCode1}
          value={code1}
        />
        <input
          type="text"
          maxLength="1"
          name="code2"
          id="code2"
          onChange={handleChangeCode2}
          value={code2}
        />
        <input
          type="text"
          maxLength="1"
          name="code3"
          id="code3"
          onChange={handleChangeCode3}
          value={code3}
        />
        <input
          type="text"
          maxLength="1"
          name="code4"
          id="code4"
          onChange={handleChangeCode4}
          value={code4}
        />
        <input
          type="text"
          maxLength="1"
          name="code5"
          id="code5"
          onChange={handleChangeCode5}
          value={code5}
        />
        <input
          type="text"
          maxLength="1"
          name="code6"
          id="code6"
          onChange={handleChangeCode6}
          value={code6}
        />
      </div>
    </div>
  );
}

export default FormGroupOTP;
