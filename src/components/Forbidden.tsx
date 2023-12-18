import ErrorPage from "./ErrorPage";
import pageImg from "@assets/403errorimg.jpg";

const Forbidden = () => {
  return <ErrorPage image={pageImg} />;
};

export default Forbidden;
