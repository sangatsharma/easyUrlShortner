import * as React from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

const RedirectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // In case you want to redirect on error

  useEffect(() => {
    if (id !== undefined) {
      window.location.href = `${
        import.meta.env.VITE_SERVER_URL
      }/api/getLongUrl/${id}`;
    }
  }, [id]);

  // If redirected, this won't render; it's a fallback in case of issues.
  return <></>;
};

export default RedirectPage;
