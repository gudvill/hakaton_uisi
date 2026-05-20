import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function useMetrika() {
  const location = useLocation();

  useEffect(() => {
    if (!window.ym) return;

    window.ym(
      109326806,
      "hit",
      location.pathname + location.search
    );
  }, [location]);
}