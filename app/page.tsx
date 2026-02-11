import { getProducts } from "@/lib/products";
import { getContacts } from "@/lib/contacts";
import { getReviews } from "@/lib/reviews";
import { CATEGORY_LABELS } from "@/lib/types";
import type { CategoryKey } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { BlockCalculator } from "@/components/BlockCalculator";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [products, c, reviewsData] = await Promise.all([
    getProducts().catch(() => []),
    getContacts(),
    getReviews(),
  ]);
  const byCategory = products.reduce<Record<CategoryKey, typeof products>>(
    (acc, p) => {
      if (!acc[p.category]) acc[p.category] = [];
      acc[p.category].push(p);
      return acc;
    },
    {} as Record<CategoryKey, typeof products>
  );
  const order: CategoryKey[] = [
    "fbs",
    "manipulator",
    "rings",
    "shlakoblock",
    "polublok",
    "covers_bottoms",
  ];
  const tel = c.phoneRaw ?? c.phone?.replace(/\D/g, "") ?? "";

  return (
    <>
      <section className="relative overflow-hidden min-h-[70vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--nevblock-blue)] via-[var(--nevblock-blue)]/95 to-[var(--nevblock-brown)]/80" />
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'}} />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/10 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 text-center w-full">
          <div className="inline-block mb-6 px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium">
            Надёжный поставщик с 2003 года
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight leading-tight">
            ООО «НЕВБЛОК»
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl text-white/95 font-medium mb-3">
            Производство газосиликатных блоков
          </p>
          <p className="text-white/70 mb-8 sm:mb-10 flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            Г. Невинномысск
          </p>
          <p className="text-white/85 max-w-2xl mx-auto mb-10 sm:mb-12 text-base sm:text-lg leading-relaxed">
            ФБС, кольца ЖБИ, шлакоблок, полублок, крышки и днища ЖБИ.<br className="hidden sm:block" />
            Доставка манипулятором. Работаем с юридическими лицами и частными заказчиками.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#catalog"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 min-h-[52px] bg-white text-[var(--nevblock-blue)] font-semibold rounded-xl hover:bg-gray-50 active:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-200"
            >
              Смотреть каталог
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="#contacts"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 min-h-[52px] bg-white/15 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/25 active:bg-white/30 transition-all duration-200"
            >
              Связаться с нами
            </a>
          </div>
        </div>
      </section>

      <section
        id="quality"
        className="scroll-mt-20 sm:scroll-mt-24 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 lg:py-24">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block mb-3 px-3 py-1 bg-[var(--nevblock-blue)]/10 text-[var(--nevblock-blue)] text-sm font-medium rounded-full">
              Почему мы
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--nevblock-blue)] mb-3">
              Качество и надёжность
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Контроль на всех этапах производства. Соответствие ГОСТ.
            </p>
          </div>
          <ul className="grid gap-6 sm:gap-8 sm:grid-cols-3">
            <li className="group text-center p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[var(--nevblock-light)] to-white border border-gray-100 hover:shadow-xl hover:border-[var(--nevblock-blue)]/20 transition-all duration-300">
              <span className="inline-flex w-14 h-14 rounded-2xl bg-[var(--nevblock-blue)] text-white items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Контроль качества</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Соблюдение технологии и норм при производстве блоков и ЖБИ</p>
            </li>
            <li className="group text-center p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[var(--nevblock-light)] to-white border border-gray-100 hover:shadow-xl hover:border-[var(--nevblock-brown)]/20 transition-all duration-300">
              <span className="inline-flex w-14 h-14 rounded-2xl bg-[var(--nevblock-brown)] text-white items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </span>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Проверено на объектах</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Продукция используется в жилом и коммерческом строительстве</p>
            </li>
            <li className="group text-center p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[var(--nevblock-light)] to-white border border-gray-100 hover:shadow-xl hover:border-[var(--nevblock-blue)]/20 transition-all duration-300">
              <span className="inline-flex w-14 h-14 rounded-2xl bg-[var(--nevblock-blue)] text-white items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Быстрая доставка</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Доставка манипулятором, соблюдение сроков. Работаем с юрлицами</p>
            </li>
          </ul>
        </div>
      </section>

      <section
        id="catalog"
        className="bg-white scroll-mt-20 sm:scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 lg:py-24">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-block mb-3 px-3 py-1 bg-[var(--nevblock-brown)]/10 text-[var(--nevblock-brown)] text-sm font-medium rounded-full">
              Наша продукция
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--nevblock-blue)] mb-2 sm:mb-3">
              Каталог товаров
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto text-sm sm:text-base">
              Строительные материалы и услуги с доставкой по региону
            </p>
          </div>
          <div className="space-y-10 sm:space-y-16">
            {order.map((cat) => {
              const items = byCategory[cat];
              if (!items?.length) return null;
              return (
                <div key={cat}>
                  <h3 className="text-lg sm:text-xl font-semibold text-[var(--nevblock-brown)] mb-4 sm:mb-6 flex items-center gap-2">
                    <span className="w-1 h-5 sm:h-6 bg-[var(--nevblock-brown)] rounded-full shrink-0" />
                    {CATEGORY_LABELS[cat]}
                  </h3>
                  <ul className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {items.map((p) => (
                      <li key={p.id}>
                        <ProductCard product={p} />
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="calculator"
        className="scroll-mt-20 sm:scroll-mt-24 bg-[var(--nevblock-light)]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 lg:py-24">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-block mb-3 px-3 py-1 bg-[var(--nevblock-blue)]/10 text-[var(--nevblock-blue)] text-sm font-medium rounded-full">
              Калькулятор
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--nevblock-blue)] mb-2 sm:mb-3">
              Рассчитайте количество блоков
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto text-sm sm:text-base">
              Узнайте точное количество строительных блоков для вашего проекта
            </p>
          </div>
          <BlockCalculator />
        </div>
      </section>

      <section
        id="reviews"
        className="scroll-mt-20 sm:scroll-mt-24 bg-[var(--nevblock-light)]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 lg:py-24">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-block mb-3 px-3 py-1 bg-[var(--nevblock-brown)]/10 text-[var(--nevblock-brown)] text-sm font-medium rounded-full">
              Нам доверяют
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--nevblock-blue)] mb-2 sm:mb-3">
              Отзывы клиентов
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto text-sm sm:text-base">
              Что говорят наши заказчики о сотрудничестве
            </p>
          </div>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviewsData.map((r) => (
              <li
                key={r.id}
                className="relative p-6 sm:p-7 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <svg className="absolute top-4 right-4 w-8 h-8 text-[var(--nevblock-blue)]/10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-5 pr-8">{r.text}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-[var(--nevblock-blue)]/10 flex items-center justify-center text-[var(--nevblock-blue)] font-semibold">
                    {r.author.charAt(0)}
                  </div>
                  <div>
                    <span className="block font-semibold text-gray-900">{r.author}</span>
                    {r.date && <span className="text-gray-400 text-sm">{r.date}</span>}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="contacts"
        className="scroll-mt-20 sm:scroll-mt-24 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 lg:py-24">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-block mb-3 px-3 py-1 bg-[var(--nevblock-blue)]/10 text-[var(--nevblock-blue)] text-sm font-medium rounded-full">
              Свяжитесь с нами
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--nevblock-blue)] mb-2 sm:mb-3">
              Контакты
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">Ответим на вопросы и поможем с заказом</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-[var(--nevblock-light)] to-white rounded-3xl border border-gray-100 shadow-lg p-6 sm:p-10">
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-5">
                  <h3 className="text-lg font-semibold text-[var(--nevblock-brown)]">
                    {c.companyName}
                  </h3>
                  <p className="text-gray-600 text-sm">{c.tagline}</p>
                  {c.address && (
                    <div className="flex items-start gap-3">
                      <span className="shrink-0 w-10 h-10 rounded-xl bg-[var(--nevblock-blue)]/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-[var(--nevblock-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">{c.city}</p>
                        <p className="text-gray-600 text-sm">{c.address}</p>
                      </div>
                    </div>
                  )}
                  {c.phone && (
                    <div className="flex items-start gap-3">
                      <span className="shrink-0 w-10 h-10 rounded-xl bg-[var(--nevblock-blue)]/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-[var(--nevblock-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">Телефон</p>
                        <a href={`tel:${tel}`} className="text-[var(--nevblock-blue)] font-semibold hover:underline">
                          {c.phone}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-4">
                  {c.whatsapp && (
                    <a
                      href={c.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 px-6 py-4 bg-[#25D366] text-white font-semibold rounded-2xl hover:bg-[#20bd5a] active:bg-[#1da851] transition-colors shadow-md"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Написать в WhatsApp
                    </a>
                  )}
                  {c.yandexMaps && (
                    <a
                      href={c.yandexMaps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 px-6 py-4 bg-[var(--nevblock-blue)] text-white font-semibold rounded-2xl hover:bg-[var(--nevblock-blue)]/90 active:bg-[var(--nevblock-blue)]/80 transition-colors shadow-md"
                    >
                      <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      Показать на карте
                    </a>
                  )}
                  <a
                    href={`tel:${tel}`}
                    className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-[var(--nevblock-blue)] text-[var(--nevblock-blue)] font-semibold rounded-2xl hover:bg-[var(--nevblock-blue)]/5 active:bg-[var(--nevblock-blue)]/10 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Позвонить
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
