import {
  useEffect,
  useRef,
  useState,
} from 'react';

const ONE_SECOND = 1000;

interface TimerProps {
  endTime: Date;
}

const Timer = (props: TimerProps) => {
  const { endTime } = props;
  const [diff, setDiff] = useState<number>(endTime.getTime() - Date.now());
  const timer = useRef<any>(null);

  const days = Math.floor(diff / 1000 / 60 / 60 / 24);
  const hours = Math.floor(diff / 1000 / 60 / 60 % 24);
  const minutes = Math.floor(diff / 1000 / 60 % 60);
  const seconds = Math.floor(diff / 1000 % 60);

  useEffect(() => {
    timer.current = setInterval(() => {
      setDiff(endTime.getTime() - Date.now());
    }, ONE_SECOND);

    return () => {
      clearInterval(timer.current);
      timer.current = null;
    };
  }, []);

  return (
    <span>
      {
        days > 0 ? days : 0
      }d : {
        String(hours > 0 ? hours : 0).padStart(2, '0')
      }h : {
        String(minutes > 0 ? minutes : 0).padStart(2, '0')
      }m : {
        String(seconds > 0 ? seconds : 0).padStart(2, '0')
      }s
    </span>
  );
};

export default Timer;
