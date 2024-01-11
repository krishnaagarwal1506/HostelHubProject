import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import {
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";

type ErrorPageProps = {
  image: string;
};

const ErrorPage = ({ image }: ErrorPageProps) => {
  const navigate = useNavigate();
  return (
    <Box className="h-screen w-full flex items-center justify-center lg:justify-start flex-col bg-white">
      <Box
        className="w-full md:w-1/2 h-auto  lg:h-max-[50vh]"
        component="img"
        src={image}
      />
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
    </Box>
  );
};

export default ErrorPage;
