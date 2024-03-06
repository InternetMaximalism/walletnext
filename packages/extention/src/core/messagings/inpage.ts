import { defineInpageMessaging } from "@/lib/messaging/inpageMessaging";
import { SiteRequest } from "../types";

type InpageMessengerSchema = {
	request: (data: Omit<SiteRequest, "metadata">) => { result?: unknown; error?: { code: number; message: string } };
	onEvent: (data: { event: string; data: unknown }) => void;
};

export const inpageMessaging = defineInpageMessaging<InpageMessengerSchema>("webmax-extension-inpage");