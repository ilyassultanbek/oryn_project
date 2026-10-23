import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import logo from "../images/logo.webp"

const features = [
  {
    number: "01",
    title: "Картадан табу",
    description:
      "Тұрақтардың орналасуын картадан көріп, таңдалған тұраққа бағыт құрыңыз.",
  },
  {
    number: "02",
    title: "Іздеу және салыстыру",
    description:
      "Аудан, баға және бос орын бойынша сүзгілерді қолданып, ыңғайлы тұрақты таңдаңыз.",
  },
  {
    number: "03",
    title: "Таңдаулылар",
    description:
      "Жиі пайдаланатын тұрақтарды таңдаулыларға қосып, кейін оңай табыңыз.",
  },
];

function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7f9fc]
      text-slate-900 dark:bg-blue-950 dark:text-white">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-12">
        {/* Кіріспе */}
        <section className="max-w-3xl">
          <span className="inline-block rounded-full bg-green-100
            px-4 py-2 text-xs font-bold tracking-widest
            text-green-800 dark:bg-green-900 dark:text-green-200">
            oryn ТУРАЛЫ
          </span>

          <img className="mt-5 w-50" src={logo} alt="" />

          <h1 className="mt-6 text-3xl font-bold leading-tight
            sm:text-5xl">
            Тұрақ іздеуді
            <span className="text-violet-600 dark:text-violet-400">
              {" "}жеңілдетеміз
            </span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600
            dark:text-gray-300">
            oryn — Алматыдағы автотұрақтарды картадан қарап,
            аудан бойынша іздеуге және бағаларын салыстыруға
            арналған веб-қосымша.
          </p>

          <p className="mt-4 leading-7 text-slate-600 dark:text-gray-300">
            Мақсатымыз — тұрақ туралы ақпаратты бір жерге жинап,
            жүргізушілердің іздеуге кететін уақытын азайту.
          </p>
        </section>

        {/* Мүмкіндіктер */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold">
            oryn-мен не істей аласыз?
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.number}
                className="rounded-3xl border border-slate-200
                  bg-white p-6 shadow-sm dark:border-blue-700
                  dark:bg-blue-900"
              >
                <span className="inline-flex h-12 w-12
                  items-center justify-center rounded-2xl
                  bg-violet-100 font-bold text-violet-700
                  dark:bg-violet-900 dark:text-violet-200">
                  {feature.number}
                </span>

                <h3 className="mt-5 text-xl font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6
                  text-slate-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </section>

    

        {/* Картаға өту */}
        <section className="mt-12 rounded-3xl bg-slate-900
          px-6 py-10 text-center text-white sm:px-10">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Өзіңізге ыңғайлы тұрақты табыңыз
          </h2>

          <p className="mt-3 text-slate-300">
            Картаны ашып, сервистің мүмкіндіктерін байқап көріңіз.
          </p>

          <Link
            to="/map"
            className="mt-6 inline-flex items-center gap-3
              rounded-xl bg-violet-600 px-6 py-3
              font-semibold transition hover:bg-violet-700"
          >
            Картаны ашу
            <span aria-hidden="true">→</span>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default AboutPage;