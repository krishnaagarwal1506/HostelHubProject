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
  const [selectedImage, setSelectedImage] = useState<string>(initalImage);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    file
      ? setSelectedImage(URL.createObjectURL(file))
      : setSelectedImage(noImageUploaded);
    handleChange(event);
  };

  const handleCardClick = (event: MouseEvent<HTMLDivElement>) => {
    const { current } = fileInputRef;
    if (!current) return;
    current.click();
    handleClick(event);
  };

  return (
    <Box className="flex flex-col mt-3 gap-y-8 flex-1">
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
              className={`h-12 cursor-pointer rounded-xl border-2 ${seletedClass}`}
              onClick={handleCardClick}
            >
              <Box className="w-full h-full m-auto text-center flex justify-center items-center">
                <Typography className="text-xs md:text-base font-semibold">
                  {innerText}
                </Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>
      <TextField
        className="hidden"
        type="file"
        inputRef={fileInputRef}
        inputProps={{
          accept: "image/png, image/jpeg",
          "data-testid": "fileupload",
        }}
        fullWidth
        name="govIdImage"
        onChange={handleImageChange}
        required
      />
      <Box className="h-44 md:h-64 mt-4 w-full mb-4 md:mb:0 flex justify-center items-center rounded-xl border-2 border-dashed border-primary-main">
        <img
          className={"w-auto h-36 md:h-56  m-auto rounded-xl"}
          src={selectedImage || noImageUploaded}
          alt={selectedImage ? "Id card image" : "No Image Uploaded"}
          loading="lazy"
        />
      </Box>
    </Box>
  );
};

export default GovermentIdForm;
