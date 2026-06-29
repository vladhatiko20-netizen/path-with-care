import { PageShell } from "@/components/site/PageShell";
import { useLang } from "@/lib/i18n";

export function Component() {
  const { t, lang } = useLang();
  return (
    <PageShell>
      <section lang={lang} className="max-w-3xl mx-auto px-6 py-12 md:py-12">
        <p className="overline mb-5">{t("Документ", "Document")}</p>
        <h1 className="font-serif text-3xl md:text-6xl font-light text-foreground mb-8 leading-tight break-words">
          {t("Политика конфиденциальности", "Politica de confidențialitate")}
        </h1>

        <p className="text-foreground/90 leading-relaxed mb-4">
          {t(
            "Настоящая Политика конфиденциальности описывает, какие данные собирает сайт palomnik.md, как они используются и как мы их защищаем. Пользуясь сайтом, вы соглашаетесь с условиями, изложенными ниже.",
            "Prezenta Politică de confidențialitate descrie ce date colectează site-ul palomnik.md, cum sunt utilizate și cum le protejăm. Prin utilizarea site-ului, vă exprimați acordul cu condițiile expuse mai jos."
          )}
        </p>

        <h2 className="font-serif text-xl md:text-2xl font-light text-foreground mt-10 mb-4">
          {t("Кто обрабатывает ваши данные", "Cine prelucrează datele dumneavoastră")}
        </h2>
        <p className="text-foreground/90 leading-relaxed mb-4">
          {t(
            "Сайт palomnik.md принадлежит компании Societatea cu Răspundere Limitată ELDORADO TUR (SRL «ELDORADO TUR»).",
            "Site-ul palomnik.md aparține companiei Societatea cu Răspundere Limitată ELDORADO TUR (SRL „ELDORADO TUR")."
          )}
          <br />
          {t("Фискальный код (IDNO): 1015600011157", "Cod fiscal (IDNO): 1015600011157")}
          <br />
          {t(
            "Юридический адрес: MD-2060, Республика Молдова, мун. Кишинёв, сектор Ботаника, бул. Дачия, 20, оф. 81",
            "Adresa juridică: MD-2060, Republica Moldova, mun. Chișinău, sectorul Botanica, bd. Dacia, 20, of. 81"
          )}
          <br />
          {t("Телефон: (068) 77-86-76", "Telefon: (068) 77-86-76")}
          <br />
          {t(
            "Электронная почта: office.eldoradotur@gmail.com, palomnik.moldova@gmail.com",
            "E-mail: office.eldoradotur@gmail.com, palomnik.moldova@gmail.com"
          )}
        </p>
        <p className="text-foreground/90 leading-relaxed mb-4">
          {t(
            "Обработка персональных данных осуществляется в соответствии с Законом Республики Молдова № 133 от 8 июля 2011 года «О защите персональных данных».",
            "Prelucrarea datelor cu caracter personal se efectuează în conformitate cu Legea Republicii Moldova nr. 133 din 8 iulie 2011 privind protecția datelor cu caracter personal."
          )}
        </p>

        <h2 className="font-serif text-xl md:text-2xl font-light text-foreground mt-10 mb-4">
          {t("Какие данные мы собираем", "Ce date colectăm")}
        </h2>
        <p className="text-foreground/90 leading-relaxed mb-4">
          {t(
            "Мы собираем только те данные, которые вы сами оставляете нам, когда обращаетесь через формы на сайте: ваше имя, номер телефона, а также текст вашего сообщения или вопроса. Если вы указываете количество человек для поездки, эти сведения тоже сохраняются вместе с заявкой.",
            "Colectăm doar datele pe care ni le lăsați dumneavoastră atunci când ne contactați prin formularele de pe site: numele, numărul de telefon, precum și textul mesajului sau al întrebării. Dacă indicați numărul de persoane pentru o călătorie, aceste informații se păstrează împreună cu solicitarea."
          )}
        </p>
        <p className="text-foreground/90 leading-relaxed mb-4">
          {t(
            "Мы не просим вас регистрироваться, не создаём личные кабинеты и не запрашиваем паспортные или платёжные данные через сайт. Все вопросы оформления поездки решаются отдельно, при личном общении.",
            "Nu vă cerem să vă înregistrați, nu creăm conturi personale și nu solicităm date de pașaport sau de plată prin intermediul site-ului. Toate aspectele legate de organizarea călătoriei se rezolvă separat, în cadrul comunicării personale."
          )}
        </p>
        <p className="text-foreground/90 leading-relaxed mb-4">
          {t(
            "Если вы пользуетесь голосовым вводом при заполнении формы, ваша аудиозапись передаётся для распознавания в текст и не сохраняется на сайте после обработки.",
            "Dacă utilizați introducerea vocală la completarea formularului, înregistrarea audio este transmisă pentru recunoașterea în text și nu se păstrează pe site după prelucrare."
          )}
        </p>

        <h2 className="font-serif text-xl md:text-2xl font-light text-foreground mt-10 mb-4">
          {t("Зачем мы используем эти данные", "De ce utilizăm aceste date")}
        </h2>
        <p className="text-foreground/90 leading-relaxed mb-4">
          {t(
            "Оставленные вами данные нужны для одной цели – связаться с вами и ответить на ваше обращение: рассказать о поездке, ответить на вопрос, помочь с выбором. Мы не используем ваши данные для рекламы и не передаём их посторонним лицам.",
            "Datele pe care ni le lăsați ne sunt necesare pentru un singur scop – să luăm legătura cu dumneavoastră și să răspundem solicitării: să vă povestim despre călătorie, să răspundem la întrebare, să vă ajutăm cu alegerea. Nu folosim datele dumneavoastră în scopuri publicitare și nu le transmitem unor terțe persoane."
          )}
        </p>

        <h2 className="font-serif text-xl md:text-2xl font-light text-foreground mt-10 mb-4">
          {t("Файлы cookie и аналитика", "Fișiere cookie și analiză")}
        </h2>
        <p className="text-foreground/90 leading-relaxed mb-4">
          {t(
            "Сайт может использовать файлы cookie и сервисы веб-аналитики, чтобы понимать, насколько удобно посетителям пользоваться сайтом, и улучшать его работу. Эти данные носят обобщённый характер, не используются для рекламы и не позволяют установить вашу личность. Вы можете отключить файлы cookie в настройках своего браузера.",
            "Site-ul poate utiliza fișiere cookie și servicii de analiză web pentru a înțelege cât de comod le este vizitatorilor să folosească site-ul și pentru a-i îmbunătăți funcționarea. Aceste date au un caracter generalizat, nu sunt folosite în scopuri publicitare și nu permit identificarea persoanei dumneavoastră. Puteți dezactiva fișierele cookie din setările browserului."
          )}
        </p>

        <h2 className="font-serif text-xl md:text-2xl font-light text-foreground mt-10 mb-4">
          {t("Как мы защищаем данные", "Cum protejăm datele")}
        </h2>
        <p className="text-foreground/90 leading-relaxed mb-4">
          {t(
            "Доступ к оставленным вами данным имеют только сотрудники, которым он необходим для ответа на ваше обращение. Мы принимаем разумные технические и организационные меры, чтобы защитить эти данные от потери и постороннего доступа. Данные хранятся на защищённых серверах наших технических партнёров.",
            "Au acces la datele pe care ni le lăsați doar angajații cărora le este necesar pentru a răspunde solicitării dumneavoastră. Aplicăm măsuri tehnice și organizatorice rezonabile pentru a proteja aceste date împotriva pierderii și accesului neautorizat. Datele se păstrează pe servere protejate ale partenerilor noștri tehnici."
          )}
        </p>

        <h2 className="font-serif text-xl md:text-2xl font-light text-foreground mt-10 mb-4">
          {t("Ваши права", "Drepturile dumneavoastră")}
        </h2>
        <p className="text-foreground/90 leading-relaxed mb-4">
          {t(
            "Вы можете в любой момент попросить нас показать, какие ваши данные у нас есть, исправить их или удалить. Для этого напишите нам на office.eldoradotur@gmail.com (или palomnik.moldova@gmail.com) или позвоните по указанному выше телефону. Мы выполним вашу просьбу в разумный срок, если только закон не обязывает нас сохранить какие-то сведения.",
            "Puteți oricând să ne cereți să vă arătăm ce date ale dumneavoastră deținem, să le corectați sau să le ștergeți. Pentru aceasta, scrieți-ne la office.eldoradotur@gmail.com (sau palomnik.moldova@gmail.com) ori sunați la telefonul indicat mai sus. Vom da curs solicitării într-un termen rezonabil, cu excepția cazului în care legea ne obligă să păstrăm anumite informații."
          )}
        </p>

        <h2 className="font-serif text-xl md:text-2xl font-light text-foreground mt-10 mb-4">
          {t("Изменения", "Modificări")}
        </h2>
        <p className="text-foreground/90 leading-relaxed mb-4">
          {t(
            "Мы можем время от времени обновлять эту Политику. Действующая редакция всегда размещена на этой странице.",
            "Putem actualiza periodic prezenta Politică. Redacția în vigoare este întotdeauna publicată pe această pagină."
          )}
        </p>
      </section>
    </PageShell>
  );
}
