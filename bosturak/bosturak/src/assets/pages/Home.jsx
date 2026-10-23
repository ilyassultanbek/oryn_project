import Header from "../components/Header"
import baner from "./baner.webp";
import banerHome from "../images/baner.webp"
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
    <Header/>
    <main >

        <section className=" mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-10 lg:grid-cols-2">
          
          <section >
            <span className="font-bold rounded-4xl text-[10px]  text-[#004b23] tracking-[2px] bg-[#c7f9cc] p-2 shadow-lg">• АЛМАТЫДА ТІКЕЛЕЙ ЭФИРДЕ</span>
            <h1 className="text-[70px] mt-10 ml-3 leading-20 font-bold">Қалада <span className="text-amber-300 text-shadow-lg/20">тұрақты</span> оңай табыңыз</h1>
            <p className="text-[18px]  ml-3 mt-10">Жақын орынды алдын ала брондаңыз, бағасын бірден көріңіз және уақытты үнемдеңіз...</p>
            <div className="mt-6 rounded-2xl bg-white p-4 shadow-lg">
      

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-gray-500">
                1248 орын қазір қолжетімді
              </p>

              <Link to="/parkings" className="rounded-lg bg-violet-600 px-5 py-3 text-sm text-white">
                Тұрақтарды көрсету
              </Link>
            </div>
          </div>

          {/* Статистика */}
          <div className="ml-5 mt-8 flex flex-wrap gap-8 md:gap-12">
            <div>
              <p className="font-bold text-[30px]">420+ </p>
              <p>серіктес тұрақ</p>
            </div>
            <div>
              <p className="font-bold text-[30px]">96% </p>
              <p>сәтті орындау</p>
            </div>
            <div>
              <p className="font-bold text-[30px]">4,8 </p>
              <p>қолданушы бағасы</p>
            </div>
          </div>
          </section>
          <section>
            <img className="rounded-[50px]" src={baner} alt="" />
          </section>
        </section>

        <section className="bg-[#F7F7F9]">
          <section className= "mx-auto max-w-7xl grid grid-cols-1 gap-10 px-6 py-10 lg:grid-cols-2">
            <section>
              <img className="rounded-4xl" src={banerHome} alt="" />
            </section>
            <section>
              <span className="font-bold tracking-[2px] rounded-4xl text-[10px] text-[#3c096c] bg-[#e2c6f7] p-2 shadow-lg">ҚАЛАЙ ЖҰМЫС ІСТЕЙДІ</span>
              <h1 className="font-bold text-[40px]  ml-3 mt-7">ҮШ ҚАДАМ - ТҰРАҚ ДАЙЫН</h1>
              <p className="text-[15px] ml-5 mt-5">Іздеуден төлемге дейінгі барлық әрекет бір сервисте...</p>

              
              <div className="ml-7 flex flex-col  mt-10 gap-6">    {/* қайдан табам дитін жері */}
                <div className="flex items-start gap-4">
                  <span className="px-3 py-2 rounded-xl font-bold bg-[#e2c6f7] text-[#3c096c] text-center">1</span>
                  <div>
                    <h3 className="font-bold">Бағытты енгізіңіз</h3>
                    <p className="mt-1 text-xs leading-relaxed text-gray-500">Мекенжайды немесе картадағы нүктені таңдаңыз</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="px-3 py-2 rounded-xl font-bold bg-[#e2c6f7] text-[#3c096c] text-center">2</span>
                  <div>
                    <h3 className="font-bold">Орын мен бағаны салыстырыңыз</h3>
                    <p className="mt-1 text-xs leading-relaxed text-gray-500">Қолжетімділік, қашықтық және тариф бір экранда.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="px-3 py-2 rounded-xl font-bold bg-[#e2c6f7] text-[#3c096c] text-center">3</span>
                  <div>
                    <h3 className="font-bold">Брондап, еркін кіріңіз</h3>
                    <p className="mt-1 text-xs leading-relaxed text-gray-500">QR-кодпен кіріп, тек пайдаланған уақытыңызға төлеңіз.</p>
                  </div>
                </div>
              </div>

              <button type="button" className="mt-8 inline-flex items-center gap-3 rounded-lg bg-violet-600 px-5 py-3 text-xs font-semibold text-white transition hover:bg-violet-700" >
                 <a href="https://almaty-parking.kz/ru/payment-methods" target="_blank">Алғашқы орынды брондау</a>
                <span aria-hidden="true">→</span>
              </button>
            </section>
          </section>
        </section>
    </main>
    <Footer/>
    </>
  )
}

export default Home