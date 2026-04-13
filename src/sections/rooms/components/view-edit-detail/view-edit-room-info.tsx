"use client";
import React, { useEffect, useState } from "react";

import { Room, RoomRentHistory } from "@/types/room";
import { showToast } from "@/lib/toast";
import { useForm } from "react-hook-form";
import {
  updateRoomInfoSchema,
  UpdateRoomInfoType,
} from "@/schemas/validation/admin.validation";
import DropzoneComponent, {
  ImageItem,
} from "@/components/form/form-elements/DropZone";
import Button from "@/components/ui/button/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBuilding } from "@/context/BuildingContext";
import { useUpdateRoom } from "@/hooks/queries/use-room";
import { FormField } from "@/components/_cms/components/form";
import ComponentCard from "@/components/common/ComponentCard";
import { uploadImage } from "@/supabase/storage/storageClinets";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CMSTableHeader } from "@/components/_cms/components/data-table";
import { formatCurrency } from "@/utils/format-data";
import { useCreateRentHistory } from "@/hooks/queries/use-rent-history";
import { preventDefault } from "@fullcalendar/core/internal";

interface ViewEditRoomInfoProps {
  currentRoom: Room;
  rentHistory: RoomRentHistory[];
}

export default function ViewEditRoomInfo({
  currentRoom,
  rentHistory,
}: ViewEditRoomInfoProps) {
  const { building } = useBuilding();
  const updateRoom = useUpdateRoom();
  const createRentHistory = useCreateRentHistory();
  const [isUploading, setIsUploading] = useState(false);
  const [isViewDetailHistory, setIsViewDetailHistory] = useState(false);
  const [rentPrice, setRenPrice] = useState<number>(rentHistory[0].rent_price);
  const [images, setImages] =
    useState<ImageItem[]>(
      currentRoom.images?.map((item) => {
        return {
          id: crypto.randomUUID(),
          file: new File([], item),
          status: "success",
          uploadedUrl: item,
          previewUrl: item,
        };
      }),
    ) || [];
  const editRoomInfoForm = useForm<UpdateRoomInfoType>({
    resolver: zodResolver(updateRoomInfoSchema),
    defaultValues: {
      id: currentRoom.id,
      code_room: currentRoom.code,
      area: Number(currentRoom.area) || 0,
      furniture_status: currentRoom.furniture_status,
      description: currentRoom.description || "",
      images: currentRoom.images || [],
      current_rent: Number(rentHistory[0].rent_price) || 0,
    },
  });
  useEffect(() => {
    if (images && images.length > 0) {
      setValue(
        "images",
        images
          .filter((img) => img.status === "success")
          .map((img) => img.uploadedUrl!),
      );
    } else {
      return;
    }
  }, [images]);
  const { handleSubmit, setValue } = editRoomInfoForm;

  const handleUploadImages = async (images: ImageItem[]) => {
    setIsUploading(true);

    await Promise.all(
      images
        .filter((img) => img.status === "idle")
        .map(async (img) => {
          setImages((prev) =>
            prev.map((item) =>
              item.id === img.id ? { ...item, status: "uploading" } : item,
            ),
          );

          const { imageUrl, error } = await uploadImage({
            file: img.file,
            bucket: "room_images",
            folder: building?.code,
          });

          setImages((prev) =>
            prev.map((item) =>
              item.id === img.id
                ? {
                    ...item,
                    status: error ? "error" : "success",
                    uploadedUrl: imageUrl,
                  }
                : item,
            ),
          );
        }),
    );

    setIsUploading(false);
  };

  const handleUpdateRentPrice = async (value: number) => {
    try {
      if (Number(value) !== rentPrice) {
        const result = await createRentHistory.mutateAsync({
          roomId: currentRoom.id,
          rent: value,
        });
        if (result.success) {
          showToast.success({ title: "Cập nhật giá phòng thành công" });
        }
      } else return;
    } catch {
      showToast.error({ title: "Cập nhật giá phòng thất bại" });
    }
  };

  const onSubmit = async (data: UpdateRoomInfoType) => {
    const result = await updateRoom.mutateAsync(data);

    if (result.success) {
      showToast.success({ title: "Cập nhật thông tin phòng thành công" });
    } else {
      showToast.error({ title: "Cập nhật thông tin phòng thất bại" });
    }
  };

  return (
    <ComponentCard title="Thông tin phòng" className="">
      <form
        className="space-y-4 grid grid-cols-2 gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormField
          form={editRoomInfoForm}
          field={{
            name: "code_room",
            label: "Mã phòng",
            type: "text",
            placeholder: "Nhập mã phòng",
          }}
        />

        <FormField
          form={editRoomInfoForm}
          field={{
            name: "area",
            label: "Diện tích (m²)",
            type: "number",
            placeholder: "Nhập diện tích",
          }}
        />

        <FormField
          form={editRoomInfoForm}
          field={{
            name: "furniture_status",
            label: "Nội thất",
            type: "select",
            placeholder: "Chọn nội thất",
            defaultValue: currentRoom.furniture_status,
            options: [
              { value: "basic", label: "Cơ bản" },
              { value: "unfurnished", label: "Không có" },
              { value: "furnished", label: "Đầy đủ" },
            ],
          }}
        />

        <FormField
          form={editRoomInfoForm}
          className="col-span-2"
          field={{
            name: "description",
            label: "Mô tả",
            type: "textarea",
            placeholder: "Nhập mô tả",
            rows: 4,
          }}
        />
      </form>

      <div className="re">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateRentPrice(rentPrice);
          }}
        >
          <FormField
            field={{
              name: "current_rent",
              label: "Giá thuê hiện tại",
              type: "number",
              placeholder: "Nhập giá thuê",
              formatCurrency: true,
              value: rentPrice,
              min: 0,
              onChange: (e) => {
                const value = e.target.value;

                setRenPrice(Number(value));
              },
            }}
          />

          <Button type="submit" className="block mt-3 ml-auto">
            Cập nhận giá
          </Button>
        </form>

        <a
          onClick={() => setIsViewDetailHistory(!isViewDetailHistory)}
          className="text-brand-500 text-xs cursor-pointer"
        >
          Xem chi tiết lịch sử cập nhật
        </a>

        {isViewDetailHistory && (
          <div className="bg-white border border-neutral-300 p-4 mt-2 w-full rounded-md">
            <div className="space-y-3">
              <p className="font-medium">Lịch sử cập nhật giá phòng</p>
              <Table className="mt-2">
                <CMSTableHeader
                  className="border border-neutral-300"
                  columns={[
                    { key: "rent_price", title: "Giá thuê" },
                    { key: "effective_from", title: "Ngày bắt đầu" },
                    { key: "effective_to", title: "Ngày kết thúc" },
                  ]}
                />
                <TableBody>
                  {rentHistory.map((item) => (
                    <TableRow
                      className="border border-neutral-300 text-xs"
                      key={item.id}
                    >
                      <TableCell>{formatCurrency(item.rent_price)}</TableCell>
                      <TableCell>{item.effective_from}</TableCell>
                      <TableCell>{item.effective_to || "Hiện tại"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>

      <DropzoneComponent
        className="col-span-2"
        images={images}
        isUploading={isUploading}
        onChange={(images) => {
          setImages(images);
        }}
        onUpload={handleUploadImages}
      />

      <Button
        onClick={handleSubmit(onSubmit)}
        disabled={
          isUploading ||
          images?.filter((img) => img.status === "idle").length > 0
        }
        type="submit"
        className="block w-fit ml-auto"
      >
        {isUploading ? "Đang tải lên..." : "Hoàn tất"}
      </Button>
    </ComponentCard>
  );
}
