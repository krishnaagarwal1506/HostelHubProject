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
  className?: string;
  dialogTitleClassName?: string;
  dialogActionClassName?: string;
  iconButtonClasses?: string;
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
  className = "",
  dialogTitleClassName = "",
  dialogActionClassName = "",
  iconButtonClasses = "",
}: ReusableDialogProps) => {
  return (
    <Dialog
      fullWidth
      maxWidth={dialogSize}
      open={isOpen}
      onClose={handleClose}
      PaperProps={{
        className: `rounded-xl ${className}`,
      }}
    >
      <DialogTitle
        className={`padding-b-0 mb-4 bg-primary-main ${dialogTitleClassName}`}
      >
        <Box className="flex-row justiy-content-sp align-items-center">
          <Box className="flex-row align-items-center flex-gap-1">
            {TitleIcon && <TitleIcon fontSize="large" className="text-white" />}
            <Typography
              className="text-lg md:text-2xl text-white inherit"
              variant="h5"
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography className="line-h-date align-self-end">
                {subtitle}
              </Typography>
            )}
          </Box>
          <IconButton className={iconButtonClasses} onClick={handleClose}>
            <CloseIcon className="text-white" />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
      {actions && (
        <DialogActions className={`pb-5 pr-6 gap-2 ${dialogActionClassName}`}>
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default DialogModal;
