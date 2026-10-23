import AuthField from "./AuthField";

function AuthForm({ form }) {
  const {
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
  } = form;

  function fieldProps(name) {
    return {
      name,
      value: values[name],
      error: errors[name],
      onChange: handleChange,
      onBlur: handleBlur,
    };
  }

  return (
    <div className="my-auto w-full max-w-md self-center">
      <div className="mb-7">
        {isLogin && (
          <p className="mb-2 font-semibold text-green-600">
            Қош келдіңіз
          </p>
        )}

        <h1
          id="auth-title"
          className="text-3xl font-bold text-gray-900 sm:text-4xl"
        >
          {isLogin ? "Аккаунтқа кіру" : "Тіркелу"}
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          {isLogin
            ? "Oryn жүйесіне кіру үшін мәліметтеріңізді енгізіңіз."
            : "Жаңа аккаунт жасау үшін төмендегі мәліметтерді толтырыңыз."}
        </p>
      </div>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        aria-busy={isSubmitting}
        className="space-y-4"
      >
        <fieldset
          disabled={isSubmitting}
          className="m-0 min-w-0 space-y-4 border-0 p-0"
        >
          <legend className="sr-only">
            {isLogin ? "Кіру деректері" : "Тіркелу деректері"}
          </legend>

          {!isLogin && (
            <AuthField
              {...fieldProps("name")}
              label="Аты-жөніңіз"
              type="text"
              autoComplete="name"
              required
              maxLength={100}
              placeholder="Аты-жөніңізді енгізіңіз"
            />
          )}

          <AuthField
            {...fieldProps("email")}
            label="Email"
            type="email"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            required
            maxLength={254}
            placeholder="example@gmail.com"
          />

          <AuthField
            {...fieldProps("password")}
            label="Құпия сөз"
            type="password"
            autoComplete={
              isLogin ? "current-password" : "new-password"
            }
            required
            placeholder={
              isLogin ? "Құпия сөзіңіз" : "Кемінде 8 таңба"
            }
          />

          {!isLogin && (
            <AuthField
              {...fieldProps("confirmPassword")}
              label="Құпия сөзді қайталаңыз"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Құпия сөзді қайта енгізіңіз"
            />
          )}

          {isLogin && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="rounded text-sm text-green-700
                  hover:underline focus-visible:outline-2
                  focus-visible:outline-green-600
                  disabled:cursor-not-allowed disabled:opacity-50"
              >
                Құпия сөзді ұмыттыңыз ба?
              </button>
            </div>
          )}

          {Object.values(errors).some(Boolean) && (
            <p role="alert" className="text-sm text-red-600">
              Белгіленген өрістердегі қателерді түзетіңіз.
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-green-600 py-4
              font-semibold text-white shadow-lg
              shadow-green-600/20 transition-colors
              enabled:hover:bg-green-700
              enabled:active:bg-green-800
              disabled:cursor-not-allowed disabled:opacity-60
              focus-visible:outline-2
              focus-visible:outline-offset-4
              focus-visible:outline-green-600"
          >
            {isSubmitting
              ? "Күтіңіз…"
              : isLogin
                ? "Кіру"
                : "Тіркелу"}
          </button>
        </fieldset>

        <div role="status" aria-live="polite" aria-atomic="true">
          {notice && (
            <p
              className="rounded-xl border border-amber-200
                bg-amber-50 p-4 text-sm leading-6 text-amber-900"
            >
              {notice}
            </p>
          )}
        </div>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-gray-500">
          {isLogin
            ? "Аккаунтыңыз жоқ па? "
            : "Аккаунтыңыз бар ма? "}
        </span>

        <button
          type="button"
          onClick={switchMode}
          disabled={isSubmitting}
          className="rounded font-semibold text-green-700
            enabled:hover:underline
            disabled:cursor-not-allowed disabled:opacity-50
            focus-visible:outline-2
            focus-visible:outline-green-600"
        >
          {isLogin ? "Тіркелу" : "Кіру"}
        </button>
      </div>
    </div>
  );
}

export default AuthForm;