import Mint from "../components/Mint";
import useNfts from "@/hooks/useNfts";
import { useAccount } from "wagmi";
import Link from "next/link";

export default function Home() {
  const { hasMinted } = useNfts(false);
  const { address, isConnected } = useAccount();

  return (
    <div className="relative px-6 py-12 sm:py-20 lg:px-8 lg:py-24 lg:pr-0">
      <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
        <div className="hidden sm:mb-10 sm:flex">
          {!address && (
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-500 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              Bitte verbinde zuerst deine Wallet (oben rechts), damit wir prüfen
              können, ob du bereits Member bist.
            </div>
          )}
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Willkommen in der <em>wom3n.DAO</em> Members Area
        </h1>
        {hasMinted ? (
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Glückwunsch! Du bist bereits Member und kannst unsere Membership
            Area erkunden.
          </p>
        ) : (
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Falls du bereits unseren Application-Process durchschritten hast,
            kannst du jetzt deinen Membership NFT minten.
          </p>
        )}
        <div className="mt-10 flex items-center gap-x-6">
          {!hasMinted && <Mint />}
          {hasMinted && (
            <Link
              href="/votings"
              className="rounded-md border border-black bg-white-600 px-3.5 py-2.5 text-sm font-semibold text-black shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Zum Voting
            </Link>
          )}
          {/* <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
            Learn more <span aria-hidden="true">→</span>
          </a> */}
        </div>
      </div>
    </div>
  );

  // return (
  //   <>
  //     <Head>
  //       <title>Create Next App</title>
  //       <meta name="description" content="Generated by create next app" />
  //       <meta name="viewport" content="width=device-width, initial-scale=1" />
  //       <link rel="icon" href="/favicon.ico" />
  //     </Head>
  //     <main className={styles.main}>
  //       <div style={{ margin: "6rem", maxWidth: "80%" }}>
  //         {/* <div className="text-center">
  //           <h1 className="text-4xl font-bold tracking-tight text-black sm:text-6xl">
  //             unsere NFT Membership
  //           </h1>
  //           <p className="mt-6 text-lg leading-8 text-black">
  //             Das wom3n.NFT ist auf 50 NFTs limitiert. Wenn deine Wallet auf
  //             unserer Allowlist steht, kannst du hier dein persönliches NFT
  //             minten.
  //           </p>
  //         </div> */}
  //         {address && isConnected && hasMinted && (
  //           <div className="text-center">
  //             <ViewNFT />
  //           </div>
  //         )}
  //         <div className={styles.center}>
  //           <Mint />
  //         </div>
  //       </div>
  //     </main>
  //   </>
  // );
}
