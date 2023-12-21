function validateEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email.trim() === "" || !emailRegex.test(email)) {
    return false;
  }
  return true;
}

function validatePhone(phone: string) {
  const phoneRegex = /^[6-9]\d{9}$/;
  if (phone.trim() === "" || !phoneRegex.test(phone)) {
    return false;
  }
  return true;
}

function validatePassword(password: string) {
  if (password.length < 8 || password.trim() === "") {
    return false;
  }
  return true;
}

function validateText(text: string) {
  const nameRegex = /^[A-Za-z\s]+$/;
  if (text.trim() === "" || !nameRegex.test(text)) {
    return false;
  }
  return true;
}

const validateError = (value: string, type: string) => {
  if (value === "") return false;
  switch (type) {
    case "text":
      return !validateText(value);
    case "email":
      return !validateEmail(value);
    case "tel":
      return !validatePhone(value);
    case "password":
    case "confirmPassword":
      return !validatePassword(value);
    default:
      return false;
  }
};
const getHelperText = (
  value: string,
  type: string,
  confirmPassword?: string
): string => {
  if (validateError(value, type)) {
    switch (type) {
      case "text":
        return "Name cannot have special characters";
      case "email":
        return "Enter a valid email";
      case "tel":
        return "Enter a valid phone number";
      case "password":
      case "confirmPassword": {
        return "Password must contain atleast 8 characters";
      }
      default:
        return "Invalid input";
    }
  } else if (type === "confirmPassword" && value && value !== confirmPassword) {
    return "Password does not match";
  } else return "";
};

export {
  validateEmail,
  validatePhone,
  validatePassword,
  validateText,
  validateError,
  getHelperText,
};
