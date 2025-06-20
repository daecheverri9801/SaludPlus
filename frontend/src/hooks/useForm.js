import { useState } from "react";

export const useForm = (initialValues) => {
  const [formData, setFormData] = useState(initialValues);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (fieldErrors[id]) {
      setFieldErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    const errors = validateField(id, value);
    setFieldErrors((prev) => ({ ...prev, ...errors }));
  };

  const validateField = (field, value) => {
    const errors = {};
    if (!value.trim()) {
      errors[field] = "Este campo es obligatorio";
    }
    return errors;
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleBlur,
    fieldErrors,
    setFieldErrors,
  };
};
