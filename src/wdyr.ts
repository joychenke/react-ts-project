import React from "react";
if (process.env.NODE_ENV === "development") {
  const whyDidYouRender = require("@welldone-software/why-did-you-render");
  whyDidYouRender(React, {
    // 不跟踪所有的函数组件
    trackAllPureComponents: false,
  });
}
