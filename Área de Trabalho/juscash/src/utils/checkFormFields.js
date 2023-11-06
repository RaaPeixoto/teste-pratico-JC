export default function checkFormFields(form) {
  const isAllFieldsFilled = Object.values(form).every((value) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== null && value !== undefined && value.trim() !== "";
  });
  return isAllFieldsFilled;
}
