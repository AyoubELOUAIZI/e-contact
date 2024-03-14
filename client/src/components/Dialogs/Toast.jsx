"use client";
import React, { useEffect } from "react";

const Toast = ({ showToast, setShowToast, toastMsg, isError, setIsError }) => {
  useEffect(() => {
    console.log("showToast");
    console.log(showToast);
    if (!showToast) {
      return;
    }
    const timer = setTimeout(() => {
      setShowToast(false);
      setIsError(false);
    }, 7000);
    return () => clearTimeout(timer);
  }, [showToast]);

  const handleCloseToast = () => {
    setShowToast(false);
  };

  return (
    <>
      {showToast && (
        <div
        className={`${
          isError ? "bg-red-500" : "bg-green-500"
        } py-2 px-4 rounded-md text-white text-center fixed bottom-4 right-4 flex gap-4`}
      >
      
          <p>
            {/* Success! Your changes have been saved. */}
            {toastMsg}
          </p>
          <button
            className="cursor-pointer font-bold"
            onClick={handleCloseToast}
          >
            <sup>X</sup>
          </button>
        </div>
      )}
    </>
  );
};

export default Toast;
