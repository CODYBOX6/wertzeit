import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["Minimaliste.", "Performant.", "Sans compromis."],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 3500);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full py-1 mt-2">
      <div className="text-center">
        <div className="h-[50px] flex items-center justify-center relative">
          {titles.map((title, index) => (
            <motion.div
              key={index}
              className="absolute font-semibold text-[1.5rem] text-spektr-cyan-50"
              initial={{ opacity: 0, y: 50 }}
              animate={{
                opacity: titleNumber === index ? 1 : 0,
                y: titleNumber === index ? 0 : (titleNumber > index ? -50 : 50)
              }}
              transition={{ duration: 0.8, type: "spring", stiffness: 50, damping: 12 }}
            >
              {title}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { Hero }; 