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
    <Box className="flex flex-col mt-3 justify-between">
      {formFields.map(
        ({ name, label, type, value, error, helperText, endAdorment }) => (
          <Box className="h-24 w-full" key={name}>
            <Typography className="pb-1">
              {label}
              <span className="text-red-500">*</span>
            </Typography>
            <TextField
              inputProps={{
                className: "py-[10px] px-[14px]",
              }}
              FormHelperTextProps={{
                className: "mx-1",
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
