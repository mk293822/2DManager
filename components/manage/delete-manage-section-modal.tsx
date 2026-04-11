import { EVENT_NAMES } from "@/event-names";
import { MutationResult } from "@/hooks/use-mutation";
import { eventBus } from "@/lib/event-bus";
import { changeSectionName } from "@/lib/helpers";
import { SectionName } from "@/types/manage-types";
import React from "react";
import ConfirmDeleteModal from "../ui/confirm-delete-modal";

type DeleteManageSectionModalProps = {
	open: boolean;
	onClose: () => void;
	deleteSection: (variables: {
		id: string;
		date: string;
	}) => Promise<MutationResult<void, string>>;
	sectionName: SectionName;
	section_id: string;
	date: string;
	deletingSection: boolean;
};

const DeleteManageSectionModal = ({
	open,
	onClose,
	deleteSection,
	sectionName,
	section_id,
	date,
	deletingSection,
}: DeleteManageSectionModalProps) => {
	return (
		<ConfirmDeleteModal
			open={open}
			onClose={onClose}
			loading={deletingSection}
			onConfirm={async () => {
				const res = await deleteSection({ id: section_id, date });

				if (res.error) {
					eventBus.emit(EVENT_NAMES.NOTIFICATION, {
						type: "error",
						title: "Error",
						description: res.error,
					});
					return;
				}

				onClose();
			}}
			title={`Delete ${changeSectionName(sectionName)} Section?`}
			description={`This action cannot be undone. Are you sure you want to permanently delete ${changeSectionName(sectionName)} Section?`}
		/>
	);
};

export default DeleteManageSectionModal;
