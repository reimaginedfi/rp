import { useState, useEffect } from "react";

export const useSSR = () => {
  const [isSSR, setIsSSR] = useState(true);
  useEffect(() => {
    setIsSSR(false);
  }, []);

  return isSSR;
};
