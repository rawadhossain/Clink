"use client";

import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";
import { Copy, Check, Link2, ChevronDown, Eye, Pencil } from "lucide-react";

export type SharePermission = "view" | "edit";

interface ShareDialogProps {
	shareLink: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	permission: SharePermission;
	onPermissionChange: (permission: SharePermission) => void;
	isUpdatingPermission?: boolean;
}

const truncateLink = (link: string, startLength = 15, endLength = 12) => {
	if (link.length <= startLength + endLength + 3) return link;
	const start = link.substring(0, startLength);
	const end = link.substring(link.length - endLength);
	return `${start}...${end}`;
};

const PermissionSelectItem = ({
	value,
	children,
}: {
	value: string;
	children: React.ReactNode;
}) => (
	<Select.Item
		value={value}
		className="relative flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-gray-700 data-[highlighted]:bg-gray-100 data-[highlighted]:outline-none cursor-pointer"
	>
		<Select.ItemText>{children}</Select.ItemText>
	</Select.Item>
);

export function ShareDialog({
	shareLink,
	open,
	onOpenChange,
	permission,
	onPermissionChange,
	isUpdatingPermission = false,
}: ShareDialogProps) {
	const [isCopied, setIsCopied] = useState(false);

	useEffect(() => {
		if (!open) setTimeout(() => setIsCopied(false), 200);
	}, [open]);

	const handleCopy = () => {
		navigator.clipboard.writeText(shareLink);
		setIsCopied(true);
		setTimeout(() => setIsCopied(false), 2000);
	};

	const permissionText = permission === "view" ? "View" : "Edit";

	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" />
				<Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl">
					<div className="flex items-center justify-center rounded-xl bg-gradient-to-br from-yellow-200 via-lime-200 to-green-300 p-10">
						<div className="flex items-center space-x-3 rounded-full bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm">
							<div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500 p-1.5">
								<Link2 className="h-4 w-4 text-white" />
							</div>
							<span className="font-mono text-sm text-gray-800">
								{shareLink ? truncateLink(shareLink) : "Generating..."}
							</span>
						</div>
					</div>

					<div className="mt-6 text-center">
						<Dialog.Title className="text-xl font-bold text-gray-900">
							Share your note
						</Dialog.Title>
						<Dialog.Description className="mt-1.5 text-sm text-gray-500">
							Your note, your way. Choose who can access it.
						</Dialog.Description>
					</div>

					<div className="mt-6 grid grid-cols-2 gap-3">
						<button
							onClick={handleCopy}
							disabled={isCopied}
							className={`flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 text-sm font-medium shadow-sm ${
								isCopied
									? "border-green-200 bg-green-50 text-green-700"
									: "hover:bg-gray-100 text-gray-700"
							}`}
						>
							{isCopied ? (
								<Check className="h-4 w-4" />
							) : (
								<Copy className="h-4 w-4" />
							)}
							{isCopied ? "Copied!" : "Copy"}
						</button>

						<Select.Root
							value={permission}
							onValueChange={(val) =>
								!isUpdatingPermission && onPermissionChange(val as SharePermission)
							}
						>
							<Select.Trigger
								disabled={isUpdatingPermission}
								className="flex h-11 w-full items-center justify-between gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100"
							>
								<div className="flex items-center gap-2">
									{permission === "view" ? (
										<Eye className="h-4 w-4" />
									) : (
										<Pencil className="h-4 w-4" />
									)}
									<Select.Value>{permissionText}</Select.Value>
								</div>
								<Select.Icon>
									<ChevronDown className="h-4 w-4 opacity-50" />
								</Select.Icon>
							</Select.Trigger>

							<Select.Portal>
								<Select.Content
									side="bottom"
									sideOffset={5}
									className="z-50 w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
								>
									<Select.Viewport className="p-1.5">
										<PermissionSelectItem value="view">
											<Eye className="h-4 w-4 text-gray-500" />
											<span>View</span>
										</PermissionSelectItem>
										<PermissionSelectItem value="edit">
											<Pencil className="h-4 w-4 text-gray-500" />
											<span>Edit</span>
										</PermissionSelectItem>
									</Select.Viewport>
								</Select.Content>
							</Select.Portal>
						</Select.Root>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
