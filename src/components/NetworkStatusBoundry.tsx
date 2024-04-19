import { useEffect, ReactNode, useState } from "react";
import ErrorPage from "./ErrorPage";
import noInternetImage from "@assets/no-internet.jpg";
import Loader from "./Loader";

interface NetworkStatusBoundryProps {
  children: ReactNode;
}

const NetworkStatusBoundry = ({ children }: NetworkStatusBoundryProps) => {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsOnline(true);
        setIsLoading(false);
      }, 500);
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  });
  if (isLoading) return <Loader />;
  if (isOnline) return children;
  return (
    <ErrorPage
      image={noInternetImage}
      viewNavigation={false}
      customRender={
        <>
          <p className="max-w-3xl pb-4 text-sm lg:text-xl text-center text-primary-main">
            <h1 className="text-2xl lg:text-4xl font-semibold text-primary-light">
              503 No Connection Internet
            </h1>
            Sorry, the internet/service is currently down. Please try again
            later.
          </p>
        </>
      }
    />
  );
};

export default NetworkStatusBoundry;
