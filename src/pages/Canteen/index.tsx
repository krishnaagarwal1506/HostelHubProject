import {
  useEffect,
  useState,
  useRef,
  ChangeEvent,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import { Box, Button, Skeleton, TextField } from "@mui/material";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import AlertComponent from "@components/Alert";
import ErrorBoundary from "@components/ErrorBoundry";
import ErrorComponent from "@components/ErrorComponent";
import { AuthContext } from "@context/AuthContext";
import useAlert from "@src/hooks/useAlert";
import { catchErrorMessage, fetchData, sendData } from "@src/utils";
import { SeverityType } from "@ts/types";
import {
  ADMIN,
  BASE_URL,
  CANTEEN_MENU_URL,
  ERROR,
  STRAPI_FILE_UPLOAD_URL,
  SUCCESS,
  METHOD,
} from "@constant/index";
import axiosInstance from "@utils/axiosInstance";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const { PUT } = METHOD;

function getPdf(
  setPdf: Dispatch<SetStateAction<{ id: number | null; url: string }>>,
  setError: Dispatch<SetStateAction<boolean>>,
  handleAlert: (
    isOpen: boolean,
    message: string,
    serverity: SeverityType
  ) => void
) {
  fetchData(CANTEEN_MENU_URL)
    .then((data) => {
      const {
        id,
        attributes: { link },
      } = data.data;
      setPdf({
        id,
        url: BASE_URL + link,
      });
      setError(false);
    })
    .catch((error) => {
      setError(true);
      handleAlert(true, catchErrorMessage(error), ERROR);
    });
}

const Canteen = () => {
  const [pdf, setPdf] = useState<{ id: number | null; url: string }>({
    id: null,
    url: "",
  });
  const {
    user: { role },
  } = useContext(AuthContext);
  const { alert, handleAlert } = useAlert();
  const { isOpen, message, severity } = alert;
  const [error, setError] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { id, url } = pdf;
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const instance = axiosInstance();

  useEffect(() => {
    getPdf(setPdf, setError, handleAlert);
  }, []);

  const handleClick = () => {
    const { current } = fileInputRef;
    if (!current) return;
    current.click();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("files", file);
      instance
        .post(STRAPI_FILE_UPLOAD_URL, formData)
        .then(async (res) => {
          const newPdfUrl = res.data[0].url;
          const data = {
            link: newPdfUrl,
          };
          const isMenuLinkUpdated = await sendData<{
            link: string;
          }>(CANTEEN_MENU_URL, PUT, data, true);
          if (isMenuLinkUpdated) {
            getPdf(setPdf, setError, handleAlert);
            handleAlert(true, "File Uploaded Successfully", SUCCESS);
          }
        })
        .catch((err) => {
          handleAlert(true, catchErrorMessage(err), ERROR);
        });
    }
  };

  const boxCss = role === ADMIN ? "h-[80vh]" : "h-[85vh]";

  return (
    <>
      <ErrorBoundary
        error={error}
        ErrorComponent={
          <ErrorComponent
            className={`w-[96%] m-auto ${boxCss}`}
            boxClassName="h-40"
            onSubmit={() => getPdf(setPdf, setError, handleAlert)}
            message="Error in fetching data"
          />
        }
      >
        <Box className={boxCss}>
          {role === ADMIN && (
            <>
              <Button
                size="large"
                className="ml-auto block mr-6 animate-slideinRight"
                variant="contained"
                onClick={handleClick}
              >
                Update
              </Button>
              <TextField
                className="hidden"
                type="file"
                inputRef={fileInputRef}
                onChange={handleChange}
                inputProps={{ accept: "application/pdf" }}
              />
            </>
          )}

          <Box className=" h-4/5 md:h-full md:px-0 w-[96%] rounded-xl my-4 shadow-md m-auto text-primary-main">
            {id ? (
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                <Viewer
                  plugins={[defaultLayoutPluginInstance]}
                  fileUrl={url}
                  withCredentials={true}
                />
              </Worker>
            ) : (
              <Skeleton className="h-full w-full scale-100"></Skeleton>
            )}
          </Box>
        </Box>
      </ErrorBoundary>
      {isOpen && (
        <AlertComponent
          message={message}
          severity={severity}
          handleClose={() => handleAlert(false)}
        />
      )}
    </>
  );
};

export default Canteen;
