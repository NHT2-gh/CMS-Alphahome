"use client";
import { MainContainer } from "@/components/_cms/common/page-layout";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  UpdateBuildingSettingType,
  UpsertBuildingServiceType,
  UpsertUsersBuildingType,
  updateBuildingSettingSchema,
} from "@/schemas/validation/admin.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { getBuildingSettingAction } from "@/lib/server-action/building-setting.action";
import { useBuilding } from "@/context/BuildingContext";
import ComponentCard from "@/components/common/ComponentCard";
import {
  UpdateBuildingInfoForm,
  UpsertBuildingServicesForm,
  UpsertUsersBuildingForm,
} from "../components";
import Button from "@/components/ui/button/Button";
import { buildingService } from "@/services/building.service";
import { buildingServicesService } from "@/services/building-services.service";
import { diffArray } from "@/utils/diff-array";
import { mapErrorToMessage } from "@/lib/error/app-error";
import { Alert } from "@/components/_cms/components/alert";

export default function BuildingSettingView() {
  const { building } = useBuilding();
  const updateBuildingSetting = useForm<UpdateBuildingSettingType>({
    resolver: zodResolver(updateBuildingSettingSchema),
    defaultValues: {
      info: {
        code: building?.code! || "",
        address: building?.address! || "",
        price_rent: building?.price_rent! || 0,
        price_deposit: building?.price_deposit! || 0,
        start_date: building?.start_date! || "",
        end_date: building?.end_date! || "",
        is_active: building?.is_active || false,
      },
      services: [],
      users: [],
    },
    mode: "onChange",
  });

  const [initialData, setInitialData] = useState<UpdateBuildingSettingType>({
    info: {
      code: building?.code! || "",
      address: building?.address! || "",
      price_rent: building?.price_rent! || 0,
      price_deposit: building?.price_deposit! || 0,
      start_date: building?.start_date! || "",
      end_date: building?.end_date! || "",
      is_active: building?.is_active || false,
    },
    services: [],
    users: [],
  });

  const [result, setResult] = useState<
    Record<
      string,
      {
        success: boolean;
        message: string;
      }
    >
  >({});

  useEffect(() => {
    getBuildingSettingAction(building?.id!).then(({ services, users }) => {
      setInitialData({
        info: initialData.info,
        services: services || [],
        users: users || [],
      });
      updateBuildingSetting.reset({
        info: {
          code: building?.code! || "",
          address: building?.address! || "",
          price_rent: building?.price_rent! || 0,
          price_deposit: building?.price_deposit! || 0,
          start_date: building?.start_date! || "",
          end_date: building?.end_date! || "",
          is_active: building?.is_active || false,
        },
        services: services || [],
        users: users || [],
      });
    });
  }, [building]);
  const {
    handleSubmit,
    getValues,
    formState: { isValid, isDirty, dirtyFields },
  } = updateBuildingSetting;

  const onSubmit = async (data: UpdateBuildingSettingType) => {
    if (dirtyFields.info && Object.values(dirtyFields.info).some(Boolean)) {
      try {
        const res = await buildingService.updateBuildingInfo(
          building?.id!,
          data.info,
        );
        if (res.success) {
          setResult((prev) => ({
            ...prev,
            info: {
              success: true,
              message: "Cập nhật thông tin căn hộ thành công",
            },
          }));
        }
      } catch (error) {
        setResult((prev) => ({
          ...prev,
          info: {
            success: false,
            message: "Cập nhật thông tin căn hộ thất bại",
          },
        }));
      }
    }
    if (
      dirtyFields.services &&
      dirtyFields.services.length > 0 &&
      initialData.services &&
      initialData.services.length > 0 &&
      data.services &&
      data.services.length > 0
    ) {
      const diffServices = diffArray<UpsertBuildingServiceType>({
        initial: initialData.services,
        current: data.services,
        dirtyFields: dirtyFields.services,
      });

      try {
        if (diffServices.upsert.length > 0) {
          const res = await buildingServicesService.upsertBuildingServices(
            building?.id!,
            diffServices.upsert as UpsertBuildingServiceType[],
          );
          if (res.success) {
            setResult((prev) => ({
              ...prev,
              services: {
                success: true,
                message:
                  (result.services?.message || "") +
                  `\nCập nhật thành công ${diffServices.upsert.length} phí dịch vụ`,
              },
            }));
          }
        }
        if (diffServices.deleted.length > 0) {
          const res = await buildingServicesService.deleteBuildingServices(
            building?.id!,
            diffServices.deleted.map((item) => item.id) as string[],
          );
          if (res.success) {
            setResult((prev) => ({
              ...prev,
              services: {
                success: true,
                message:
                  (result.services?.message || "") +
                  `\nXóa thành công ${diffServices.deleted.length} phí dịch vụ`,
              },
            }));
          }
        }
      } catch (error) {
        setResult((prev) => ({
          ...prev,
          services: {
            success: false,
            message: mapErrorToMessage(error),
          },
        }));
      }
    }
    if (dirtyFields.users) {
      try {
        if (
          initialData.users &&
          initialData.users.length > 0 &&
          data.users &&
          data.users.length > 0
        ) {
          const diffUsers = diffArray<UpsertUsersBuildingType>({
            initial: initialData.users,
            current: data.users,
            dirtyFields: dirtyFields.users,
          });

          if (diffUsers.upsert.length > 0) {
            const res = await buildingService.updateBuildingUsers(
              building?.id!,
              diffUsers.upsert as UpsertUsersBuildingType[],
            );
            if (res.success) {
              setResult((prev) => ({
                ...prev,
                users: {
                  success: true,
                  message:
                    (result.users?.message || "") +
                    `\nCập nhật thành công ${diffUsers.upsert.length} quản lý toà nhà`,
                },
              }));
            }
          }
          if (diffUsers.deleted.length > 0) {
            const res = await buildingService.deleteBuildingUser(
              building?.id!,
              diffUsers.deleted.map((item) => item.id) as string[],
            );
            if (res.success) {
              setResult((prev) => ({
                ...prev,
                users: {
                  success: true,
                  message:
                    (result.users?.message || "") +
                    `\nXóa thành công ${diffUsers.deleted.length} quản lý toà nhà`,
                },
              }));
            }
          }
        }
      } catch (error) {
        setResult((prev) => ({
          ...prev,
          users: {
            success: false,
            message: "Cập nhật danh sách quản lý thất bại",
          },
        }));
      }
    }

    console.log(dirtyFields);
  };

  return (
    <MainContainer title="Thiết lập thông tin căn hộ">
      <FormProvider {...updateBuildingSetting}>
        <form
          className="space-y-5"
          onSubmit={handleSubmit(onSubmit, (err) => {
            console.log("VALIDATION ERROR", err);
          })}
        >
          <ComponentCard
            title="Thông tin toà nhà"
            className="grid grid-cols-2 gap-10"
          >
            <UpdateBuildingInfoForm />
            {result.info && (
              <Alert
                className="col-span-2"
                variant={result.info.success ? "success" : "error"}
                title={result.info.success ? "Thành công" : "Thất bại"}
                message={result.info.message}
              />
            )}
          </ComponentCard>

          <ComponentCard title="Chi tiết phí dịch vụ">
            <UpsertBuildingServicesForm />
            {result.services && (
              <Alert
                className="col-span-2"
                variant={result.services.success ? "success" : "error"}
                title={result.services.success ? "Thành công" : "Thất bại"}
                message={result.services.message}
              />
            )}
          </ComponentCard>

          <ComponentCard title="Danh sách quản lý">
            <UpsertUsersBuildingForm />
            {result.users && (
              <Alert
                className="col-span-2"
                variant={result.users.success ? "success" : "error"}
                title={result.users.success ? "Thành công" : "Thất bại"}
                message={result.users.message}
              />
            )}
          </ComponentCard>

          <Button
            type="submit"
            className="block ml-auto mt-5"
            disabled={!isValid || !isDirty}
          >
            Lưu thay đổi
          </Button>
        </form>
      </FormProvider>
    </MainContainer>
  );
}
