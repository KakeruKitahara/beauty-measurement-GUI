import Button from "react-bootstrap/Button";
import styles from "../../styles/guideline.module.scss";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Router from "next/router";
import React, { useState } from "react";
import { Result, sort_func, Data, Profile } from "../components/interfaces";

export default () => {
  let results: Result[];
  let Morphing

  const [selValue, setSelValue] = useState<number>(0);
  const [focusCommentValue, setFocusCommentValue] = useState<number>(0);
  const [commentValue, setCommentValue] = useState<string>("");
  const [stepValue, setStepValue] = useState<number>(1);
  const [alertPop, alertPopSet] = useState<JSX.Element>(null!);

  if (typeof document !== "undefined") {
    document.onkeydown = function (e) {
      if (focusCommentValue === 0) {
        switch (e.key) {
          case "a":
            setSelValue(1);
            break;
          case "s":
            setSelValue(2);
            break;
          case "d":
            setSelValue(3);
            break;
          case "f":
            setSelValue(4);
            break;
          case "g":
            setSelValue(5);
            break;
          case "j":
            handleClick();
        }
      }
    };
  }

  const handleClick = () => {
    setStepValue((prevValue) => prevValue + 1);
    console.log(stepValue);
    getStaticProps();

    if (selValue === 0) {
      alertPopSet(
        <Alert variant="danger">
          入力項目が不足しています。選択課題は入力してください。
        </Alert>
      );
      return;
    }

    results.push({ type: "", no: 1, ans: selValue, comment: commentValue });
    alertPopSet(null!);

    if (stepValue === 1000) {
      const profile: Profile = JSON.parse(
        sessionStorage.getItem("beauty-measurement")!
      );
      results.sort((a, b) => sort_func(a, b));
      const data: Data = { profile: profile, results: results };
      sessionStorage.setItem("beauty-measurement", JSON.stringify(data));
      Router.push("./result");
    }

    setSelValue(0);
    setCommentValue("");
  };

  const Buttons = () => {
    const ans_list = [
      "Aキー : 不自然",
      "Sキー : やや不自然",
      "Dキー : どちらともいえない",
      "Fキー : やや自然",
      "Gキー : 自然",
    ];
    return (
      <div>
        {ans_list.map((word: string, id: number) => (
          <Form.Check
            inline
            key={id + 1}
            label={word}
            name="group1"
            type="radio"
            value={id + 1}
            onChange={(e) => setSelValue(parseInt(e.target.value))}
            checked={selValue === id + 1}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <div>
        <div>
          {stepValue}/{}
        </div>
        {alertPop}
        <Buttons />
        <Button variant="primary" onClick={handleClick}>
          Jキー : 次へ進む
        </Button>
        <FloatingLabel
          controlId="floatingTextarea2"
          label="Leave a comment here!"
     
          onFocus={() => setFocusCommentValue(1)}
          onBlur={() => setFocusCommentValue(0)}
        >
          <Form.Control as="textarea" style={{ height: "100px" }} onChange={(e) => setCommentValue(e.target.value)} />
        </FloatingLabel>
      </div>
    </>
  );
};
