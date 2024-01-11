import {
  validateEmail,
  validatePassword,
  validatePhone,
  validateText,
  validateError,
  getHelperText,
} from "../validation";

describe("Validation", () => {
  describe("validateEmail", () => {
    it("should return true for a valid email", () => {
      const validEmail = "test@example.com";
      const isValid = validateEmail(validEmail);
      expect(isValid).toBe(true);
    });

    it("should return false for an invalid email", () => {
      const invalidEmail = "test@example";
      const isValid = validateEmail(invalidEmail);
      expect(isValid).toBe(false);
    });
  });

  describe("validatePassword", () => {
    it("should return true for a valid password", () => {
      const validPassword = "Abcd1234!";
      const isValid = validatePassword(validPassword);
      expect(isValid).toBe(true);
    });

    it("should return false for an invalid password", () => {
      const invalidPassword = "abc123";
      const isValid = validatePassword(invalidPassword);
      expect(isValid).toBe(false);
    });
  });

  describe("validatePhone", () => {
    it("should return true for a valid phone number", () => {
      const validPhone = "9999999999";
      const isValid = validatePhone(validPhone);
      expect(isValid).toBe(true);
    });

    it("should return false for an invalid phone number", () => {
      const invalidPhone = "123";
      const isValid = validatePhone(invalidPhone);
      expect(isValid).toBe(false);
    });
  });

  describe("validateText", () => {
    it("should return true for a valid text", () => {
      const validText = "Hello World";
      const isValid = validateText(validText);
      expect(isValid).toBe(true);
    });

    it("should return false for an invalid text", () => {
      const invalidText = "Hello World!";
      const isValid = validateText(invalidText);
      expect(isValid).toBe(false);
    });
  });
  describe("validateError", () => {
    it("should return false for empty string", () => {
      expect(validateError("", "text")).toBe(false);
    });

    it("should validate text", () => {
      expect(validateError("validText", "text")).toBe(false);
      expect(validateError("invalidText!", "text")).toBe(true);
    });

    it("should validate email", () => {
      expect(validateError("validEmail@example.com", "email")).toBe(false);
      expect(validateError("invalidEmail", "email")).toBe(true);
    });

    it("should validate tel", () => {
      expect(validateError("9999999999", "tel")).toBe(false);
      expect(validateError("invalidTel", "tel")).toBe(true);
    });

    it("should validate password", () => {
      expect(validateError("validPassword", "password")).toBe(false);
      expect(validateError("111", "password")).toBe(true);
    });
    it("default case", () =>
      expect(validateError("invalid", "invalid")).toBe(false));
  });

  describe("getHelperText", () => {
    it("should return error message for invalid text", () => {
      expect(getHelperText("invalidText!", "text")).toBe(
        "Name cannot have special characters"
      );
    });

    it("should return error message for invalid email", () => {
      expect(getHelperText("invalidEmail", "email")).toBe(
        "Enter a valid email"
      );
    });

    it("should return error message for invalid tel", () => {
      expect(getHelperText("invalidTel", "tel")).toBe(
        "Enter a valid phone number"
      );
    });

    it("should return error message for invalid password", () => {
      expect(getHelperText("111", "password")).toBe(
        "Password must contain atleast 8 characters"
      );
    });

    it("should return error message for non-matching passwords", () => {
      expect(getHelperText("password1", "confirmPassword", "password2")).toBe(
        "Password does not match"
      );
    });
    it("default case", () =>
      expect(getHelperText("invalid", "invalid")).toBe(""));
  });
});
