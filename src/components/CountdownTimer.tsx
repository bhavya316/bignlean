"use client";
import React, { useEffect, useState } from "react";

interface CountdownTimerProps {
  expiryTime: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ expiryTime }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(expiryTime) - +new Date();
    let timeLeft: { [key: string]: number } = {};

    if (difference > 0) {
      timeLeft = {
        total: difference,
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryTime]);

  const formatTime = () => {
    if (timeLeft.total > 1000 * 60 * 60 * 24) {
      return `${timeLeft.days}d`;
    } else if (timeLeft.total > 1000 * 60 * 60) {
      return `${String(timeLeft.hours).padStart(2, "0")}h:${String(
        timeLeft.minutes
      ).padStart(2, "0")}m`;
    } else if (timeLeft.total > 0) {
      return `${String(timeLeft.minutes).padStart(2, "0")}m:${String(
        timeLeft.seconds
      ).padStart(2, "0")}s`;
    } else {
      return "Time's up!";
    }
  };

  return (
    <div className="text-red-500 text-sm border rounded-lg px-3 py-px border-red-500">
      {formatTime()}
    </div>
  );
};

export default CountdownTimer;
