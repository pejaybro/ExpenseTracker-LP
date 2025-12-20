import { useEffect, useState } from "react";

export const useCheckViewport = () => {
  const [hide, setHide] = useState(false);

  const checkViewport = () => {
    setHide(window.innerHeight < 620);
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isTouch = navigator.maxTouchPoints > 0;
    const isPortrait = height > width;
    const isLandscape = width > height;
    let shouldHide = false;

    // DESKTOP (non-touch)
    if (!isTouch) {
      if (width < 900 || height < 620) {
        shouldHide = true;
      }
    }

    // Touch devices
    else {
      // Tablet - Portrait
      if (isPortrait && width < 800) {
        shouldHide = true;
      }

      // Tablet - Landscape
      else if (isLandscape && width < 960) {
        shouldHide = true;
      }
    }

    setHide(shouldHide);
  };

  useEffect(() => {
    checkViewport();
    window.addEventListener("resize", checkViewport);
    window.addEventListener("orientationchange", checkViewport);

    return () => {
      window.removeEventListener("resize", checkViewport);
      window.removeEventListener("orientationchange", checkViewport);
    };
  }, []);

  return { hide };
};
