import Styles from "../../styles/result.module.scss";
import Form from "react-bootstrap/Form";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

export default () => {
  const str_json: string = sessionStorage.getItem("beauty-measurement")!;
  const [strValue, setStrValue] = useState<string>(str_json);
  const [alertPop, alertPopSet] = useState<JSX.Element>(null!);

  const copy = (str: string) => {
    navigator.clipboard.writeText(str)
      .then(() => {
        alertPopSet(
          <Alert variant="primary">
            コピーしました！
          </Alert>
        );
      })
      .catch(err => {
        <Alert variant="danger">
          コピー失敗しました。何度もできない場合は範囲選択でコピーしてください。
        </Alert>
      });
  };


  return (
    <>
      <p>実験終了です。長時間の実験お疲れ様でした。下の実験結果をコピーしてをお送りください。</p>
      {alertPop}
      <Form.Control
        as="textarea"
        style={{ height: "100px", fontSize: "12px" }}
        disabled
        value={strValue}
        onChange={(e: any) => setStrValue(e.target.value)}
      />
      <Button variant="primary" onClick={() => copy(strValue)}>
        COPY
      </Button>
    </>);
}