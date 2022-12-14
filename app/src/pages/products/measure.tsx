import Button from "react-bootstrap/Button";
import Styles from "../../../styles/measure.module.scss";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Router from "next/router";
import React, { useState, useEffect, useMemo } from "react";
import Json from "../../path_txt.json";
import { rest_num, rest_time, sortFunc, randSort, RestPositioning } from "../../components/function";
import {
  Result,
  Data,
  Profile,
  Morphing,
} from "../../components/interfaces";


export default () => {
  const [results, setResults] = useState<Result[]>([]);
  const morphing: Morphing[] = Json;

  useEffect(() => {
    randSort(morphing);
  }, []);

  const [focusCommentFlag, setFocusCommentFlag] = useState<boolean>(false);
  const [stepValue, setStepValue] = useState<number>(1);
  const [selValue, setSelValue] = useState<number>(0);
  const [commentValue, setCommentValue] = useState<string>("");
  const [alertPop, alertPopSet] = useState<JSX.Element>(null!);


  const RadioButtuns = () => { // ラジオボタン
    const ans_list = [
      "Aキー : 不自然",
      "Sキー : やや不自然",
      "Dキー : どちらともいえない",
      "Fキー : やや自然",
      "Gキー : 自然",
    ];
    return (
      <div className={Styles.radioButton}>
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

  let current_time: number;
  const [defaultTime, setDefaultTime] = useState<number>(Math.floor(rest_time * 60));
  const Restpages = () => {
    const [time, setTime] = useState(defaultTime);

    const Timer = () => { // 制限時間
      useEffect(() => {
        const id = setInterval(() => {
          if (0 < current_time)
            setTime(t => t - 1);
        }, 1000);
        return () => clearInterval(id);
      }, []);

      return time;
    };


    // 休憩時間コンポーネント
    return (
      <div className={Styles.rest_wrap}>
        <div className={Styles.rest_time}>残り休憩時間 : <span className={Styles.bold}>{current_time = Timer()}</span>秒</div>
        <p>この間にゆっくり休んでください。長時間の休憩も可能ですが、このページのリロードはしないように願います。</p>
      </div>
    );
  };

  const radix_and_plus_element: number[] = RestPositioning(Json.length, rest_num);
  const [restCnt, setRestCnt] = useState<number>(0);
  const [restFlag, setRestFlag] = useState<boolean>(false);


  const handleClick = () => {// ボタンクリック操作
    const sum_worksteps = Math.min(restCnt + 1, radix_and_plus_element[1]) + (restCnt + 1) * radix_and_plus_element[0];

    if (!restFlag) {
      if (selValue === 0) {
        alertPopSet(
          <Alert variant="danger">
            入力項目が不足しています。選択課題は入力してください。
          </Alert>
        );
        return;
      }
      alertPopSet(null!);

      const idx = stepValue - 1 - restCnt;
      const tmpin: Result = { type: Json[idx].type, name: Json[idx].name, ans: selValue, comment: commentValue };
      setResults([...results, tmpin]);

      if (stepValue === rest_num + Json.length) {
        const out_results = [...results, tmpin];
        const profile: Profile = JSON.parse(
          sessionStorage.getItem("b-user")!
        );
        out_results.sort((a, b) => sortFunc(a, b));
        const data: Data = { profile: profile, results: out_results };
        sessionStorage.setItem("b-result", JSON.stringify(data, null, "\t"));
        Router.push("./result");
        return;
      }

      if (stepValue === restCnt + sum_worksteps) {
        setRestFlag(true);
      }
    }
    else {
      if (0 != current_time) {
        alertPopSet(
          <Alert variant="danger">
            休憩時間を過ぎていません。
          </Alert>
        );
        setDefaultTime(current_time);
        return;
      }
      setDefaultTime(Math.floor(rest_time * 60));
      alertPopSet(null!);
      setRestFlag(false);
      setRestCnt(pre => pre + 1);
    }
    setStepValue((prevValue) => prevValue + 1);
    setSelValue(0);
    setCommentValue("");
  };

  if (typeof document !== "undefined") { // キーボード操作 and 例外操作
    document.onkeydown = function (e) {
      const keys = ["a", "s", "d", "f", "g"];
      keys.forEach((key, ind) => {
        if (e.key === key && !focusCommentFlag && !restFlag) {
          setSelValue(ind + 1);
        }
      });
      if (e.key === "j" && !focusCommentFlag) {
        handleClick();
      }
    };
  }

  const ImgMorph = useMemo(() => { // メモ化して不要な再レンダリングを禁止
    const idx = stepValue - 1 - restCnt;
    return (
      <div className={Styles.mp4}>
        <video src={morphing[idx].path} muted autoPlay loop></video>
      </div>);
  }, [stepValue]);

  return (

    <div className={Styles.wrap}>
      <div className={Styles.count}>
        {stepValue}/{rest_num + Json.length}
      </div>
      {(() => {
        if (!restFlag)
          return ImgMorph;
      })()}
      {alertPop}
      {(() => {
        if (!restFlag)
          // 顔表情コンポーネント
          return (<>
            <div className={Styles.q1}>
              Q1 : 上の表示されている動画は自然な顔表情の動きですか？（必須選択）
              <RadioButtuns />
            </div>
            <div className={Styles.q2}>
              Q2 : 上の表示されている動画で不自然だと思われるところはどこですか？（任意入力）
              <div className={Styles.form}>
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                  <Form.Control
                    as="textarea"
                    style={{ height: "100px" }}
                    value={commentValue}
                    onFocus={() => setFocusCommentFlag(true)}
                    onBlur={() => setFocusCommentFlag(false)}
                    onChange={(e: any) => setCommentValue(e.target.value)}
                  />
                </Form.Group>
              </div>
            </div>
          </>);
        else
          return <Restpages />;
      })()}
      <div className={Styles.button_wrapper}>
        <Button variant="primary" className={Styles.button} onClick={() => handleClick()}>
          Jキー : 次へ進む
        </Button>
      </div>
    </div>

  );
};
