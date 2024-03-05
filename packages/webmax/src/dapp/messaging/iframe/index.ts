import { AbstractRequest, AbstractResponse } from "src";
import invariant from "../../../utils/invariant";
import { withResolvers } from "../../../utils/withResolvers";
import { WebmaxDappClientOptions } from "../../dappClient";
import { RpcProviderError } from "../../errors";
import { WalletClientRef } from "../types";
import Component from "./Component.svelte";

// biome-ignore lint/suspicious/noExplicitAny:
const openIframe = async (opt: WebmaxDappClientOptions<any, any>) => {
	const { promise, resolve } = withResolvers<HTMLIFrameElement>();

	const component = new Component({
		target: document.getElementById("walletnext_popup") || document.body,
		props: {
			show: true,
			iframeName: opt.wallet.name,
			iframeSrc: opt.wallet.url,
			handleIframeRef: resolve,
			handleClose: () => {},
		},
	});

	const iframeRef = await promise;

	return { iframeRef, component };
};

const waitForClose = (ref: WalletClientRef) => {
	return new Promise<void>((resolve) => {
		ref.iframe?.component.$set({ handleClose: resolve });
	});
};

// biome-ignore lint/suspicious/noExplicitAny:
const _callRequest = async (ref: WalletClientRef, opt: WebmaxDappClientOptions<any, any>, message: AbstractRequest) => {
	invariant(ref.iframe?.iframeRef.contentWindow);
	const walletWindow = ref.iframe?.iframeRef.contentWindow;
	const { promise, resolve } = withResolvers<AbstractResponse>();

	let sensed = false;
	const sendMessageOnce = () => {
		if (sensed) return;
		sensed = true;
		walletWindow?.postMessage({ ...message, id: ref.id }, new URL(opt.wallet.url).origin);
	};

	ref.handshake && sendMessageOnce();
	const listener = (event: MessageEvent) => {
		if (event.source !== walletWindow) return;
		if (event.data.method === "webmax_ready") {
			ref.handshake = event.data.result;
			sendMessageOnce();
		}
		if (event.data.id === message.id) {
			resolve(event.data);
			window.removeEventListener("message", listener);
		}
	};

	window.addEventListener("message", listener);

	const windowClosed = waitForClose(ref).then(() => ({
		...{ id: message.id, method: message.method, namespace: message.namespace },
		windowHandling: "close" as const,
		error: { code: -32000, message: "Window closed" },
	}));

	return Promise.race([promise, windowClosed]);
};

export const callRequest = async (
	ref: WalletClientRef,
	// biome-ignore lint/suspicious/noExplicitAny:
	opt: WebmaxDappClientOptions<any, any>,
	message: Omit<AbstractRequest, "id">,
) => {
	const { promise, resolve } = withResolvers<void>();
	const waiting = Promise.allSettled(ref.calls || []);

	ref.id = ref.id ? ref.id + 1 : 1;
	ref.calls = [...(ref.calls || []), promise];

	await waiting;

	if (!ref.iframe) ref.iframe = await openIframe(opt);
	ref.iframe.component.$set({ show: true });

	const _message = { ...message, id: ref.id };
	const result = await _callRequest(ref, opt, _message);

	ref.calls = ref.calls?.filter((p) => p !== promise);
	if (result?.windowHandling === "close") ref.iframe.component.$set({ show: false });

	resolve();

	return result;
};
