"use client";

import Image from "next/image";
// import { Mail, MapPin, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/Header";
export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/search");
  };

  // Features data
  const features = [
    {
      icon: "./images/vector.svg",
      title: "Все объявления со всех автомобильных порталов Украины",
      description:
        "собираются в одном месте. Система определяет кто перекупщик, а кто хозяин по количеству размещенных автомобилей с номера телефона за последние 4 года",
    },
    {
      icon: "./images/vector2.svg",
      title: "Программа рассчитывает рыночную цену для каждого",
      description: "автомобиля среди аналогичных авто в нашей базе",
    },
    {
      icon: "./images/vector3.svg",
      title: "Черный список в который входят: объявления от лизинга,",
      description: "рассрочки, и просто фейковых объявлений",
    },
    {
      icon: "./images/vector4.svg",
      title: "Фильтр от перекупщиков : при желании можно убрать",
      description:
        "объявления от перекупщиков и площадок, а так же исключить пригнанные авто",
    },
  ];

  // Additional features data
  const additionalFeatures = [
    {
      icon: "./images/vector.svg",
      title: "Система непрерывно следит за изменением цены в",
      description:
        "объявлениях : если в старом объявлении изменится цена в меньшую сторону без повторной публикации и попадет под ваш фильтр вы получите уведомление",
    },
    {
      icon: "./images/vector2.svg",
      title: "Мгновенное оповещение о новых автомобилях на смартфон , по",
      description:
        "заданным параметрам ( марка, модель, год, разница от рыночной цены)",
    },
    {
      icon: "./images/vector3.svg",
      title: "Вам нужно только сделать выборку марок, моделей которые вам",
      description:
        "интересны, и отклонение от рыночной цены и получать уведомления по этому фильтру",
    },
    {
      icon: "./images/vector4.svg",
      title: "В среднем пару минут проходит от публикации на автосайтах до",
      description: "попадения в наш автопортал и Ваш смартфон",
    },
  ];

  // Service benefits data
  const serviceBenefits = [
    {
      title: "ПЕРЕКУПЩИКАМ",
      description:
        "Первым получай предложения по цене ниже рыночной в твоем регионе. Первым Узнавай об изменении цены на актуальные для тебя объявления. Отсеивай объявления от перекупов.Сможешь видеть машины с ценой ниже рыночной со всех автосайтов Украины. Уведомления в телеграм .",
    },
    {
      title: "ПЛОЩАДКАМ ПО ПОДБОРУ АВТОМОБИЛЕЙ",
      description:
        "Собранны все актуальные объявления.Экономия времени и персонала на поиск авто. Продуманный интерфейс. Удобная система оповещения о новых предложениях или изменениях цены на телеграм",
    },
    {
      title: "ТЕМ КТО ИЩЕТ ХОРОШИЙ АВТО",
      description:
        "Фильтр от перекупщиков и площадок Видишь сколько реально времени авто в продаже и как менялась цена. Если на сайте нет подходящего авто, активируйте уведомления в телеграм и получайте самые свежие объявления занимаясь своими делами",
    },
  ];

  return (
    <main className="w-full overflow-x-hidden">
      {/* Hero Section */}
      <section
        className="relative bg-[#691A1A]"
        style={{
          backgroundImage: "url(/images/bg-desktop.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundBlendMode: "overlay",
        }}
      >
        <div
          className="relative bg-cover bg-center text-white "
          style={{
            backgroundImage:
              "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(/images/bg.png)",
          }}
        >
          <Header />
          <div className="px-4 pb-5 mt-18 sm:mt-24 text-center">
            <h1 className="font-['Open_Sans'] text-bold text-3xl sm:text-5xl font-bold tracking-wide leading-tight">
              ЛУЧШИЙ ИНСТРУМЕНТ ДЛЯ ПОИСКА
              <br />
              АВТОМОБИЛЕЙ НИЖЕ РЫНОЧНОЙ ЦЕНЫ
            </h1>
            <h2 className="font-['Inter'] mt-8 text-md sm:text-2xl font-light max-w-4xl mx-auto">
              Только у нас Вы получите актуальные предложения от владельцев по
              всей Украине, со всех интернет ресурсов по интересным ценам
            </h2>
            <button
              onClick={handleClick}
              className="font-['Inter'] font-bold text-[15px] sm:text-[30px] bg-[#9D0D14] hover:bg-red-700 transition px-7 py-3 mt-12 rounded-[20px] text-white"
            >
              ВХОД НА ПОРТАЛ
            </button>

            <h3 className="font-['Inter'] font-medium mt-6 text-base pt-5">
              Самый удобный сервис. Все сайты в одном кабинете AutoRia, OLX,
              RST, Avtobazar и др.
              <br />
              <span className="font-['Inter'] font-semibold">
                Получай первым самые выгодные предложения.
              </span>
            </h3>
            <div>
              {" "}
              <Image
                src="/images/logo-row.svg"
                alt="all brands"
                width={300}
                height={80}
                className="w-full p-3 sm:p-8 filter grayscale hidden sm:block"
              />
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <section className="relative text-white pt-5 sm:pb-15">
          <div className="container mx-auto flex">
            <div className="bg-[#FF001D] rounded-2xl m-4 sm:m-3 p-6 sm:p-8 text-white max-w-[600px] h-[250px] shadow-lg relative">
              <p className="font-['Open_Sans'] font-regular text-[12px] sm:text-[14px] mb-15">
                Выбрать и купить новый автомобиль на PEREKUP можно достаточно
                просто и быстро — благодаря удобному подбору авто по параметрам,
                сервису сравнения автомобилей и интуитивно простой навигации.
              </p>
              <button
                onClick={handleClick}
                className="font-['Inter'] font-bold text-[12px] sm:text-[14px] bg-white text-[#821810] py-2 px-4 rounded-xl hover:bg-gray-200 transition"
              >
                ВХОД НА ПОРТАЛ
              </button>

              <div className="absolute right-0 bottom-0 w-45 md:w-60">
                <Image
                  src="/images/02.png"
                  alt="Red sports car"
                  width={500}
                  height={150}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0">
            <Image
              src="/images/prado.svg"
              alt="White SUV"
              width={550}
              height={300}
              className="object-contain hidden sm:block"
            />
          </div>
        </section>
        {/* newSection */}
        <section className="relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <p className="text-[20px] sm:text-[50px] text-center text-white">
              ▼
            </p>
            <h2 className="font-['Manrope'] text-3xl sm:text-5xl font-bold text-center uppercase tracking-wider mb-16 text-white">
              КАК ЭТО РАБОТАЕТ
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-16 items-stretc">
              <div className="relative h-full">
                <Image
                  src="/images/03.png"
                  alt="Red car on the street"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute top-5 right-10 ">
                  {" "}
                  <Image
                    src="/images/Group.svg"
                    alt="Car icon"
                    width={76}
                    height={76}
                  />
                </div>
                <div className="font-['Inter'] absolute top-20 right-30 text-sm text-[#821810] bg-white p-4 rounded-[5px]">
                  {" "}
                  Все авто в одном месте
                </div>
              </div>
              <div className="space-y-8 h-full">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-10">
                    <div className="flex-shrink-0">
                      <div className="w-12 sm:w-16 h-12 rounded-full bg-gradient-to-b from-[#851010] to-[#1F0404] flex items-center justify-center">
                        <Image
                          src={feature.icon}
                          alt=""
                          width={200}
                          height={100}
                          className="w-5 sm:w-8 h-5 sm:h-8"
                        />
                      </div>
                    </div>
                    <div className="text-white">
                      <h3 className="font-['Open_Sans'] text-xl sm:text-2xl font-semibold mb-4">
                        {feature.title}
                      </h3>
                      <p className="font-['Open_Sans'] text-base">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* Additional features section */}
        <section className="py-16 relative overflow-hidden">
          <div className="container max-w-screen-2xl mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row justify-between w-full gap-10">
              {/* Левая колонка — контакты */}
              <div className="w-full md:w-1/2 pr-4 space-y-8 order-1 md:order-1">
                {additionalFeatures.map((feature, index) => (
                  <div key={index} className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-gradient-to-b from-[#851010] to-[#1F0404] flex items-center justify-center">
                        <Image
                          src={feature.icon}
                          alt=""
                          width={200}
                          height={100}
                          className="w-5 sm:w-8 h-5 sm:h-8"
                        />
                      </div>
                    </div>
                    <div className="text-white">
                      <h3 className="text-xl sm:text-2xl font-semibold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-base">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Правая колонка — блок с картинкой */}
              <div className="w-full md:w-1/2 pl-4 order-2">
                <div className="relative h-[400px] sm:h-[538px] bg-white rounded-3xl p-3 shadow-[0px_4px_22.8px_20px_rgba(255,1,1,0.25)]">
                  <div className="flex space-x-2 mb-6">
                    {/* Иконки */}
                    <div className="w-12 sm:w-16 h-12 rounded-full bg-gradient-to-b from-red-600 to-gray-900 flex items-center justify-center">
                      <Image
                        src="/images/vector5.svg"
                        alt=""
                        width={200}
                        height={100}
                        className="w-5 sm:w-8 h-5 sm:h-8"
                      />
                    </div>
                    <div className="w-12 sm:w-16 h-12 rounded-full bg-gradient-to-b from-red-600 to-black flex items-center justify-center">
                      <Image
                        src="/images/vector6.svg"
                        alt=""
                        width={200}
                        height={100}
                        className="w-5 sm:w-8 h-5 sm:h-8"
                      />
                    </div>
                    <div className="w-12 sm:w-16 h-12 rounded-full bg-gradient-to-b from-red-600 to-gray-800 flex items-center justify-center">
                      <Image
                        src="/images/vector7.svg"
                        alt=""
                        width={200}
                        height={100}
                        className="w-5 sm:w-8 h-5 sm:h-8"
                      />
                    </div>
                  </div>
                  <p className="text-[#821810] text-xl sm:text-2xl font-bold text-center mt-4">
                    Устал сутками сидеть на разных сайтах поисках интересных
                    вариантов, наш сервис кардинально изменит твой доход!
                  </p>
                  <Image
                    src="/images/01.png"
                    alt="Car"
                    width={800}
                    height={100}
                    className="absolute max-w-[430px] sm:max-w-[800px] h-auto mt-8 bottom-[-60px] sm:bottom-[-105px] right-[-30px] sm:right-[-50px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Client statistics */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center">
              <div className="flex">
                <div className="bg-white text-black h-12 w-12 rounded-full flex items-center justify-center p-0">
                  <Image
                    src="/images/ML1.svg"
                    alt=""
                    width={200}
                    height={100}
                    className="w-12 h-12"
                  />
                </div>
                <div className="bg-white text-black h-12 w-12 rounded-full flex items-center justify-center p-0 -ml-[7px]">
                  <Image
                    src="/images/ML2.svg"
                    alt=""
                    width={200}
                    height={100}
                    className="w-12 h-12"
                  />
                </div>
                <div className="bg-white text-black h-12 w-12 rounded-full flex items-center justify-center p-0 -ml-[7px]">
                  <Image
                    src="/images/ML3.svg"
                    alt=""
                    width={200}
                    height={100}
                    className="w-12 h-12"
                  />
                </div>
                <div className="bg-white text-black h-12 w-12 rounded-full flex items-center justify-center p-0 -ml-[7px]">
                  <Image
                    src="/images/ML4.svg"
                    alt=""
                    width={200}
                    height={100}
                    className="w-12 h-12"
                  />
                </div>
              </div>
              <div className="ml-6">
                <p className="font-['Inter'] text-xl font-bold text-white">
                  34,000+
                </p>
                <p className="font-['Inter'] font-extralight text-white">
                  Довольных клиентов
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Service benefits section */}
        <section className="py-16 text-white">
          <div className="container mx-auto px-4">
            <h2 className="font-['Manrope'] text-3xl sm:text-5xl font-bold text-center uppercase tracking-wider mb-10 sm:mb-16">
              НАШ СЕРВИС БУДЕТ ПОЛЕЗЕН
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {serviceBenefits.map((benefit, index) => (
                <div key={index} className="bg-transparent border-none">
                  <div className="flex flex-col h-full">
                    <h3 className="font-['Inter'] text-xl font-semibold text-center mb-6">
                      {benefit.title}
                    </h3>
                    <p className="font-['Inter'] font-extralight text-sm flex-grow mb-6">
                      {benefit.description}
                    </p>
                    <button
                      onClick={handleClick}
                      className="font-['Open_Sans'] bg-white font-bold text-red-800 hover:bg-gray-100 rounded-full self-center px-8 py-3 cursor-pointer"
                    >
                      ПОПРОБОВАТЬ БЕСПЛАТНО
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Registration info */}
        <section className="py-12 px-4 text-white">
          <div className="container mx-auto txt-left sm:text-center">
            <p className="font-['Open_Sans'] text-base font-light mb-4">
              Для того что бы увидеть все возможности нашего сервиса вам нужно
              зарегистрироваться, и указать тот номер телефона на котором
              установлен телеграм. Чтобы получать уведомления о новых авто.
              После чего вам будет доступно день
              <span className="text-red-500"> бесплатного</span> пользования.
            </p>

            <p className="font-['Open_Sans'] text-base font-light my-6">
              ПОВТОРНАЯ РЕГИСТРАЦИЯ НЕ ДОПУСКАЕТСЯ
            </p>

            <p className="font-['Open_Sans'] text-base font-light mb-2">
              Наша команда постоянно работает над улучшением нашего сервиса, для
              того что вам было удобнее находить и покупать авто. Добавлена
              возможность посмотреть только проданные авто по заданым
              параметрам, для того что бы прицениться, а так же исключить
              пригнаные
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-[white] px-0 py-0 relative">
          <div className="w-full flex flex-col md:flex-row sm:justify-between sm:items-end">
            <div className="space-y-3 my-auto pl-4 sm:pl-16">
              <div className="mb-4">
                <a href="tel:+380500441132" className="flex items-center mb-2">
                  <span className="font-['Open_Sans'] font-light text-gray-500 w-20">
                    Телефон
                  </span>
                  <span className="font-['Open_Sans'] font-light text-white/75 hover:underline">
                    +38 (050) 044-11-32
                  </span>
                </a>
                <div className="flex items-center mb-2">
                  <span className="font-['Open_Sans'] font-light text-gray-500 w-20">
                    Адрес
                  </span>
                  <span className="font-['Open_Sans'] font-light text-white/75">
                    Украина
                  </span>
                </div>
                <a
                  href="mailto:pekekuppro7@gmail.com"
                  className="flex items-center mb-8"
                >
                  <span className="font-['Open_Sans'] font-light text-gray-500 w-20">
                    E-mail
                  </span>
                  <span className="font-['Open_Sans'] font-light text-white/75 hover:underline">
                    pekekuppro7@gmail.com
                  </span>
                </a>
              </div>
              <div className="flex gap-4 mt-4">
                <a href="#" className="hover:text-red-500">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="#" className="hover:text-red-500">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="hover:text-red-500">
                  <i className="fab fa-x-twitter"></i>
                </a>
                <a href="#" className="hover:text-red-500">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>

            <div className="mt-6 md:mt-0">
              <Image
                src="/images/tesla.svg"
                alt="Tesla"
                width={800}
                height={144}
                className="object-contain"
              />
            </div>
          </div>
        </footer>
        <h4 className="text-white/40 text-[50px] sm:text-[200px] font-bold text-center">
          PEREKUP-PRO
        </h4>
      </section>
    </main>
  );
}
