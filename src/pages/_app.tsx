import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  Chain,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, goerli, WagmiConfig } from "wagmi";
import { qBlockchainTest } from "../qBlockchain";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import Layout from "@/components/Layout";
import { Router } from "next/router";

const { chains, provider, webSocketProvider } = configureChains(
  [qBlockchainTest as unknown as Chain, goerli],
  [
    jsonRpcProvider({
      rpc: (chain: Chain) => ({ http: chain.rpcUrls.default.http[0] }),
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Wom3n.DAO NFT Minting",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Layout
          Component={Component}
          pageProps={pageProps}
          router={router as Router}
        />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
