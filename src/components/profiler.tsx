import React from "react";
import { ProfilerOnRenderCallback, ProfilerProps } from "react";

// & 联合类型
type Props = { metadata?: any; phases?: ("mount" | "update")[] } & Omit<
  ProfilerProps,
  "onRender"
>;

let queue: unknown[] = [];
const sendToProfileQueue = () => {
  if (!queue.length) {
    return;
  }
  const queueToSend = [...queue];
  queue = [];
  console.log(queueToSend);
};

setInterval(sendToProfileQueue, 5000);

export const Profiler = ({ metadata, phases, ...props }: Props) => {
  const reportProfile: ProfilerOnRenderCallback = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions
  ) => {
    // 默认 update 和 mount时处理；否则在指定的phase阶段处理
    if (!phases || phases.includes(phase)) {
      queue.push({
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        interactions,
      });
    }
  };
  return <React.Profiler onRender={reportProfile} {...props}></React.Profiler>;
};
