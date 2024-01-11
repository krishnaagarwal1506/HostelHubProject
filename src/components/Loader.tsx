import { Box, CircularProgress } from "@mui/material";

const Loader = () => {
  return (
    <Box
      data-testid="loader"
      className="w-full h-screen bg-white flex justify-center items-center overflow-hidden"
    >
      <CircularProgress className="text-primary-main" />
    </Box>
  );
};

export default Loader;
