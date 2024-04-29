import { ChangeEvent, useState, useContext } from "react";
import {
  Paper,
  Box,
  Typography,
  TextField,
  IconButton,
  Divider,
  Button,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LoadingButton from "@components/LoadingButton";
import { AuthContext } from "@context/AuthContext";
import {
  getHelperText,
  validateEmail,
  validateError,
  validatePassword,
} from "@utils/validation";
import googleLogo from "@assets/google_logo.png";
import bgImage1 from "@assets/auth-v1-mask-light.png";
import bgImage2 from "@assets/auth-v1-tree.png";
import bgImage3 from "@assets/auth-v1-tree-2.png";
import AppLogo from "@src/svg/AppLogo";

const images = [
  {
    src: bgImage1,
    className: "hidden absolute lg:block bottom-0 left-0 -z-10 w-full",
  },
  { src: bgImage2, className: "hidden absolute lg:block left-0 bottom-0" },
  { src: bgImage3, className: "hidden absolute lg:block right-0 bottom-0" },
];

const Login = () => {
  const [userInformation, setUserInformation] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { handleLogin, handleGoogleLogin } = useContext(AuthContext);
  const { email, password } = userInformation;
  const isDisabled = !validateEmail(email) || !validatePassword(password);

  const handleChange = ({
    target: { name, value },
  }: ChangeEvent<HTMLInputElement>) => {
    setUserInformation((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box
      className="h-screen w-screen flex justify-center items-center"
      data-testid="login-page"
    >
      <Paper className="w-full m-4 sm:w-[28rem] sm:m-0  rounded-xl p-10">
        <Box className="m-auto w-fit mb-6 flex gap-x-2 items-center">
          <AppLogo />
          <Typography className="text-center text-3xl font-semibold text-primary-light">
            HostelHub
          </Typography>
        </Box>
        <Typography variant="h5" className="font-semibold text-gray-700 mb-1.5">
          Welcome Back! 👋🏻
        </Typography>
        <Typography className="text-gray-500">
          Please sign-in to your account to continue
        </Typography>
        <TextField
          className="mt-6 h-14"
          label="Email"
          type="email"
          name="email"
          fullWidth
          value={email}
          required
          variant="outlined"
          size="medium"
          onChange={handleChange}
          error={validateError(email, "email")}
          helperText={getHelperText(email, "email")}
          FormHelperTextProps={{
            className: "mx-1",
          }}
        />
        <TextField
          className="mt-6 mb-3 h-14"
          type={showPassword ? "text" : "password"}
          label="Password"
          name="password"
          fullWidth
          required
          variant="outlined"
          value={password}
          size="medium"
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            ),
          }}
          inputProps={{
            "data-testid": "password",
          }}
          error={validateError(password, "password")}
          helperText={getHelperText(password, "password")}
          FormHelperTextProps={{
            className: "mx-1",
          }}
        />
        <LoadingButton
          className="mt-4 w-full"
          buttonText="Login"
          disabled={isDisabled}
          onSubmit={() => handleLogin(email, password)}
        />
        <Divider sx={{ my: 3 }}>or</Divider>
        <Button
          onClick={handleGoogleLogin}
          className="m-auto flex items-center gap-x-2 px-4  text-black text-lg normal-case"
          startIcon={<img src={googleLogo} className="w-6 h-6" />}
        >
          Sign in with Google
        </Button>
        {images.map((image, index) => (
          <img
            key={index}
            src={image.src}
            className={image.className}
            alt={`background image ${index + 1}`}
            loading="lazy"
          />
        ))}
      </Paper>
    </Box>
  );
};

export default Login;
