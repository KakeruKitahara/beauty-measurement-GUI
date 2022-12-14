import Styles from "../../styles/result.module.scss";
import Form from "react-bootstrap/Form";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import dynamic from "next/dynamic";

const Page  = () => {
  const str_json: string = sessionStorage.getItem("b-result")!;
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
          コピー失敗しました。何度もできない場合は範囲選択(ctrl + A)で実験結果をコピーしてください。
        </Alert>
      });
  };


  return (
    <div className={Styles.wrap}>
      <p className={Styles.p}>実験終了です。長時間の実験お疲れ様でした。下の実験結果をコピーを押してをお送りください。送信したのを確認した後にこのページを閉じてもらって大丈夫です。</p>
      {alertPop}
      <h5>実験結果</h5>
      <Form.Control
        as="textarea"
        style={{ height: "300px", fontSize: "16px" }}
        disabled
        value={strValue}
        onChange={(e: any) => setStrValue(e.target.value)}
      />
      <div className={Styles.button}>
        <Button variant="primary" onClick={() => copy(strValue)}>
          COPY
        </Button>
      </div>
    </div>
  );
}

const DynamicPage = dynamic(
  {
    loader: async () => Page,
  },
  { ssr: false }
);

export default DynamicPage;