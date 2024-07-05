"use client"
import { AnimatePresence, motion } from "framer-motion";
import React, {
  useState,
  createContext,
  useContext,
  useEffect,
} from "react";

const SnackbarContext = createContext();

const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};

const SnackbarProvider = ({ children, duration = 3000 }) => {
  const [snackbarData, setSnackbarData] = useState(null);
  const [progress, setProgress] = useState(0);

  const showSnackbar = (data) => {
    setSnackbarData(data);
    setProgress(100);
  };

  useEffect(() => {
    let timer = null;
    if (snackbarData) {
      timer = setInterval(() => {
        setProgress((prevProgress) => prevProgress - 1000 / duration);
      }, 1);
    }
    return () => {
      if (timer) {
        clearInterval(timer); 
      }
    };
  }, [snackbarData, duration]);

  useEffect(() => {
    if (progress <= 0) {
      setSnackbarData(null);
    }
  }, [progress]);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <AnimatePresence>
        {snackbarData && (
          <motion.div
            initial={{ x: "-50%" }}
            animate={{ x: "0%" }}
            exit={{ x: "-110%" }}
            className={`fixed z-50 bottom-8 w-[350px] left-0 rounded-r-lg text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 border border-[#B1725F] text-grey-50 ${snackbarData.useCase}`}
          >
            <div
              className={` h-2 ${
                snackbarData.useCase === "success" &&
                " bg-gradient-to-r from-[#26C489] rounded-r-xl to-[#39F77A]"
              } ${
                snackbarData.useCase === "error" &&
                " bg-gradient-to-r from-red-700 rounded-r-xl to-red-400"
              } `}
              style={{ width: `calc(100% - ${progress}%) ` }}
            ></div>
            <div className="py-4 px-4">{snackbarData.message}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </SnackbarContext.Provider>
  );
};

const Snackbar = () => {
  const { showSnackbar } = useSnackbar();

  return null; // Render your Snackbar component here
};

export { SnackbarProvider, Snackbar ,useSnackbar};
