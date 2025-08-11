function validationSignUpData(data) {
  const { firstName, lastName, emailId, password } = data;

  if (!firstName || typeof firstName !== "string") {
    return {
      isValid: false,
      message: "First name is required and must be a string.",
    };
  }
  if (!lastName || typeof lastName !== "string") {
    return {
      isValid: false,
      message: "Last name is required and must be a string.",
    };
  }
  if (!emailId || typeof emailId !== "string" || !emailId.includes("@")) {
    return { isValid: false, message: "Valid emailId is required." };
  }
  if (!password || typeof password !== "string" || password.length < 6) {
    return {
      isValid: false,
      message: "Password is required and must be at least 6 characters.",
    };
  }
  return { isValid: true };
}

module.exports = { validationSignUpData };
