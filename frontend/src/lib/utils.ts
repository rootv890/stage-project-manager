import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getGreetMessage(user: string) {
  const date = new Date();
  const hours = date.getHours();
  let greeting = "Good Morning 🌞";
  if (hours >= 12 && hours < 17) {
    greeting = "Good Afternoon 🌤";
  } else if (hours >= 17 && hours < 24) {
    greeting = "Good Evening 🌙";
  }
  return `${greeting}, ${user}`;
}

export function convertMinsToDHM(time: number) {
  const days = Math.floor(time / 1440);
  const hours = Math.floor((time % 1440) / 60);
  const minutes = time % 60;

  if (days === 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${days}d ${hours}h ${minutes}m`;
}

export function timeRemaining(percentage: number, totalDuration: number) {
  let remainingTime = totalDuration - (percentage * totalDuration) / 100;
  // two decimal places
  remainingTime = Math.ceil(remainingTime);

  return convertMinsToDHM(remainingTime);
}

/* percentage  = finishedTime / totalTime * 100 */
/* finishedTime  = percentage * totalTime / 100  */
/* remainingTime = totalTime - finishedTime */
/* remainingTime = totalTime - (percentage * totalTime / 100) */
