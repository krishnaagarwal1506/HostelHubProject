import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import {
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { ReactNode } from "react";

type ErrorPageProps = {
  image: string;
  viewNavigation?: boolean;
  customRender?: ReactNode;
};

const ErrorPage = ({
  image,
  viewNavigation = true,
  customRender = null,
}: ErrorPageProps) => {
  const navigate = useNavigate();
  return (
    <Box className="h-screen w-full flex items-center justify-center lg:justify-start flex-col bg-white">
      <Box
        className="w-full md:w-1/2 xl:w-1/4 h-auto md:h-max-[50vh] xl:h-max-[30vh]"
        component="img"
        src={image}
      />
      {customRender && customRender}
      {viewNavigation && (
        <Box>
          <Button
            className="mr-8"
            variant="outlined"
            color="primary"
            size="large"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <Button
            variant="contained"
            size="large"
            startIcon={<HomeIcon />}
            onClick={() => navigate("/dashboard")}
          >
            Home
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ErrorPage;
