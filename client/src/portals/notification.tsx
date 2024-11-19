// Notifiation Portal

import { useEffect } from "react";
import { createPortal } from "react-dom";

const Toast = ({ message, type, onClose }) => {
  const notificationRoot = document.getElementById(
    "notification"
  ) as HTMLElement;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const UI = (
    <div className={`fixed right-10 top-10`}>
      <p>{message}</p>
      <button onClick={() => onClose()}>close</button>
    </div>
  );
  return createPortal(UI, notificationRoot, "notification");
};
