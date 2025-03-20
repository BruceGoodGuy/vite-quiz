import { useEffect, useRef } from "react";

export default function ProgressBar({ time, isTimeOut }) {
  const progressBar = useRef(null);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      isTimeOut();
    }, time);
    return () => clearTimeout(timeoutId);
  }, [time, isTimeOut]);
  useEffect(() => {
    let timer = 0;
    const intervalId = setInterval(() => {
      timer += 10;
      if (timer >= time) {
        clearInterval(intervalId);
      }
      progressBar.current.querySelector(".progress").style.width = `${
        (timer / time) * 100
      }%`;
    }, 10);
    return () => clearInterval(intervalId);
  });
  return (
    <div ref={progressBar} className="progress-bar">
      <div className="progress" id="progress"></div>
    </div>
  );
}
