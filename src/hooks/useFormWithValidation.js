import { useState, useCallback } from "react";

export default function useFormWithValidation(initialValues = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  function handleChange(evt) {
    const { name, value } = evt.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: evt.target.validationMessage }));
    setIsValid(evt.target.closest("form").checkValidity());
  }

  const resetForm = useCallback((newValues = {}) => {
    setValues(newValues);
    setErrors({});
    setIsValid(false);
  }, []);

  return {
    values,
    errors,
    isValid,
    handleChange,
    resetForm,
    setValues,
    setIsValid,
  };
}
