import { useState, useEffect } from "react";
const animation = ["|", "/", "-", "\\"];
const interval = 100;

const Spinner = ({ size, color, style }) => {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const spin = setInterval(() => {
      setStep((step) => (step + 1) % animation.length);
    }, interval);
    return () => clearInterval(spin);
  }, []);

  return (
    <div
      style={{
        // {
        //   transform: [{ rotate: spinny }],
        // },
        ...style,
        width: size,
        height: size,
      }}
    >
      <p
        style={{
          fontSize: size,
          color: color,
          fontWeight: "600",
          fontFamily: "monospace",
        }}
      >
        {animation[step]}
      </p>
    </div>
  );
};

export default Spinner;
