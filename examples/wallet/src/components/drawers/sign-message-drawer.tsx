import { Button } from "@/components/ui/button";
import { createViemWalletClient } from "@/lib/viemClient";
import { DrawerProps } from "@/stores/drawers";
import { FC } from "react";
import { isHex } from "viem";
import { mainnet } from "viem/chains";
import { DrawerFooter, DrawerHeader, DrawerTitle } from "../ui/drawer";

const SignMessageDrawer: FC<DrawerProps<"sign-message">> = ({ account, data, onSign, onCancel, onOpenChange }) => {
	const handleCancel = () => {
		onOpenChange?.(false);
		onCancel?.();
	};

	const handleSignMessage = async () => {
		const client = createViemWalletClient(mainnet, account);
		const signature = await client.signMessage({ message: isHex(data) ? { raw: data } : data });
		onSign?.(signature);
		onOpenChange?.(false);
	};

	return (
		<>
			<DrawerHeader>
				<DrawerTitle>Sign Message</DrawerTitle>
			</DrawerHeader>
			<div>
				<pre>{data}</pre>
			</div>
			<DrawerFooter className="grid grid-cols-2">
				<Button variant="outline" onClick={handleCancel}>
					Cancel
				</Button>
				<Button onClick={handleSignMessage}>Sign</Button>
			</DrawerFooter>
		</>
	);
};

export default SignMessageDrawer;