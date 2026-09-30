import ModalWithForm from "../ModalWithForm/ModalWithForm.jsx";
import FormField from "../ModalWithForm/FormField.jsx";
import useFormWithValidation from "../../hooks/useFormWithValidation.js";
import "./LoginModal.css";

export default function LoginModal({
  onClose,
  onSubmit,
  onSwitch,
  isSubmitting,
  error,
  notice,
}) {
  const { values, errors, isValid, handleChange } = useFormWithValidation({
    email: "",
    password: "",
  });

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(values);
  }

  return (
    <ModalWithForm
      title="Sign in"
      buttonText="Sign in"
      isValid={isValid}
      isSubmitting={isSubmitting}
      error={error}
      notice={notice}
      onSubmit={handleSubmit}
      onClose={onClose}
      footer={
        <>
          or{" "}
          <button className="modal__link" type="button" onClick={onSwitch}>
            Sign up
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
    </ModalWithForm>
  );
}
