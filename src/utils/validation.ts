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

export { validateEmail, validatePhone, validatePassword, validateText };
