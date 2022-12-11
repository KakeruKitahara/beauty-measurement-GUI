import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import styles from "../../styles/index.module.scss";
import React, { useState } from "react";
import Router from "next/router";
import { Profile } from "../components/interfaces";

export default () => {
  const [nameValue, setNameValue] = useState<string>("");
  const [sexValue, setSexValue] = useState<string>("");
  const [alertPop, alertPopSet] = useState<JSX.Element>(null!);

  const sex = ["男", "女"];

  const Buttons = () => {
    return (
      <div>
        {sex.map((sex, id) => (
          <Form.Check
            inline
            key={id}
            label={sex}
            name="group1"
            type="radio"
            value={sex}
            onChange={(e) => setSexValue(e.target.value)}
            checked={sexValue === sex}
          />
        ))}
      </div>
    );
  };

  const handleClick = () => {
    if (nameValue === "" || sexValue === "") {
      alertPopSet(<Alert variant="danger">入力項目が不足しています。すべて記入してください。</Alert>);
      return;
    }
    const save_str : Profile = { name: nameValue, sex: sexValue };
    sessionStorage.setItem("beauty-measurement", JSON.stringify(save_str));
    Router.push("./guideline");
  };
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>表情補完自然度測定</h1>
        {alertPop}
        <div  className={styles.contents}>
          <Form className={styles.form}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>名前</Form.Label>
              <Form.Control
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                className={styles.inputform}
              />
            </Form.Group>
            <div className={styles.radio}>
              <Buttons />
            </div>
          </Form>
          <div className={styles.button_wrapper}>
          <Button variant="primary" onClick={handleClick} className={styles.button}>
            開始する
          </Button>
          </div>
        </div>
      </main>
    </div>
  );
};
