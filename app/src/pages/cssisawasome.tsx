import Router from 'next/router';
import React, { useEffect } from "react";

export default () => {
  useEffect(() => {
    Router.replace("./products/top");
  }, []);

  return <div>これからトップページに遷移します。しばらく経っても遷移しない場合は「https://kakerukitahara.github.io/beauty-measurement.github.io/products/top」に移動してください。</div>;
};