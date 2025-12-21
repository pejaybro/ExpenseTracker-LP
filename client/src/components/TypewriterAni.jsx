import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const TypewriterAni = ({
  isDashboard,
  isTrip,
  textArr = ["Income", "Expense"],
  PreText,
}) => {
  const [currentNameIndex, setCurrentNameIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const typingSpeed = 150;
  const deletingSpeed = 75;

  useEffect(() => {
    const names = textArr;
    const currentName = names[currentNameIndex];
    let timeout;

    if (isDeleting) {
      timeout = setTimeout(() => {
        setCurrentText(currentName.slice(0, currentText.length - 1));
      }, deletingSpeed);
    } else {
      timeout = setTimeout(() => {
        setCurrentText(currentName.slice(0, currentText.length + 1));
      }, typingSpeed);
    }

    if (!isDeleting && currentText === currentName) {
      timeout = setTimeout(() => setIsDeleting(true), 1000);
    } else if (isDeleting && currentText === "") {
      setIsDeleting(false);
      setCurrentNameIndex((currentNameIndex + 1) % names.length);
    }

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentNameIndex]);

  return (
    <>
      {isDashboard && (
        <div className={cn("text-slate-a1 font-title text-36px tracking-wide")}>
          <span className=""> Simply, Manage </span>
          <span className="text-exp-a1">{currentText}</span>
          <span className="cursor border-r-slate-a1 border-r-[1px] pl-[0.5px]"></span>
        </div>
      )}
      {isTrip && (
        <div className={cn("text-24px !text-slate-a1 font-para2-b absolute")}>
          <span className=""> {PreText} </span>
          <span className="text-trip-a3">{currentText}</span>
          <span className="cursor border-r-slate-a1 border-r-[1px] pl-[0.5px]"></span>
        </div>
      )}
    </>
  );
};

export default TypewriterAni;
