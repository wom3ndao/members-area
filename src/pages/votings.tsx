import useNfts, { Token } from "../hooks/useNfts";
import { constants } from "../constants";

export default function Votings() {
  const { nfts, hasMinted } = useNfts(false);
  if (!hasMinted)
    return (
      <div className="nft-card border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 md:mb-12 md:grid-cols-2">
        <p className="text-lg leading-8 text-gray-600">
          Du bist leider noch kein DAO-Mitglied.
        </p>
      </div>
    );
  return (
    <>
      <div className="nft-card border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 md:mb-12 md:grid-cols-2">
        <p className="text-lg leading-8 text-gray-600">
          Unsere DAO wird über über Smart Contracts auf der Q-Blockchain
          gesteuert. Hier geht&apos;s direkt zum DAO Dashboard! <br /> <br />
          <a href={`https://hq.q-dao.tools/${constants.DAO_ADDRESS}`}>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:mt-0 sm:w-auto"
            >
              Zum Dashboard
            </button>
          </a>
        </p>
      </div>
    </>
  );
}
