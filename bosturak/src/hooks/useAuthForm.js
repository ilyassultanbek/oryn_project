import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { validateAuthForm } from "../utils/authValidation";
import { loginUser, registerUser } from "../services/authService";

const initialValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  remember: false,
};

export function useAuthForm() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [values, setValues] = useState({ ...initialValues });
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formRef = useRef(null);
  const submittingRef = useRef(false);

  function handleChange(event) {
    if (submittingRef.current) return;

    const { name, value, type, checked } = event.target;

    if (!Object.hasOwn(initialValues, name)) return;

    setValues((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: undefined,
      ...(name === "password"
        ? { confirmPassword: undefined }
        : {}),
    }));

    setNotice("");
  }

  function handleBlur(event) {
    if (submittingRef.current) return;

    const { name } = event.target;

    if (!Object.hasOwn(initialValues, name) || name === "remember") {
      return;
    }

    const nextErrors = validateAuthForm(values, isLogin);

    setErrors((current) => ({
      ...current,
      [name]: nextErrors[name],
    }));
  }

  function switchMode() {
    if (submittingRef.current) return;

    setIsLogin((current) => !current);
    setErrors({});
    setNotice("");

    setValues((current) => ({
      ...initialValues,
      email: current.email,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (submittingRef.current) return;

    setNotice("");

    const nextErrors = validateAuthForm(values, isLogin);
    setErrors(nextErrors);

    const firstError = Object.keys(nextErrors).find(
      (key) => nextErrors[key]
    );

    if (firstError) {
      formRef.current?.elements.namedItem(firstError)?.focus();
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    setNotice("Сұрау орындалуда…");

    try {
      if (isLogin) {
        await loginUser({
          email: values.email.trim(),
          password: values.password,
        });

        navigate("/", { replace: true });
      } else {
        await registerUser({
          name: values.name.trim(),
          email: values.email.trim(),
          password: values.password,
        });

        // Тіркелу аккаунт жасайды, бірақ сессия ашпайды.
        setIsLogin(true);
        setValues({
          ...initialValues,
          email: values.email.trim(),
        });
        setErrors({});
        setNotice(
          "Тіркелу сәтті аяқталды. Енді құпиясөзіңізді енгізіп, кіріңіз."
        );
      }
    } catch (error) {
      setNotice(error.message);
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  function handleForgotPassword() {
    if (submittingRef.current) return;

    setNotice(
      "Құпиясөзді email арқылы қалпына келтіру әлі қосылмаған."
    );
  }

  return {
    isLogin,
    values,
    errors,
    notice,
    isSubmitting,
    formRef,
    handleChange,
    handleBlur,
    handleSubmit,
    handleForgotPassword,
    switchMode,
  };
}