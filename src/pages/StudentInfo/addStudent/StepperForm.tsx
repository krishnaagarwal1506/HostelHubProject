import { ChangeEvent, ReactNode } from "react";
import { Box, TextField, Typography } from "@mui/material";

type StepperFormType = {
  formFields: {
    label: string;
    type: string;
    value: string;
    name: string;
    required?: boolean;
    error?: boolean;
    helperText?: string;
    endAdorment?: ReactNode;
  }[];
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const StepperForm = ({ formFields, handleChange }: StepperFormType) => {
  return (
    <Box className="flex flex-col md:gap-y-6 mt-3 flex-1">
      {formFields.map(
        ({ name, label, type, value, error, helperText, endAdorment }) => (
          <Box className="h-20 md:h-24 w-full" key={name}>
            <Typography className="pb-2">
              {label}
              <span className="text-red-500">*</span>
            </Typography>
            <TextField
              sx={{
                "& .Mui-focused": {
                  border: "0",
                },
                "& .MuiInputBase-root:focus": {
                  width: "100%",
                  border: "none",
                },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderWidth: 1,
                  },
                },
              }}
              inputProps={{
                className: "py-2 px-2 md:py-[0.85rem] md:px-[0.85rem]",
              }}
              FormHelperTextProps={{
                className: "m-0 ",
              }}
              type={type}
              name={name}
              value={value}
              fullWidth
              onChange={handleChange}
              required
              error={error || false}
              helperText={helperText || ""}
              InputProps={{
                endAdornment: endAdorment,
              }}
            />
          </Box>
        )
      )}
    </Box>
  );
};

export default StepperForm;
