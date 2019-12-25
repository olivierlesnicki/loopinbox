import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import cloud from "./cloud";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function PaymentSuccess() {
  const query = useQuery();

  useEffect(() => {
    const postData = async () => {
      const sessionId = query.get("sessionId");

      if (sessionId) {
        await cloud("convertPaymentSession", {
          sessionId
        });
      }
    };

    postData();
  }, [query]);

  return null;
}
