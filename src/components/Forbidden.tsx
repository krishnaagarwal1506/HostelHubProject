import ErrorPage from "./ErrorPage";
import pageImg from "@assets/403errorimg.jpg";

const Forbidden = () => {
  return (
    <ErrorPage
      image={pageImg}
      customRender={
        <div className="mt-8">
          <p className="max-w-3xl pb-4 text-sm lg:text-xl text-center text-primary-main">
            <h1 className="text-2xl lg:text-4xl font-semibold text-primary-light mb-2">
              401 Unauthorized Access
            </h1>
            Sorry, you don't have permission to access this page.
          </p>
        </div>
      }
    />
  );
};

export default Forbidden;
