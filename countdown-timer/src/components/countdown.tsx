"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";    
import { Button } from "@/components/ui/button";   

export default function Countdown() {
  const [duration, setDuration] = useState<number | string>("");    // Input duration (seconds)
  const [timeLeft, setTimeLeft] = useState<number>(0);     // Time left for the countdown
  const [isActive, setIsActive] = useState<boolean>(false);     // Timer status (active/inactive)
  const [isPaused, setIsPaused] = useState<boolean>(false);     // Pause status
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);     // Timer reference (updated type)

  const handleSetDuration = (): void => {
    if (typeof duration === "number" && duration > 0) {
      setTimeLeft(duration);
      setIsActive(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleStart = (): void => {
    if (timeLeft > 0) {
      setIsActive(true);
      setIsPaused(false);
    }
  };

  const handlePause = (): void => {
    if (isActive) {
      setIsPaused(true);
      setIsActive(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const handleReset = (): void => {
    setIsPaused(false);
    setIsActive(false);
    setTimeLeft(typeof duration === "number" ? duration : 0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    if (isActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, isPaused]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setDuration(Number(e.target.value) || "");
  };
  
  return (
<div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-pink-400 via-gray-250 to-teal-300 dark:bg-gradient-to-r dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">

  <div className="text-gray-300 dark:text-gray-200 bg-black container mx-auto max-w-sm sm:max-w-lg shadow-2xl rounded-xl p-2 md:p-3 lg:p-2 w-full">
  
      <h1 className="text-3xl font-extrabold mb-7 text-pink-300 dark:text-pink-500 text-center">
        Custom Countdown Timer
      </h1>
  
      <div className="flex items-center mb-6">
  
          <Input
            type="number"
            id="duration"
            placeholder="Enter duration in seconds"
            value={duration}
            onChange={handleDurationChange}
            className="flex-1 mr-3 rounded-lg border-pink-300 dark:border-pink-600 dark:bg-gray-700 dark:text-gray-200" />
  
          <Button
            onClick={handleSetDuration}
            variant="outline"
            className="text-black dark:text-black bg-gray-200 dark:bg-gray-600            hover:bg-gray-300 hover:text-pink-500 dark:hover-bg-gray-300" >
            Set
          </Button>
        </div>
  
        <div className="text-5xl font-extrabold text-white dark:text-white mb-10 text-center">
          {formatTime(timeLeft)}
        </div>
  
        <div className="flex justify-center gap-4 mb-2">
  
          <Button
            onClick={handleStart}
            variant="outline"
            className="text-black dark:text-black bg-teal-400 dark:bg-teal-600 hover:bg-teal-500 dark:hover:bg-teal-500" >
            {isPaused ? "Resume" : "Start"}
          </Button>
  
          <Button
            onClick={handlePause}
            variant="outline"
            className="text-black dark:text-black bg-purple-500 dark:bg-purple-600 hover:bg-purple-500 dark:hover:bg-purple-500" >
            Pause
          </Button>

          <Button
            onClick={handleReset}
            variant="outline"
            className="text-black dark:text-black bg-red-400 dark:bg-red-900 hover:bg-red-500 dark:hover:bg-red-500" >
            Reset
          </Button>
        </div>
  
      </div>
    </div>
  );
};