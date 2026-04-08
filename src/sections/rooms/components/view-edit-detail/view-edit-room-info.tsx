"use client";
import React, { useEffect, useState } from "react";

import { Room } from "@/types/room";
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

interface ViewEditRoomInfoProps {
  currentRoom: Room;
}

export default function ViewEditRoomInfo({
  currentRoom,
}: ViewEditRoomInfoProps) {
  const { building } = useBuilding();
  const updateRoom = useUpdateRoom();
  const [isUploading, setIsUploading] = useState(false);
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
