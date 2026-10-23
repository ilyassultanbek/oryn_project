import { useRef, useState } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";

import {
  sendMessage as createMessage,
  MESSAGE_TOPICS,
} from "../../services/messagesService";

const initialForm = {
  name: "",
  email: "",
  topic: "question",
  message: "",
};

function ContactPage() {
  const [form, setForm] = useState({ ...initialForm });
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submittingRef = useRef(false);

  function handleChange(event) {
    const { name, value } = event.target;

    if (
      submittingRef.current ||
      !Object.hasOwn(initialForm, name)
    ) {
      return;
    }

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setStatus(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (submittingRef.current) return;

    submittingRef.current = true;
    setIsSubmitting(true);
    setStatus(null);

    try {
      await createMessage(form);

      // Сервер сәтті жауап бергеннен кейін ғана тазалаймыз.
      setForm({ ...initialForm });

      setStatus({
        type: "success",
        text:
          "Хабарламаңыз жіберілді. " +
          "Оны сайт әкімшісі қарай алады.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        text:
          (error instanceof Error
            ? error.message
            : "Хабарламаны жіберу мүмкін болмады.") +
          " Енгізген мәтініңіз формада қалды.",
      });
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }

  const fieldClass =
    "mt-2 w-full rounded-xl border border-slate-300 " +
    "bg-white px-4 py-3 text-sm outline-none " +
    "focus:border-violet-500 focus:ring-2 focus:ring-violet-100 " +
    "disabled:cursor-not-allowed disabled:opacity-60 " +
    "dark:border-blue-700 dark:bg-blue-950 dark:text-white";

  return (
    <div
      className="flex min-h-screen flex-col bg-[#f7f9fc]
        text-slate-900 dark:bg-blue-950 dark:text-white"
    >
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-12">
        <h1 className="text-3xl font-bold sm:text-4xl">
          Бізбен байланысыңыз
        </h1>

        <p
          className="mt-3 max-w-2xl leading-7
            text-slate-600 dark:text-gray-300"
        >
          Сұрағыңыз, ұсынысыңыз немесе тұрақ туралы қате ақпарат
          бар ма? Төмендегі форманы толтырыңыз.
        </p>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-2">
          <section
            aria-labelledby="contact-info-title"
            className="rounded-3xl border border-slate-200
              bg-white p-6 sm:p-8 dark:border-blue-700
              dark:bg-blue-900"
          >
            <h2
              id="contact-info-title"
              className="text-2xl font-semibold"
            >
              Қандай хабарлама қалдыра аласыз?
            </h2>

            <ul
              className="mt-5 list-disc space-y-4 pl-5
                text-slate-600 dark:text-gray-300"
            >
              <li>Сервистің жұмысы туралы сұрақ.</li>
              <li>Жаңа мүмкіндік туралы ұсыныс.</li>
              <li>Тұрақ мекенжайы немесе бағасындағы қате.</li>
              <li>Тұрақты сервиске қосу туралы өтініш.</li>
            </ul>

            <p
              id="contact-note"
              className="mt-6 rounded-xl bg-amber-50 p-4
                text-sm leading-6 text-amber-900
                dark:bg-amber-950 dark:text-amber-200"
            >
              Хабарламаңыз сайт әкімшісіне жіберіледі.
              Сізбен байланысу үшін email мекенжайыңызды
              дұрыс көрсетіңіз.
            </p>
          </section>

          <section
            aria-labelledby="contact-form-title"
            className="rounded-3xl border border-slate-200
              bg-white p-6 sm:p-8 dark:border-blue-700
              dark:bg-blue-900"
          >
            <h2
              id="contact-form-title"
              className="text-2xl font-semibold"
            >
              Хабарлама қалдыру
            </h2>

            <form
              onSubmit={handleSubmit}
              aria-describedby="contact-note"
              aria-busy={isSubmitting}
              className="mt-6"
            >
              <fieldset
                disabled={isSubmitting}
                className="min-w-0 space-y-5 border-0 p-0"
              >
                <legend className="sr-only">
                  Байланыс мәліметтері және хабарлама
                </legend>

                <div>
                  <label
                    htmlFor="contact-name"
                    className="text-sm font-medium"
                  >
                    Атыңыз
                  </label>

                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={100}
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Атыңызды енгізіңіз"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="text-sm font-medium"
                  >
                    Email
                  </label>

                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    required
                    maxLength={254}
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-topic"
                    className="text-sm font-medium"
                  >
                    Тақырып
                  </label>

                  <select
                    id="contact-topic"
                    name="topic"
                    required
                    value={form.topic}
                    onChange={handleChange}
                    className={fieldClass}
                  >
                    {Object.entries(MESSAGE_TOPICS).map(
                      ([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="text-sm font-medium"
                  >
                    Хабарламаңыз
                  </label>

                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    maxLength={3000}
                    value={form.message}
                    onChange={handleChange}
                    aria-describedby="contact-message-count"
                    placeholder="Хабарламаңызды жазыңыз..."
                    className={`${fieldClass} resize-y`}
                  />

                  <p
                    id="contact-message-count"
                    className="mt-1 text-right text-xs
                      text-slate-500 dark:text-slate-300"
                  >
                    {form.message.length} / 3000
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-violet-600
                    px-6 py-3 font-semibold text-white
                    transition-colors hover:bg-violet-700
                    focus-visible:outline-2
                    focus-visible:outline-offset-4
                    focus-visible:outline-violet-600
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    motion-reduce:transition-none"
                >
                  {isSubmitting
                    ? "Жіберілуде..."
                    : "Хабарламаны жіберу"}
                </button>
              </fieldset>
            </form>

            {status && (
              <p
                role={status.type === "error" ? "alert" : "status"}
                className={`mt-5 rounded-xl p-4 text-sm ${
                  status.type === "success"
                    ? "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200"
                    : "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200"
                }`}
              >
                {status.text}
              </p>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ContactPage;