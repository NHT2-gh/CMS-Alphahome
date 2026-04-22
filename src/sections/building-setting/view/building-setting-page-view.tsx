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
import { cn } from "@/utils";
import { CheckCircle2 } from "lucide-react";

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
  const [result, setResult] = useState<
    Record<
      string,
      {
        success: boolean;
        message: string;
      }
    >
  >({
    info: { success: false, message: "" },
    services: { success: false, message: "" },
    users: { success: false, message: "" },
  });

  useEffect(() => {
    getBuildingSettingAction(building?.id!).then(({ services, users }) => {
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
    if (dirtyFields.info) {
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
        console.log(error);
        setResult((prev) => ({
          ...prev,
          info: {
            success: false,
            message: "Cập nhật thông tin căn hộ thất bại",
          },
        }));
      }
    }
    if (dirtyFields.services) {
      try {
        const res = await buildingServicesService.upsertBuildingServices(
          building?.id!,
          data.services as UpsertBuildingServiceType[],
        );
        if (res.success) {
          setResult((prev) => ({
            ...prev,
            services: {
              success: true,
              message: "Cập nhật phí dịch vụ thành công",
            },
          }));
        }
      } catch (error) {
        setResult((prev) => ({
          ...prev,
          services: {
            success: false,
            message: "Cập nhật phí dịch vụ thất bại",
          },
        }));
      }
    }
    if (dirtyFields.users) {
      try {
        const res = await buildingService.updateBuildingUsers(
          building?.id!,
          data.users as UpsertUsersBuildingType[],
        );
        if (res.success) {
          setResult((prev) => ({
            ...prev,
            users: {
              success: true,
              message: "Cập nhật danh sách quản lý thành công",
            },
          }));
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

    console.log("DATA", data, dirtyFields);
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
            className={cn(
              "grid grid-cols-2 gap-y-8 gap-x-10 border-green-500",
              {
                "border-green-500": result.info.success,
              },
            )}
          >
            <>
              {result.info.success && (
                <p className="absolute right-4 top-5 text-right text-green-700">
                  <CheckCircle2 className="inline-block mr-2" />
                  {result.info.message}
                </p>
              )}
              <UpdateBuildingInfoForm />
            </>
          </ComponentCard>

          <ComponentCard
            title="Chi tiết phí dịch vụ"
            className={cn({
              "border-green-500": result.services.success,
            })}
          >
            <UpsertBuildingServicesForm />
          </ComponentCard>

          <ComponentCard
            title="Danh sách quản lý"
            className={cn("", {
              "border-green-500": result.users.success,
            })}
          >
            <UpsertUsersBuildingForm />
          </ComponentCard>

          <Button
            type="submit"
            className="block ml-auto mt-5"
            // disabled={!isValid || !isDirty}
          >
            Lưu thay đổi
          </Button>
        </form>
      </FormProvider>
    </MainContainer>
  );
}
