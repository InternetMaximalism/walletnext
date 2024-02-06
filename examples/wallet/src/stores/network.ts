import { Chain } from "viem";
import { arbitrum, astar, bsc, mainnet, optimism, polygon, scroll } from "viem/chains";
import { arbitrumGoerli, bscTestnet, goerli, polygonMumbai, scrollSepolia, sepolia } from "viem/chains";
import { create } from "zustand";

const DEFAULT_MAINNETS = [mainnet, optimism, polygon, arbitrum, astar, scroll, bsc];
const DEFAULT_TESTNETS = [goerli, sepolia, bscTestnet, arbitrumGoerli, scrollSepolia, bscTestnet, polygonMumbai];

export type NetworksStore = {
	networks: Chain[];
	setNetworks: (cbOrNetworks: Chain[] | ((networks: Chain[]) => Chain[])) => void;
	reset: () => void;
};

const initialState = {
	networks: [...DEFAULT_MAINNETS, ...DEFAULT_TESTNETS],
};

export const useNetworksStore = create<NetworksStore>((set) => ({
	...initialState,
	setNetworks: (cbOrNetworks) =>
		set((state) => ({ networks: typeof cbOrNetworks === "function" ? cbOrNetworks(state.networks) : cbOrNetworks })),
	reset: () => set(initialState),
}));
