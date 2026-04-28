"use client";
import { FormField } from "@/components/_cms/components/form";
import { Switch } from "@/components/_cms/ui/switch";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useBuilding } from "@/context/BuildingContext";
import {
  useCreateMultipleRoomMonthlyBills,
  useCreateSingleRoomMonthlyBill,
} from "@/hooks/queries/use-bill";
import { useContract } from "@/hooks/queries/use-contract";
import useAllRooms from "@/hooks/queries/use-room";
import { useModal } from "@/hooks/useModal";
import {
  createInvoiceFormSchema,
  CreateInvoiceFormType,
} from "@/schemas/validation/admin.validation";
import {
  CreateMonthlyBillsResponse,
  CreateSingleMonthlyBillResponse,
} from "@/types/bill";
import { Contract } from "@/types/contract";
import { generateBillCode } from "@/utils/random-bill-code";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCheck,
  Loader2,
  PlusIcon,
  Receipt,
  Save,
  UserCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { BillPreviewModal, ModalShowRes } from "./sub components/modal-bill";
import { showToast } from "@/lib/toast";
import { mapErrorToMessage } from "@/lib/error/app-error";

export default function ModalCreateBill() {
  const createModal = useModal();
  const resultModal = useModal();
  const { building } = useBuilding();
  const { data: rooms, isFetched: isFetchedRooms } = useAllRooms(building?.id);
  const [isMutiRoom, setIsMutiRoom] = useState(false);
  const [currentContract, setCurrentContract] = useState<Contract | undefined>(
    undefined,
  );
  const [log, setLog] = useState<
    CreateSingleMonthlyBillResponse | CreateMonthlyBillsResponse[] | null
  >(null);
  const form = useForm<CreateInvoiceFormType>({
    resolver: zodResolver(createInvoiceFormSchema),
    defaultValues: {},
  });
  const roomCode = useWatch({
    control: form.control,
    name: "room_selected",
  });

  const { data: contract, isFetching: isFetchingContract } = useContract(
    roomCode as string,
    {
      enabled: !isMutiRoom && !!roomCode,
    },
  );
  const createMultipleBills = useCreateMultipleRoomMonthlyBills();
  const createSingleBill = useCreateSingleRoomMonthlyBill();
  useEffect(() => {
    if (!building) {
      return;
    }

    if (contract) {
      setCurrentContract(contract);
    }
  }, [contract]);

  const {
    handleSubmit,
    formState: { isLoading, isSubmitting, isSubmitted },
  } = form;

  const onSubmit = async (data: CreateInvoiceFormType) => {
    try {
      if (isMutiRoom && Array.isArray(data.room_selected)) {
        const res = await createMultipleBills.mutateAsync({
          month_date: data.month_date,
          room_ids: data.room_selected,
          building_id: building?.id as string,
        });
        setLog(res.results);

        console.log(res.results);
        resultModal.openModal();
      } else {
        const res = await createSingleBill.mutateAsync({
          month_date: data.month_date,
          room_id: data.room_selected as string,
          building_id: building?.id as string,
        });
        setLog(res);
      }
    } catch (error) {
      showToast.error({
        title: "Lỗi tạo phiếu",
        description: mapErrorToMessage(error),
      });
    }
  };

  return (
    <>
      <Button onClick={createModal.openModal} variant="primary">
        <PlusIcon className="size-4" />
        Tạo hóa đơn
      </Button>

      <Modal
        isOpen={createModal.isOpen}
        onClose={createModal.closeModal}
        className=""
      >
        <h2 className="text-2xl font-bold mb-5">Tạo phiếu thu</h2>
        <div className="">
          <div className="rounded-2xl border border-gray-200 bg-white  dark:border-gray-800 dark:bg-white/3">
            <div className="p-4 md:p-6 space-y-4">
              <h4 className="flex items-center gap-3 font-semibold">
                <Receipt /> Thông tin hoá đơn
              </h4>

              <form
                className="grid grid-cols-1 gap-5 md:grid-cols-2"
                onSubmit={handleSubmit(onSubmit)}
              >
                <FormField
                  form={form}
                  field={{
                    name: "room_selected",
                    label: "Mã phòng",
                    type: isMutiRoom ? "multiselect" : "select",
                    placeholder: "Chọn mã phòng",
                    options: [
                      ...(rooms?.map((item) => ({
                        label: item.code,
                        value: item.room_id,
                      })) || []),
                    ],
                  }}
                />

                <FormField
                  form={form}
                  field={{
                    id: "month_date",
                    name: "month_date",
                    label: "Kì thanh toán",
                    type: "date",
                    mode: "single",
                  }}
                />
              </form>

              <Switch
                label="Tạo phiếu thu cho nhiều phòng"
                defaultValue={false}
                onChange={(checked) => setIsMutiRoom(checked)}
              />
            </div>

            {!isMutiRoom && (
              <div className="border-t border-gray-200 p-6 dark:border-gray-800">
                {contract && isFetchedRooms ? (
                  <div className="pb-5 space-y-4">
                    <h4 className="flex items-center gap-3">
                      <UserCircle /> Thông tin khách hàng
                    </h4>

                    {isFetchingContract ? (
                      <div className="flex items-center gap-10 justify-center">
                        <Loader2 className="size-4 animate-spin" /> Loading...
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-5">
                        <FormField
                          className="pointer-events-none"
                          field={{
                            label: "Tên khách hàng",
                            type: "text",
                            value: contract.tenant_name,
                            readOnly: true,
                          }}
                        />
                        <FormField
                          className="pointer-events-none"
                          field={{
                            label: "Số điện thoại",
                            type: "text",
                            value: contract.tenant_phone,
                            readOnly: true,
                          }}
                        />
                        <FormField
                          className="pointer-events-none"
                          field={{
                            label: "Số lượng người ở",
                            type: "text",
                            value: contract.occupants_count,
                            readOnly: true,
                          }}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <i className="text-red-500">
                    Không thể tạo bill cho phòng chưa có hợp đồng thuê
                  </i>
                )}
              </div>
            )}

            <Button
              onClick={handleSubmit(onSubmit)}
              type="submit"
              variant="primary"
              className="mt-4 float-end"
              disabled={(!contract && !isMutiRoom) || !roomCode}
            >
              {isLoading || isSubmitting ? <></> : <Save />}
              {isLoading || isSubmitting ? "Đang xử lý..." : "Tạo phiếu thu"}
            </Button>

            {log &&
              (!isMutiRoom ? (
                "bill" in log ? (
                  <BillPreviewModal
                    bill={log.bill}
                    infoCustomer={currentContract as Contract}
                  />
                ) : (
                  <ModalShowRes
                    title="Đã tạo phiếu"
                    isOpen={resultModal.isOpen}
                    closeModal={resultModal.closeModal}
                  >
                    <div className=""></div>
                  </ModalShowRes>
                )
              ) : (
                Array.isArray(log) && (
                  <ModalShowRes
                    title="Đã tạo phiếu"
                    isOpen={resultModal.isOpen}
                    closeModal={resultModal.closeModal}
                  >
                    <div className="">
                      <h4>
                        Thành công{" "}
                        {log
                          .filter((item) => item.status === "success")
                          .map((item) => (
                            <p key={item.room_id}>{item.room_id}</p>
                          ))}
                      </h4>
                      <h4>
                        Thất bại{" "}
                        {log
                          .filter((item) => item.status === "error")
                          .map((item) => (
                            <p key={item.room_id}>{item.room_id}</p>
                          ))}
                      </h4>
                      <h4>
                        Đã tồn tại{" "}
                        {log
                          .filter((item) => item.status === "already_exists")
                          .map((item) => (
                            <p key={item.room_id}>{item.room_id}</p>
                          ))}
                      </h4>
                    </div>
                  </ModalShowRes>
                )
              ))}
          </div>
        </div>
      </Modal>
    </>
  );
}
