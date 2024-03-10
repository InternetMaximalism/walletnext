import { Network, PendingRequest, Session, WalletMetadata, WebmaxWallet } from "@/core/types";
import { storage } from "wxt/storage";
import { DEFAULT_NETWORKS, DEFAULT_WALLETS } from "./constants";

export const webmaxWalletsStorage = storage.defineItem<WebmaxWallet[]>("sync:wallets", {
	defaultValue: DEFAULT_WALLETS,
});

export const walletMetadataStorage = storage.defineItem<WalletMetadata[]>("sync:walletMetadata", {
	defaultValue: [],
});

export const currentWebmaxWalletStorage = storage.defineItem<WebmaxWallet | null>("local:currentWallet", {
	defaultValue: DEFAULT_WALLETS[0] ?? null,
});

export const sessionsStorage = storage.defineItem<Session[]>("local:session", {
	defaultValue: [],
});

export const networksStorage = storage.defineItem<Network[]>("local:networks", {
	defaultValue: DEFAULT_NETWORKS,
});

export const pendingRequestStorage = storage.defineItem<PendingRequest | null>("local:pendingRequests", {
	defaultValue: null,
});

export const openingPopupWindowStorage = storage.defineItem<{
	tabId: number;
} | null>("session:openingPopupWindow", {
	defaultValue: null,
});
