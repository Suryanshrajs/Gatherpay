import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";

const ThankYouPage = () => {
  const navigate = useNavigate();
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    const timer = setTimeout(() => {
      navigate("/", { replace: true });
    }, 5000);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-white relative overflow-hidden">
      <Confetti width={dimensions.width} height={dimensions.height} />
      <h1 className="text-4xl font-extrabold text-green-600 mb-4">🎉 Thank You!</h1>
      <p className="text-xl text-gray-700">You are successfully registered for the event.</p>
      <p className="text-sm text-gray-500 mt-2">Redirecting to the homepage shortly...</p>
    </div>
  );
};

export default ThankYouPage;
