import { ReactNode, FC } from "react";
import { SvgIconProps } from "@mui/material/SvgIcon";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type ReusableDialogProps = {
  dialogSize?: "xs" | "sm" | "md" | "lg";
  isOpen: boolean;
  title: string;
  subtitle?: ReactNode;
  handleClose: () => void;
  children: ReactNode;
  actions?: ReactNode;
  TitleIcon?: FC<SvgIconProps>;
};

const DialogModal = ({
  dialogSize = "sm",
  isOpen,
  title,
  handleClose,
  subtitle,
  children,
  actions,
  TitleIcon,
}: ReusableDialogProps) => {
  return (
    <Dialog fullWidth maxWidth={dialogSize} open={isOpen} onClose={handleClose}>
      <DialogTitle className="padding-b-0 ">
        <Box className="flex-row justiy-content-sp align-items-center">
          <Box className="flex-row align-items-center flex-gap-1">
            {TitleIcon && <TitleIcon color="primary" />}
            <Typography className="color-primary" variant="h5">
              {title}
            </Typography>
            {subtitle && (
              <Typography className="line-h-date align-self-end">
                {subtitle}
              </Typography>
            )}
          </Box>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
      {actions && (
        <DialogActions
          sx={{
            paddingRight: 3,
            paddingBottom: 2.5,
            gap: 1,
          }}
        >
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default DialogModal;
