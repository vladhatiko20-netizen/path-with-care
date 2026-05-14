import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { useLang } from "@/lib/i18n";
import heroImg from "@/assets/about-pilgrimage.jpg";

export const Route = createFileRoute("/blog/pochemu-palomnichestvo")({
  head: () => ({
    meta: [
      { title: "Зачем ехать в паломничество, если есть храм рядом с домом? — Паломник" },
      { name: "description", content: "Размышление о смысле паломничества: зачем ехать к святыням, если приходской храм рядом с домом." },
      { name: "author", content: "Паломник" },
      { name: "twitter:title", content: "Паломник — паломнические поездки из Кишинёва" },
      { name: "twitter:description", content: "Паломнические поездки к святыням православного мира из Кишинёва. И вместе ко Христу." },
      { property: "og:title", content: "Зачем ехать в паломничество, если есть храм рядом с домом?" },
      { property: "og:description", content: "Размышление о смысле паломничества." },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: Page,
});

function Page() {
  const { t, lang } = useLang();

  const meta = {
    category: t("Паломничество: смыслы и цели", "Pelerinajul: sensuri și rosturi"),
    date: t("Май 2026", "Mai 2026"),
    back: t("← Все статьи", "← Toate articolele"),
  };

  return (
    <PageShell>
      <article className="max-w-2xl mx-auto px-6 py-14 md:py-20">
        <Link to="/blog" className="text-sm text-accent font-serif italic hover:underline">
          {meta.back}
        </Link>

        <p className="overline mt-8 mb-4">{meta.category}</p>

        {lang === "ru" ? <RU /> : <RO />}

        <p className="text-xs text-muted-foreground font-serif tracking-wider mt-12">
          {meta.date}
        </p>
      </article>
    </PageShell>
  );
}

function H1({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="font-serif text-4xl md:text-5xl text-foreground font-light leading-tight mb-8">
      {children}
    </h1>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-serif text-2xl md:text-[1.7rem] text-foreground font-semibold mt-10 mb-4 leading-snug">
      {children}
    </h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-foreground/85 leading-relaxed mb-5 text-lg">{children}</p>;
}

function Quote({ children }: { children: React.ReactNode }) {
  return (
    <p className="italic text-foreground/85 leading-relaxed mb-5 text-lg">{children}</p>
  );
}

function Lines({ items }: { items: string[] }) {
  return (
    <div className="mb-5 space-y-2">
      {items.map((line, i) => (
        <p key={i} className="text-foreground/85 leading-relaxed text-lg">
          {line}
        </p>
      ))}
    </div>
  );
}

function Sig({ children }: { children: React.ReactNode }) {
  return <p className="italic text-foreground/85 mt-10 text-lg">{children}</p>;
}

function RU() {
  return (
    <>
      <H1>Зачем ехать в паломничество, если есть храм рядом с домом?</H1>

      <P>
        Этот вопрос задают себе многие. И это хороший вопрос, честный, без лукавства.
        Давайте попробуем ответить на него так же честно.
      </P>

      <H2>Храм рядом с домом: это основа</H2>
      <P>
        Начнём с главного: приходской храм не является «запасным вариантом» для тех, кто
        не может поехать в Иерусалим. Это сердце христианской жизни. Здесь совершается
        та же самая Литургия, что и в храме Гроба Господня. Те же Тело и Кровь Христовы.
        Тот же Господь.
      </P>
      <Quote>
        Святитель Иоанн Златоуст писал, что где бы ни совершалась Евхаристия, там
        присутствует Сам Христос. Не больше в Иерусалиме, и не меньше в маленьком
        молдавском приходе.
      </Quote>
      <P>
        Поэтому если кто-то скажет вам, что без паломничества не спастись, это неправда.
        Миллионы святых никуда не ездили и просияли в своём приходе, в своей келье, в
        своей семье.
      </P>

      <H2>Тогда зачем вообще ехать?</H2>
      <P>
        И всё же паломничество существует в Церкви с апостольских времён. Люди шли пешком
        месяцами: в Иерусалим, к мощам мучеников, к великим подвижникам. Не потому что
        дома Бога нет, или мало. А потому, что человек является существом не только
        духовным, но и телесным.
      </P>
      <P>Мы устроены так, что место имеет значение.</P>
      <Lines
        items={[
          "Земля, по которой ходил Христос.",
          "Камень, на котором стояла Богородица.",
          "Мощи святого, у которых веками творятся чудеса…",
        ]}
      />
      <P>
        Это не магия, и не суеверие. Это тайна освящённого места, которую Церковь признаёт
        и хранит.
      </P>
      <P>
        Когда человек стоит у Гроба Господня, что-то происходит внутри. Евангелие, которое
        он читал дома тысячу раз, вдруг становится не книгой, а реальностью: «Это было
        здесь. Это правда!» Многие паломники говорят именно об этом: не об экзотике, не о
        красивых фотографиях, а о том, что вера стала живее.
      </P>

      <H2>Смена места как духовный инструмент</H2>
      <P>
        Привычка является великой силой. И великой опасностью. В привычной обстановке мы
        часто молимся «на автопилоте», исповедуемся «по списку», причащаемся «как обычно».
        Не потому, что мы плохие христиане. Просто так устроен человек.
      </P>
      <P>
        Паломничество выбивает из колеи. В хорошем смысле. Ты вдали от дома, от обычных
        забот, от телефонных звонков. Рядом люди с той же целью. Впереди святыня. И вдруг
        молитва становится другой. Живой!
      </P>
      <P>
        Это не значит что дома молиться невозможно. Это значит что иногда нам нужна
        встряска, чтобы увидеть то, что замылилось от привычки.
      </P>

      <H2>Может ли паломничество навредить</H2>
      <P>Скажем и об этом, потому что это важно.</P>
      <P>
        Паломничество не исцеляет само по себе. Можно объехать все святыни мира и
        вернуться домой тем же человеком, если ехал за впечатлениями, а не за встречей с
        Богом.
      </P>
      <P>
        Опытные священники иногда отговаривают от паломничества. Особенно когда человек
        бежит от проблем: от семейного конфликта, от нерешённых отношений, от внутренней
        боли которую хочется «залечить» святой водой из Иордана. Святая вода конечно же
        поможет. Но сначала нужно примириться с ближним.
      </P>
      <P>
        Есть и другая ловушка. Это «паломнический туризм». Когда за две недели объезжают
        десять стран, фотографируются у мощей и возвращаются духовно пустыми. Это
        усталость, а не паломничество.
      </P>

      <H2>Ехать или не ехать?</H2>
      <P>
        Если вы задаёте себе этот вопрос, значит что-то внутри уже зовёт. Прислушайтесь.
      </P>
      <P>
        Поговорите с вашим священником. Спросите благословения. Если батюшка благословит,
        езжайте с открытым сердцем и без завышенных ожиданий. Но не за чудом, и не за
        красивыми впечатлениями. За встречей.
      </P>
      <P>
        Если у вас есть вопросы о паломничестве, напишите нам. Мы не будем убеждать. Мы
        просто расскажем как это бывает.
      </P>

      <Sig>«Паломник»</Sig>
    </>
  );
}

function RO() {
  return (
    <>
      <H1>De ce să mergi în pelerinaj, dacă ai biserică lângă casă?</H1>

      <P>
        Mulți oameni își pun această întrebare. Și este o întrebare bună, sinceră. Să
        încercăm să răspundem la fel de sincer.
      </P>

      <H2>Biserica de lângă casă este temelia</H2>
      <P>
        Să începem cu ceea ce este cel mai important: biserica parohială nu este o
        „variantă de rezervă” pentru cei care nu pot ajunge la Ierusalim. Ea este inima
        vieții creștine. Aici se săvârșește aceeași Sfântă Liturghie ca și la Sfântul
        Mormânt. Același Trup și același Sânge al lui Hristos. Același Domn.
      </P>
      <Quote>
        Sfântul Ioan Gură de Aur scria că oriunde se săvârșește Euharistia, acolo este
        prezent Însuși Hristos. Nu mai mult la Ierusalim și nu mai puțin într-o mică
        parohie din Moldova.
      </Quote>
      <P>
        De aceea, dacă cineva vă spune că fără pelerinaj nu există mântuire, să știți că
        nu este adevărat. Mulți sfinți nu au plecat nicăieri și au strălucit prin viața
        lor în propria parohie, în propria chilie, în propria familie.
      </P>

      <H2>Atunci de ce merg oamenii în pelerinaj?</H2>
      <P>
        Și totuși, pelerinajul există în Biserică încă din vremurile apostolice. Oamenii
        mergeau luni întregi pe jos la Ierusalim, la moaștele mucenicilor, la marii
        nevoitori. Nu pentru că Dumnezeu nu ar fi acasă. Ci pentru că omul este făcut
        astfel încât locul are importanță.
      </P>
      <Lines
        items={[
          "Pământul pe care a pășit Hristos.",
          "Piatra pe care a stat Maica Domnului.",
          "Moaștele unui sfânt, lângă care de secole se petrec minuni…",
        ]}
      />
      <P>
        Aceasta nu este magie și nici superstiție. Este taina locului sfințit, pe care
        Biserica o păstrează cu grijă.
      </P>
      <P>
        Când omul stă la Sfântul Mormânt, ceva se schimbă înlăuntrul lui. Evanghelia pe
        care a citit-o de atâtea ori acasă devine dintr-odată nu doar o carte, ci o
        realitate: „Aici s-a întâmplat. Este adevărat!” Mulți pelerini vorbesc tocmai
        despre asta: nu despre exotism și nici despre fotografii frumoase, ci despre
        faptul că credința lor a devenit mai vie.
      </P>

      <H2>Schimbarea locului ca ajutor duhovnicesc</H2>
      <P>
        Obișnuința este o mare putere. Dar poate deveni și un pericol. În viața de zi cu
        zi, uneori ne rugăm mecanic, ne spovedim după listă, ne împărtășim „ca de
        obicei”. Nu pentru că am fi creștini răi. Așa este omul.
      </P>
      <P>
        Pelerinajul ajută omul să iasă din cercul obișnuinței. În sens bun. Ești departe
        de casă, de grijile zilnice, de telefoanele care nu contenesc. Lângă tine sunt
        oameni cu aceeași căutare. Înaintea ta este o sfântă țintă. Și rugăciunea devine
        altfel. Mai atentă și mai adevărată!
      </P>
      <P>
        Asta nu înseamnă că acasă nu te poți ruga cu adevărat. Doar că uneori omul are
        nevoie să se oprească puțin și să privească altfel la viața lui.
      </P>

      <H2>Poate pelerinajul să dăuneze?</H2>
      <P>Trebuie spus și acest lucru, pentru că este important.</P>
      <P>
        Pelerinajul nu îl schimbă pe om de la sine. Poți merge la toate sfințeniile lumii
        și să te întorci același, dacă ai plecat doar pentru impresii și nu pentru
        întâlnirea cu Dumnezeu.
      </P>
      <P>
        Uneori, preoții cu experiență chiar îi sfătuiesc pe oameni să nu plece. Mai ales
        când omul încearcă să fugă de probleme: de conflicte în familie, de relații grele,
        de durerea din suflet pe care vrea să o aline prin locuri sfinte sau prin apă din
        Iordan. Apa sfințită ajută, desigur. Dar mai întâi omul trebuie să se împace cu
        aproapele său.
      </P>
      <P>
        Există și o altă capcană: „turismul religios”. Când omul vizitează zece țări în
        două săptămâni, face fotografii la sfințenii și se întoarce obosit și gol pe
        dinăuntru. Aceasta nu mai este pelerinaj, ci o goană după impresii.
      </P>

      <H2>Să merg sau să nu merg?</H2>
      <P>
        Dacă vă puneți această întrebare, poate că ceva dinlăuntrul dumneavoastră deja vă
        cheamă. Ascultați cu atenție.
      </P>
      <P>
        Vorbiți cu preotul dumneavoastră. Cereți binecuvântare. Dacă vă binecuvântează,
        mergeți cu inimă deschisă și fără așteptări prea mari. Nu după minuni și nici
        după emoții frumoase. Ci pentru o întâlnire.
      </P>
      <P>
        Dacă aveți întrebări despre pelerinaj, scrieți-ne. Nu vom încerca să vă convingem.
        Vom spune doar cum este, de fapt.
      </P>

      <Sig>„Pelerinul”</Sig>
    </>
  );
}