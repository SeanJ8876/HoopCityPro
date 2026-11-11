function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  ...rest
}) {
  return (
    <label className="form-field">
      <span className="form-field__label">{label}</span>
      <input
        className="form-field__input"
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        {...rest}
      />
      {error && <span className="form-field__error">{error}</span>}
    </label>
  );
}

export default FormField;
