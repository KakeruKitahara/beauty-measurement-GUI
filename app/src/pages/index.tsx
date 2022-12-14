import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Styles from "../../styles/index.module.scss";
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
    const save_str: Profile = { name: nameValue, sex: sexValue };
    sessionStorage.setItem("b-user", JSON.stringify(save_str));
    Router.push("./guideline");
  };
  return (
    <div className={Styles.container}>
      <main className={Styles.main}>
        <h1 className={Styles.title}>表情補完自然度測定</h1>
        {alertPop}
        <div className={Styles.contents}>
          <Form className={Styles.form}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>名前</Form.Label>
              <Form.Control
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                className={Styles.inputform}
              />
            </Form.Group>
            <div className={Styles.radio}>
              <Buttons />
            </div>
          </Form>
          <div className={Styles.button}>
            <Button variant="primary" onClick={handleClick} >
              開始する
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};
