import { Paper, Box, Typography } from "@mui/material";
import LoadingButton from "./LoadingButton";

type ErrorComponentProps = {
  className?: string;
  boxClassName?: string;
  onSubmit: () => void;
  message?: string;
  heading?: string;
  headingClassName?: string;
};

const ErrorComponent = ({
  className = "",
  onSubmit,
  message = "",
  boxClassName = "",
  heading,
  headingClassName = "",
}: ErrorComponentProps) => {
  return (
    <Paper
      className={`rounded-xl flex flex-col justify-center items-center ${className}`}
    >
      {heading && (
        <Typography
          className={`text-2xl self-start font-medium ${headingClassName}`}
        >
          {heading}
        </Typography>
      )}
      <Box
        className={`flex flex-grow flex-col justify-center items-center gap-y-2 ${boxClassName}`}
      >
        <Typography>{message}</Typography>
        <LoadingButton
          className="w-24"
          buttonText="Reload"
          onSubmit={onSubmit}
          size="small"
          color="error"
          variant="outlined"
        />
      </Box>
    </Paper>
  );
};

export default ErrorComponent;
