import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Router from 'next/router';
import React, { useState } from "react";
import Styles from "../../styles/index.module.scss";

export default () => {
  const [passValue, setPassValue] = useState<string>("");
  const handleClick = () => {
    Router.replace(`./${passValue}`);
  }


  return (<div className={Styles.contents}>
    <Form>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>パスワードを入力してください。</Form.Label>
        <Form.Control
          value={passValue}
          onChange={(e) => setPassValue(e.target.value)}
        />
      </Form.Group>
    </Form>
    <div className={Styles.button}>
      <Button variant="primary" onClick={handleClick} >
        OK
      </Button>
    </div>
  </div>);
};