import { useEffect, useState } from "react";
import { useMount } from "./util";

const test = () => {
  let num = 0;
  const add = () => {
    num += 1;
    const message = `现在的num值：${num}`;
    return function unMount() {
      console.log(message);
    };
  };
  return add;
};
// 下面所有的add公用一个num，但是不公用message
const add = test();
// 每次执行add()，都会创建一个新的message
// message1
const unmount = add();
// message2
add();
// message3
add();
// unmount引用的是message1，它的值在被定义时就固定了
unmount();

// react hook和闭包，经典的坑
// 规避的方法时，改写成useEffect，将外层依赖的num，作为参数传入 useEffect，保证num每次变化了，都会触发相应更新
export const Test = () => {
  const [num, setNum] = useState(0);
  const add = () => setNum(num + 1);
  useEffect(() => {
    const id = setInterval(() => {
      console.log("num in setInterval: ", num);
    }, 1000);
    return () => clearInterval(id);
  }, [num]);

  useEffect(() => {
    return () => {
      console.log(num);
    };
  }, [num]);

  return (
    <div>
      <button onClick={add}>add</button>
      <p>{num}</p>
    </div>
  );
};
