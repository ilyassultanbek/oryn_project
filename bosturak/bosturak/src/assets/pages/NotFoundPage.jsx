import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function NotFoundPage() {
  return (
    <div
      className="flex min-h-screen flex-col bg-white
        text-slate-900 dark:bg-blue-950 dark:text-white"
    >
  

      <main
        className="mx-auto flex w-full max-w-7xl flex-1
          flex-col items-center justify-center px-6 py-24 text-center"
      >
        <p
          aria-hidden="true"
          className="text-8xl font-bold tracking-tight
            text-violet-600 dark:text-violet-300 sm:text-9xl"
        >
          404
        </p>

        <h1 className="mt-6 text-3xl font-bold sm:text-4xl">
          Бет табылмады
        </h1>

        <p
          className="mt-4 max-w-md leading-7
            text-slate-600 dark:text-slate-300"
        >
          Мекенжай қате жазылған немесе бұл бет қазір қолжетімсіз.
          Басты бетке оралып, қажетті бөлімді таңдаңыз.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center
            rounded-xl bg-violet-600 px-6 py-3
            font-semibold text-white transition-colors
            hover:bg-violet-700 focus-visible:outline
            focus-visible:outline-2 focus-visible:outline-offset-4
            focus-visible:outline-violet-500"
        >
          Басты бетке қайту
        </Link>
      </main>


    </div>
  );
}

export default NotFoundPage;