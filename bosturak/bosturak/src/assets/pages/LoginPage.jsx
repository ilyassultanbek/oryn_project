import { Link } from "react-router-dom";

import AuthForm from "../components/auth/AuthForm";
import { useAuthForm } from "../../hooks/useAuthForm";

import logo from "../images/logo.webp";
import loginBg from "../images/login-bg.webp";

function LoginPage() {
  const form = useAuthForm();
  const { isLogin } = form;

  return (
    <main
      className="flex min-h-screen items-center justify-center
        bg-gray-100 p-4 sm:p-5"
    >
      <div
        className="relative w-full max-w-6xl overflow-hidden
          rounded-[35px] bg-white shadow-2xl lg:h-[800px]"
      >
        <section
          className={`relative h-64 w-full
            transition-transform duration-[800ms] ease-in-out
            motion-reduce:transition-none
            lg:absolute lg:left-0 lg:top-0 lg:z-20
            lg:h-full lg:w-1/2
            ${
              isLogin
                ? "lg:translate-x-0"
                : "lg:translate-x-full"
            }`}
        >
          <img
            src={loginBg}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t
              from-black/80 via-black/30 to-transparent"
          />

          <Link
            to="/"
            aria-label="Басты бетке өту"
            className="absolute left-6 top-6 rounded-lg
              focus-visible:outline-2 focus-visible:outline-white
              lg:left-8 lg:top-8"
          >
            <img
              src={logo}
              alt="BosTurak"
              className="w-28 lg:w-32"
            />
          </Link>

          <div
            className="absolute bottom-6 left-6 right-6 text-white
              lg:bottom-12 lg:left-10 lg:right-10"
          >
            <h2 className="text-2xl font-bold leading-tight lg:text-4xl">
              Қалада бос тұрақ орнын
              <br />
              оңай табыңыз.
            </h2>

            <p
              className="mt-4 hidden max-w-md leading-relaxed
                text-white/80 lg:block"
            >
              Алматы қаласындағы қолжетімді тұрақ орындарын
              жылдам тауып, уақытыңызды үнемдеңіз.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="auth-title"
          className={`relative w-full bg-white
            transition-transform duration-[800ms] ease-in-out
            motion-reduce:transition-none
            lg:absolute lg:left-0 lg:top-0 lg:z-10
            lg:h-full lg:w-1/2 lg:overflow-y-auto
            ${
              isLogin
                ? "lg:translate-x-full"
                : "lg:translate-x-0"
            }`}
        >
          <div
            className="flex min-h-full flex-col
              px-6 py-8 sm:px-10 lg:px-12"
          >
            <AuthForm form={form} />
          </div>
        </section>
      </div>
    </main>
  );
}

export default LoginPage;