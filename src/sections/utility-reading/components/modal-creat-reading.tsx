"use client";
import React from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
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
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[80%] p-5 lg:p-10"
      >
        <EditViewReading />
      </Modal>
    </>
  );
}
