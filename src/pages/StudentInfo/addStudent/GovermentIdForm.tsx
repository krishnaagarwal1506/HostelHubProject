import { ChangeEvent, useRef, MouseEvent, useState } from "react";
import { Box, TextField, Grid, Typography } from "@mui/material";
import { StepperFormType } from "@ts/types";
import { ID_TYPE } from "@constant/index.ts";
import noImageUploaded from "@assets/noImageUploaded.jpeg";

const GovermentIdForm = ({
  student,
  handleChange,
  handleClick,
}: StepperFormType) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { govId, govIdImage } = student;
  const initalImage = govIdImage ? govIdImage : "";
  const [selectedImage, setSelectedImage] = useState(initalImage);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setSelectedImage(URL.createObjectURL(file));
    handleChange(event);
  };

  const handleCardClick = (event: MouseEvent<HTMLDivElement>) => {
    const { current } = fileInputRef;
    if (!current) return;
    current.click();
    handleClick(event);
  };

  return (
    <Box className="flex flex-col mt-3 justify-between">
      <Grid container className="justify-evenly">
        {ID_TYPE.map((innerText: string) => {
          const seletedClass =
            govId === innerText
              ? "bg-purple-50 border-primary-main shadow-md"
              : "border-gray-200";
          return (
            <Grid
              key={innerText}
              item
              xs={3}
              className={` h-12 cursor-pointer rounded-xl border-2 ${seletedClass}`}
              onClick={handleCardClick}
            >
              <Box className="w-full h-full m-auto text-center flex justify-center items-center">
                <Typography className="font-semibold">{innerText}</Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>
      <TextField
        className="hidden"
        type="file"
        inputRef={fileInputRef}
        inputProps={{ accept: "image/png, image/jpeg" }}
        fullWidth
        name="govIdImage"
        onChange={handleImageChange}
        required
      />
      <Box className="h-72 mt-4 w-full flex justify-center items-center rounded-xl border-2 border-dashed border-primary-main">
        <img
          className={"w-auto h-64 m-auto rounded-xl"}
          src={selectedImage ? selectedImage : noImageUploaded}
          alt="gov-id-img"
        />
      </Box>
    </Box>
  );
};

export default GovermentIdForm;
