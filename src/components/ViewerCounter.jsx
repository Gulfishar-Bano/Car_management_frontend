import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_BACKEND_URL);

const ViewerCounter = ({ carId, visible }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!carId) return;

    const handleUpdate = (newCount) => {
      setCount(newCount);
    };

    socket.on("car_viewer_count", handleUpdate);
    socket.emit("view_car", carId);

    return () => {
      socket.emit("leave_car", carId);
      socket.off("car_viewer_count", handleUpdate);
    };
  }, [carId]);

  return (
    <div
      className="viewer-count-badge"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.2s ease-in-out",
      }}
    >
      🔥 {count} people are viewing this now
    </div>
  );
};

export default ViewerCounter;
