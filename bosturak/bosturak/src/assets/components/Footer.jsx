import { Link } from "react-router-dom";
import logo from "../images/logo.webp";

const footerGroups = [
  {
    title: "Сервис",
    links: [
      { label: "Тұрақ табу", to: "/about" },
      { label: "Аудандар", to: "/products" },
      { label: "Паркингтер", to: "/services" },
    ],
  },
  {
    title: "BosTurak",
    links: [
      { label: "Басты бет", to: "/" },
      { label: "Біз туралы", to: "/about-us" },
      { label: "Байланыс", to: "/contact" },
    ],
  },
];

function Footer() {
  return (
    <footer className="bg-[#eef4ed] ">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="inline-flex items-center gap-3"
            >
              <img
                src={logo}
                alt="BosTurak"
                className="h-12 w-auto object-contain"
              />
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6">
              Алматыдағы бос тұрақтарды жылдам табуға
              көмектесетін сервис.
            </p>

            <Link
              to="/map"
              className="mt-5 inline-flex rounded-lg border
                border-white/10 px-4 py-2 text-sm text-black
                transition-colors hover:border-emerald-400
                hover:text-emerald-400"
            >
              Картадан тұрақ табу →
            </Link>
          </div>

          {/* Сілтемелер */}
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-4 text-sm font-semibold ">
                {group.title}
              </h3>

              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm transition-colors
                        hover:text-emerald-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Қолдау */}
          <div>
            <h3 className="mb-4 text-sm font-semibold ">
              Қолдау қызметі
            </h3>

            <p className="text-sm leading-6">
              Сұрағыңыз немесе ұсынысыңыз бар ма?
            </p>

            <Link
              to="/contact"
              className="mt-3 inline-block text-sm
                transition-colors hover:text-emerald-400"
            >
              Бізбен байланысу →
            </Link>

            <div className="mt-4">
              <span className="inline-flex items-center gap-2
                rounded-full bg-emerald-500/10 px-3 py-1
                text-xs text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Алматы қаласы
              </span>
            </div>
          </div>
        </div>

        {/* Төменгі жол */}
        <div className="mt-10 flex flex-col gap-4
          border-t border-white/10 pt-5 text-xs
          md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} BosTurak.
            Барлық құқық қорғалған.
          </p>

          <div className="flex flex-wrap items-center gap-5">
            <Link
              to="/privacy"
              className="transition-colors hover:text-white"
            >
              Құпиялылық саясаты
            </Link>

            <Link
              to="/terms"
              className="transition-colors hover:text-white"
            >
              Қолдану шарттары
            </Link>

            <span>Қазақша · KZ</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;