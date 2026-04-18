"use client";
import { MainContainer } from "@/components/_cms/common/page-layout";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  UpdateBuildingSettingType,
  updateBuildingSettingSchema,
} from "@/schemas/validation/admin.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { getBuildingSettingAction } from "@/lib/server-action/building-setting.action";
import { useBuilding } from "@/context/BuildingContext";
import ComponentCard from "@/components/common/ComponentCard";
import {
  UpdateBuildingInfoForm,
  UpsertBuildingServicesForm,
} from "../components";

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
        is_active: true,
      },
      services: [],
      users: [],
    },
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
          is_active: true,
        },
        services: services || [],
        users: users || [],
      });
    });
  }, [building]);
  return (
    <MainContainer title="Thiết lập thông tin căn hộ">
      <FormProvider {...updateBuildingSetting}>
        <ComponentCard
          title="Thông tin toà nhà"
          className="grid grid-cols-2 gap-y-5 gap-x-10"
        >
          <UpdateBuildingInfoForm />
        </ComponentCard>

        <ComponentCard title="Chi tiết phí dịch vụ">
          <UpsertBuildingServicesForm />
        </ComponentCard>
      </FormProvider>
    </MainContainer>
  );
}
