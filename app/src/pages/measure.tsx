import Button from "react-bootstrap/Button";
import Styles from "../../styles/measure.module.scss";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Router from "next/router";
import React, { useState, useEffect } from "react";
import Json from "../path_txt.json";
import { rest_num, rest_time } from "../components/morphing";
import {
  Result,
  sort_func,
  Data,
  Profile,
  Morphing,
} from "../components/interfaces";


export default () => {
  const [results, setResults] = useState<Result[]>([]);
  const morphing: Morphing[] = Json;

  useEffect(() => {
    for (let i = morphing.length - 1; 0 < i; i--) {
      const r = Math.floor(Math.random() * (i + 1));
      [morphing[i], morphing[r]] = [morphing[r], morphing[i]];
    }
  }, []);

  const [selValue, setSelValue] = useState<number>(0);
  const [focusCommentValue, setFocusCommentValue] = useState<number>(0);
  const [commentValue, setCommentValue] = useState<string>("");
  const [stepValue, setStepValue] = useState<number>(1);
  const [alertPop, alertPopSet] = useState<JSX.Element>(null!);

  const RadioButtuns = () => {
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
            onChange={(e: any) => setSelValue(parseInt(e.target.value))}
            checked={selValue === id + 1}
          />
        ))}
      </div>
    );
  };

  const Facepages = () => {
    // 顔測定コンポーネント
    return (
      <>
        <RadioButtuns />
        <FloatingLabel
          controlId="floatingTextarea2"
          label="Leave a comment here!"
          onFocus={() => setFocusCommentValue(1)}
          onBlur={() => setFocusCommentValue(0)}
        >
          <Form.Control
            as="textarea"
            style={{ height: "100px" }}
            onChange={(e: any) => setCommentValue(e.target.value)}
          />
        </FloatingLabel>
      </>
    );
  };


  const Restpages = () => {


    // 休憩時間コンポーネント
    return (
      <>
        <div>a</div>
      </>
    );
  };



  const handleClick = () => {
    const rotation: number = Math.floor(Json.length / (rest_num + 1));
    if (selValue === 0 && stepValue - 1 !== rotation) {
      alertPopSet(
        <Alert variant="danger">
          入力項目が不足しています。選択課題は入力してください。
        </Alert>
      );
      return;
    }
    alertPopSet(null!);

    if (stepValue === rest_num + Json.length) {
      const profile: Profile = JSON.parse(
        sessionStorage.getItem("beauty-measurement")!
      );
      results.sort((a, b) => sort_func(a, b));
      const data: Data = { profile: profile, results: results };
      sessionStorage.setItem("beauty-measurement", JSON.stringify(data));
      Router.push("./result");
    }


    if (stepValue !== rotation + 1) {
      const tmpin: Result = { type: Json[stepValue - 1].type, name: Json[stepValue - 1].name, ans: selValue, comment: commentValue };
      setResults([...results, tmpin]);
    }

    setStepValue((prevValue) => prevValue + 1);

    setSelValue(0);
    setCommentValue("");
  };


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

  return (
    <>
      <div>
        <div>
          {stepValue}/{rest_num + Json.length}
        </div>
        {alertPop}
        {(() => {
          const rotation: number = Math.floor(Json.length / (rest_num + 1));
          if (stepValue - 1 === rotation) {
            return <Restpages />;
          } else {
            return <Facepages />;
          }
        })()}
        <Button variant="primary" onClick={() => handleClick()}>
          Jキー : 次へ進む
        </Button>
      </div>
    </>
  );
};
