import { Blockchain } from "@ankr.com/ankr.js";
import {
	Chain,
	arbitrum,
	arbitrumSepolia,
	avalanche,
	avalancheFuji,
	base,
	bsc,
	fantom,
	flare,
	gnosis,
	linea,
	mainnet,
	optimism,
	optimismGoerli,
	polygon,
	polygonZkEvm,
	rollux,
	scroll,
	syscoin,
} from "viem/chains";
import { bscTestnet, goerli, optimismSepolia, polygonMumbai, scrollSepolia, sepolia } from "viem/chains";
import invariant from "./lib/invariant";
import { InternalRpcUrl } from "./types";

export const ANKR_API_KEY =
	import.meta.env.VITE_ANKR_API_KEY ?? "98e9658e77cb8fbb473c21f0129d90c08531fa006a2f82b9b81bf294041ef99b";
invariant(ANKR_API_KEY, "ANKR_API_KEY is required");

export const ANKR_BALANCE_CHAIN_MAP = {
	[arbitrum.id]: "arbitrum",
	[avalanche.id]: "avalanche",
	[avalancheFuji.id]: "avalanche_fuji",
	[base.id]: "base",
	[bsc.id]: "bsc",
	[mainnet.id]: "eth",
	[goerli.id]: "eth_goerli",
	[fantom.id]: "fantom",
	[flare.id]: "flare",
	[gnosis.id]: "gnosis",
	[linea.id]: "linea",
	[optimism.id]: "optimism",
	[optimismGoerli.id]: "optimism_testnet",
	[polygon.id]: "polygon",
	[polygonMumbai.id]: "polygon_mumbai",
	[polygonZkEvm.id]: "polygon_zkevm",
	[rollux.id]: "rollux",
	[scroll.id]: "scroll",
	[syscoin.id]: "syscoin",
} satisfies Record<number, Blockchain>;

export type AnkrBalanceChain = keyof typeof ANKR_BALANCE_CHAIN_MAP;

export const getAnkrBalanceID = (chian: Chain) => {
	const id = ANKR_BALANCE_CHAIN_MAP[chian.id as AnkrBalanceChain];
	return id ?? null;
};

//TODO: Add the rest of the chains
export const ANKR_RPC_CHAIN_MAP = {
	...ANKR_BALANCE_CHAIN_MAP,
	[sepolia.id]: "eth_sepolia",
	[optimismSepolia.id]: "optimism_sepolia",
	[arbitrumSepolia.id]: "arbitrum_sepolia",
	[scrollSepolia.id]: "scroll_sepolia",
	[bscTestnet.id]: "bsc_testnet_chapel",
};

export const getAnkrRpcUrl = (chain: Chain): InternalRpcUrl => {
	const ankrChainId = ANKR_RPC_CHAIN_MAP[chain.id as keyof typeof ANKR_RPC_CHAIN_MAP];
	if (!ankrChainId) return { url: chain.rpcUrls.default.http[0] };
	const ankrRpc = `https://rpc.ankr.com/${ankrChainId}/${ANKR_API_KEY}`;
	return { url: ankrRpc };
};
