"use client";
import React from "react";
import { Modal } from "@/components/_cms/ui/modal/modal";
import { Button } from "@/components/_cms/ui/button";
import { PlusIcon } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import EditViewReading from "./edit-view-utility-reading";

export default function ModalCreateReading() {
  const { openModal, isOpen, closeModal } = useModal();

  return (
    <>
      <Button onClick={openModal} className="mb-6 ml-auto" variant="primary">
        <PlusIcon className="size-4" strokeWidth={2} /> Thêm bản ghi
      </Button>
      <Modal isOpen={isOpen} onClose={closeModal}>
        <EditViewReading />
      </Modal>
    </>
  );
}
