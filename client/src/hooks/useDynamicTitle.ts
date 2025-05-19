import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const routeTitleMap: Record<string, string> = {
  "/": "GatherPay",
  "/dashboard": "Dashboard | GatherPay",
  "/login": "Login | GatherPay",
  "/register": "Register | GatherPay",
  "/create-event": "Create Event | GatherPay",
  "/payment": "Payment | GatherPay",
};

const useDynamicTitle = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    let title = "GatherPay";

    if (pathname.startsWith("/event/edit")) {
      title = "Update Event | GatherPay";
    } else {
      title = routeTitleMap[pathname] || title;
    }

    document.title = title;
  }, [pathname]);
};

export default useDynamicTitle;
