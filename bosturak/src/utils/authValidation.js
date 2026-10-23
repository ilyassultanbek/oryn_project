export function validateAuthForm(values, isLogin) {
  const errors = {};

  if (!isLogin) {
    const name = values.name.trim();

    if (!name) {
      errors.name = "Аты-жөніңізді енгізіңіз.";
    } else if (name.length < 2) {
      errors.name = "Аты-жөніңіз кемінде 2 таңбадан тұрсын.";
    } else if (name.length > 100) {
      errors.name = "Аты-жөніңіз 100 таңбадан аспасын.";
    }
  }

  const email = values.email.trim();

  if (!email) {
    errors.email = "Email мекенжайын енгізіңіз.";
  } else if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    errors.email = "Email форматы дұрыс емес. Мысалы: name@mail.kz";
  }

  if (!values.password) {
    errors.password = "Құпия сөзді енгізіңіз.";
  } else if (!isLogin && values.password.length < 8) {
    errors.password = "Құпия сөз кемінде 8 таңбадан тұрсын.";
  } else if (!isLogin && !values.password.trim()) {
    errors.password = "Құпия сөз тек бос орындардан тұрмауы керек.";
  }

  if (!isLogin) {
    if (!values.confirmPassword) {
      errors.confirmPassword = "Құпия сөзді қайталап енгізіңіз.";
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Құпия сөздер сәйкес келмейді.";
    }
  }

  return errors;
}