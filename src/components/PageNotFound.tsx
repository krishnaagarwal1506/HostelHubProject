import ErrorPage from "./ErrorPage";
import pageImg from "@assets/404errorimg.png";

const PageNotFound = () => {
  return (
    <ErrorPage
      image={pageImg}
      customRender={
        <div className="mt-8">
          <p className="max-w-3xl pb-4 text-sm lg:text-xl text-center text-primary-main">
            <h1 className="text-2xl lg:text-4xl font-semibold text-primary-light">
              404 Page Not Found
            </h1>
            Sorry, the page you're looking for isn't here, Please check the URL
            or return to the Dashboard Page.
          </p>
        </div>
      }
    />
  );
};

export default PageNotFound;
