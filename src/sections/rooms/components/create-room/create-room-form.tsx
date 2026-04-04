"use client";
import React, { useEffect, useState } from "react";
import {
  createRoomFormSchema,
  CreateRoomFormType,
} from "@/schemas/validation/admin.validation";
import DropzoneComponent, {
  ImageItem,
} from "@/components/form/form-elements/DropZone";
import Button from "@/components/ui/button/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useBuilding } from "@/context/BuildingContext";
import { FormField } from "@/components/_cms/components/form";
import { uploadImage } from "@/supabase/storage/storageClinets";
import { useCreateRoom } from "@/hooks/queries/use-room";
import { showToast } from "@/lib/toast";
import ComponentCard from "@/components/common/ComponentCard";

export default function CreateRoomForm() {
  const { building } = useBuilding();
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const createRoomMutation = useCreateRoom();
  const createRoomForm = useForm<CreateRoomFormType>({
    resolver: zodResolver(createRoomFormSchema),
    defaultValues: {
      building_id: building?.id || "",
      code_room: "",
      area: 0,
      current_rent: 0,
      furniture_status: "",
      description: "",
      images: [],
    },
  });

  useEffect(() => {
    if (!building) {
      return;
    }
  }, [building]);

  useEffect(() => {
    setValue(
      "images",
      images
        .filter((img) => img.status === "success")
        .map((img) => img.uploadedUrl!),
    );
  }, [images]);

  const { handleSubmit, setValue } = createRoomForm;

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

  const onSubmit = async (data: CreateRoomFormType) => {
    try {
      const res = await createRoomMutation.mutateAsync(data);
      if (res.room) {
        showToast.success({
          title: "Thành công tạo phòng",
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        showToast.error({
          title: "Thất bại",
          description: error.message,
        });
      }
    }
  };
  return (
    <>
      <ComponentCard title="Thông tin phòng" className="">
        <form
          className="space-y-4 grid grid-cols-2 gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormField
            form={createRoomForm}
            field={{
              name: "code_room",
              label: "Mã phòng",
              type: "text",
              placeholder: "Nhập mã phòng",
            }}
          />
          <FormField
            form={createRoomForm}
            field={{
              name: "area",
              label: "Diện tích (m²)",
              type: "number",
              placeholder: "Nhập diện tích",
            }}
          />
          <FormField
            form={createRoomForm}
            field={{
              name: "current_rent",
              label: "Giá thuê (VND)",
              type: "number",
              placeholder: "Nhập giá thuê",
              min: 0,
            }}
          />
          <FormField
            form={createRoomForm}
            field={{
              name: "furniture_status",
              label: "Nội thất",
              type: "select",
              placeholder: "Chọn nội thất",
              options: [
                { value: "basic", label: "Cơ bản" },
                { value: "unfurnished", label: "Không có" },
                { value: "furnished", label: "Đầy đủ" },
              ],
            }}
          />
          <FormField
            form={createRoomForm}
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
      </ComponentCard>

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
          images.filter((img) => img.status === "idle").length > 0
        }
        type="submit"
        className="block w-fit ml-auto"
      >
        {isUploading ? "Đang tải lên..." : "Hoàn tất"}
      </Button>
    </>
  );
}
