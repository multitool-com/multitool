import type { Metadata } from "next";
import ToolLayout from "@/components/ToolLayout";
import GiveawayPickerClient from "./GiveawayPickerClient";

export const metadata: Metadata = {
  title: "Giveaway Picker - Random Winner / Sorteador Instagram | MultiTool",
  description:
    "Free giveaway picker and Instagram raffle tool. Paste or upload a list of usernames and draw random winners. Sorteador aleatório para sorteios do Instagram, 100% no navegador.",
  keywords: [
    "giveaway picker",
    "random name picker",
    "instagram giveaway picker",
    "random winner generator",
    "raffle picker",
    "sorteador",
    "sorteador instagram",
    "sorteio instagram",
    "sorteador de nomes",
    "sorteio aleatório",
    "sorteador de seguidores",
    "sorteio comentários instagram",
  ],
  alternates: {
    canonical: "https://multitoolbox.online/tools/generators/giveaway-picker",
  },
  openGraph: {
    title: "Giveaway Picker / Sorteador Instagram | MultiTool",
    description:
      "Draw random winners from a pasted or uploaded list. Sorteador gratuito para Instagram, no your browser.",
    url: "https://multitoolbox.online/tools/generators/giveaway-picker",
    siteName: "MultiTool",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Giveaway Picker - Sorteador Instagram",
    description:
      "Paste a list and draw random winners. Free Instagram raffle picker.",
  },
};

export default function Page() {
  return (
    <ToolLayout
      title="Giveaway Picker"
      description="Paste or upload a list of names or Instagram usernames and draw one or more random winners. Fair shuffle, duplicates removed, everything stays in your browser."
      categoryName="Generators & Fun"
      categorySlug="generators"
      toolSlug="giveaway-picker"
      howItWorks={
        <>
          <h2 className="font-display text-xl font-semibold mb-3">
            How the giveaway picker works
          </h2>
          <p className="mb-4">
            Put one name or <strong>@username</strong> per line (or upload a
            .txt / .csv). The tool cleans empty lines, extra spaces and
            optional duplicates, then draws winners with a cryptographic
            shuffle (<code className="bg-paper px-1 rounded">crypto.getRandomValues</code>
            ). Nobody can predict the next name.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Instagram raffles
          </h2>
          <p className="mb-4">
            Instagram does not let a website read your followers
            automatically. Export or copy the list yourself (comments on
            the giveaway post are usually fairer than “all followers”).
            Paste it here and draw. We never log into Instagram.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            How to use
          </h2>
          <ol className="list-decimal pl-6 space-y-2 mb-4">
            <li>Paste the list or attach a .txt / .csv file.</li>
            <li>Optionally exclude the host account or past winners.</li>
            <li>Set how many winners you need.</li>
            <li>Click <strong>DRAW</strong> and copy the result.</li>
          </ol>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Sorteador para Instagram (Brasil)
          </h2>
          <p className="mb-4">
            Este é um <strong>sorteador aleatório</strong> para sorteios do
            Instagram, sorteio de comentários ou lista de seguidores. Cole
            os @ dos participantes (um por linha) ou envie um arquivo de
            texto. O sorteio acontece no seu navegador — a lista{" "}
            <strong>não é enviada a nenhum servidor</strong>. Não
            conseguimos puxar seguidores direto do Instagram (a API não
            permite). O caminho correto é copiar a lista de comentários ou
            exportar os nomes e colar aqui.
          </p>
          <p className="mb-4">
            Buscas comuns: sorteador Instagram, sorteio aleatório, sortear
            um ganhador, sorteador de nomes, sorteio de comentários.
          </p>

          <h2 className="font-display text-xl font-semibold mt-6 mb-3">
            Your privacy
          </h2>
          <p>
            The list is read only on your device. It is{" "}
            <strong>never sent to any server</strong> and never stored.
            Safe for follower exports and comment lists.
          </p>
        </>
      }
      faqs={[
        {
          question: "Can this pull my Instagram followers automatically?",
          answer:
            "No. Instagram does not allow a free website to read follower lists. Copy usernames (or the comment list from the giveaway post) and paste them, one per line, or upload a .txt / .csv.",
        },
        {
          question: "Is the draw really random?",
          answer:
            "Yes. Winners are picked with a Fisher–Yates shuffle seeded by the browser's cryptographic random generator, not Math.random(). Every remaining name has the same chance.",
        },
        {
          question: "How do I run a fair Instagram comment giveaway?",
          answer:
            "Export or copy unique commenters, paste them here, turn on Remove duplicates, exclude your own @, then draw. Using comments is usually fairer than all followers, because only people who entered are in the pot.",
        },
        {
          question: "O sorteador funciona com lista de seguidores do Instagram?",
          answer:
            "Sim, se você colar ou anexar a lista. Não puxamos seguidores automaticamente. Um @ por linha. Você pode excluir o próprio perfil e nomes repetidos antes de clicar em DRAW.",
        },
        {
          question: "A lista dos participantes fica salva em algum lugar?",
          answer:
            "Não. Tudo roda no seu navegador. Ao fechar a aba, a lista some. Nada é enviado para a MultiTool, Vercel ou Instagram.",
        },
        {
          question: "Posso sortear mais de um ganhador?",
          answer:
            "Sim. Em Winners, coloque 2, 3, 5… O tool não repete a mesma pessoa no mesmo sorteio. Dá para copiar o resultado e publicar no Stories.",
        },
      ]}
      relatedTools={[
        { name: "Password Generator", href: "/tools/generators/password-generator" },
        { name: "QR Code Generator", href: "/tools/generators/qr-code-generator" },
        { name: "Random Number Generator", href: "/tools/generators/random-number-generator" },
        { name: "Dice Roller", href: "/tools/generators/dice-roller" },
      ]}
    >
      <GiveawayPickerClient />
    </ToolLayout>
  );
}