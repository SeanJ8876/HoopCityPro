import ModalWithForm from "../ModalWithForm/ModalWithForm.jsx";
import FormField from "../ModalWithForm/FormField.jsx";
import useFormWithValidation from "../../hooks/useFormWithValidation.js";

export default function RegisterModal({
  onClose,
  onSubmit,
  onSwitch,
  isSubmitting,
  error,
}) {
  const { values, errors, isValid, handleChange } = useFormWithValidation({
    email: "",
    password: "",
    name: "",
  });

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(values);
  }

  return (
    <ModalWithForm
      title="Sign up"
      buttonText="Sign up"
      isValid={isValid}
      isSubmitting={isSubmitting}
      error={error}
      onSubmit={handleSubmit}
      onClose={onClose}
      footer={
        <>
          or{" "}
          <button className="modal__link" type="button" onClick={onSwitch}>
            Sign in
          </button>
        </>
      }
    >
      <FormField
        label="Email"
        name="email"
        type="email"
        placeholder="Enter email"
        value={values.email}
        error={errors.email}
        onChange={handleChange}
        autoFocus
      />
      <FormField
        label="Password"
        name="password"
        type="password"
        placeholder="Enter password"
        minLength={8}
        value={values.password}
        error={errors.password}
        onChange={handleChange}
      />
      <FormField
        label="Username"
        name="name"
        type="text"
        placeholder="Enter your username"
        minLength={2}
        maxLength={30}
        value={values.name}
        error={errors.name}
        onChange={handleChange}
      />
    </ModalWithForm>
  );
}
