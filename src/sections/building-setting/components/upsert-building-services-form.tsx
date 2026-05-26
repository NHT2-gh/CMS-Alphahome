"use client";
import React, { useEffect, useState } from "react";
import { Pencil, Plus, Trash, X } from "lucide-react";
import { CalculationMethod } from "@/types/bill";
import { useGetServices } from "@/hooks/queries/use-service";
import { FormField } from "@/components/_cms/components/form";
import { useFieldArray, useFormContext } from "react-hook-form";
import { formatCurrency, formatDateTime } from "@/utils/format-data";
import { CMSTableHeader } from "@/components/_cms/components/table";
import { UpdateBuildingSettingType } from "@/schemas/validation/admin.validation";
import { BuildingServiceCreateDTO } from "@/types/utility_reading";
import { randomUUID } from "crypto";
import { DataEmpty } from "@/components/_cms/common/table/state";
import { Button } from "@/components/_cms/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/_cms/ui/table";

export default function UpsertBuildingServicesForm() {
  const formBuildingSetting = useFormContext<UpdateBuildingSettingType>();
  const { data: allServices } = useGetServices();
  const { fields, remove, append } = useFieldArray({
    control: formBuildingSetting.control,
    name: "services",
  });
  const [rowsAdding, setRowsAdding] = useState<
    Record<string, BuildingServiceCreateDTO>
  >({
    [crypto.randomUUID()]: {
      id: "",
      service_id: "",
      service_type: "extra",
      unit_price: 0,
      calculation_method: "per_room",
    },
  });

  const [isEdit, setIsEdit] = useState(false);
  const { resetField } = formBuildingSetting;

  useEffect(() => {
    if (!isEdit) {
      resetField("services");
    }
  }, [isEdit]);

  const handleUpdateAddingRow = (
    id: string,
    field: keyof BuildingServiceCreateDTO,
    value: string | number | CalculationMethod,
  ) => {
    setRowsAdding((prev) => {
      const serviceAddingInfo = prev[id] ?? {
        id: crypto.randomUUID(),
        service_id: "",
        unit_price: 0,
        calculation_method: "per_room",
      };

      const updateValue = { ...serviceAddingInfo, [field]: value };

      return {
        ...prev,
        [id]: updateValue,
      };
    });
  };

  return (
    <>
      <Button
        variant="outline"
        className="absolute top-2 right-2 px-4 py-2.5"
        onClick={() => setIsEdit(!isEdit)}
      >
        {isEdit ? <X className="size-4" /> : <Pencil className="size-4" />}
        {isEdit ? "Hủy" : "Chỉnh sửa"}
      </Button>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <CMSTableHeader
            columns={[
              { key: "name", title: "Tên dịch vụ" },
              { key: "calculation_method", title: "Đơn vị tính" },
              { key: "unit_price", title: "Đơn giá" },
              ...(isEdit
                ? []
                : [
                    { key: "updated_at", title: "Ngày cập nhật" },
                    { key: "updated_by", title: "Người cập nhật" },
                  ]),
            ]}
          />
          <TableBody>
            {isEdit ? (
              <>
                {fields?.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <FormField
                        form={formBuildingSetting}
                        field={{
                          name: `services.${index}.service_id`,
                          type: "select",
                          placeholder: "Chọn dịch vụ",
                          options:
                            allServices
                              ?.filter(
                                (service) =>
                                  service.service_type ===
                                  fields[index].service_type,
                              )
                              ?.map((service) => ({
                                value: String(service.id),
                                label:
                                  service.service_name +
                                  " (" +
                                  (service.unit_name ||
                                    CalculationMethod[
                                      service.calculation_method as unknown as keyof typeof CalculationMethod
                                    ]) +
                                  ")",
                              })) || [],
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        form={formBuildingSetting}
                        disabled={true}
                        field={{
                          name: `services.${index}.calculation_method`,
                          type: "select",
                          readOnly: true,
                          options: [
                            {
                              value: fields[index].unit_name!,
                              label: fields[index].unit_name!,
                            },
                            ...Object.entries(CalculationMethod).map(
                              ([key, value]) => ({
                                value: String(key),
                                label: value,
                              }),
                            ),
                          ],
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        form={formBuildingSetting}
                        field={{
                          name: `services.${index}.unit_price`,
                          type: "number",
                          placeholder: "Nhập đơn giá",
                          min: 0,
                          formatCurrency: true,
                        }}
                      />
                    </TableCell>
                    {fields[index].service_type === "extra" && (
                      <TableCell>
                        <button
                          className="text-error-500"
                          onClick={() => remove(index)}
                        >
                          <Trash className="size-4" />
                        </button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </>
            ) : fields.length === 0 ? (
              <DataEmpty
                message={"Hiện tại không có dịch vụ nào"}
                colSpan={5}
              />
            ) : (
              fields?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.service_name}</TableCell>
                  <TableCell>
                    {item.unit_name
                      ? item.unit_name
                      : CalculationMethod[
                          item.calculation_method as unknown as keyof typeof CalculationMethod
                        ]}
                  </TableCell>
                  <TableCell>{formatCurrency(item.unit_price)}</TableCell>
                  <TableCell>
                    {formatDateTime(item.updated_at, { withTime: true })}
                  </TableCell>
                  <TableCell>{item.updated_by || "//"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {isEdit &&
        Object.entries(rowsAdding).map(([key, addingItem]) => (
          <>
            <div
              key={key}
              className="w-full border-t pt-5 grid grid-cols-2 gap-5 md:grid-cols-[repeat(3,minmax(150px,1fr))]"
            >
              <FormField
                field={{
                  type: "select",
                  placeholder: "Chọn dịch vụ",
                  options:
                    allServices
                      ?.filter((service) => service.service_type === "extra")
                      .map((service) => ({
                        value: String(service.id),
                        label: service.service_name,
                      })) || [],
                  handleOnChange(value) {
                    const service = allServices?.find(
                      (service) => String(service.id) === value,
                    );
                    if (service) {
                      handleUpdateAddingRow(key, "id", crypto.randomUUID());
                      handleUpdateAddingRow(
                        key,
                        "service_id",
                        String(service.id),
                      );
                      handleUpdateAddingRow(
                        key,
                        "calculation_method",
                        service.unit_name || service.calculation_method,
                      );

                      if (service.unit_name) {
                        handleUpdateAddingRow(
                          key,
                          "unit_name",
                          service.unit_name,
                        );
                      }
                    }
                  },
                }}
              />

              <FormField
                field={{
                  readOnly: true,
                  type: "text",
                  placeholder: "Đơn vị tính",
                  value: addingItem.calculation_method.startsWith("other-")
                    ? addingItem.unit_name
                    : CalculationMethod[
                        addingItem.calculation_method as unknown as keyof typeof CalculationMethod
                      ],
                }}
              />

              <FormField
                field={{
                  type: "number",
                  placeholder: "Nhập đơn giá",
                  min: 0,
                  formatCurrency: true,
                  value: rowsAdding[key].unit_price,
                  handleOnChange(value) {
                    handleUpdateAddingRow(key, "unit_price", Number(value));
                  },
                }}
              />
            </div>

            <Button
              variant="primary"
              className="mt-5 w-full md:w-fit"
              onClick={() => {
                append(rowsAdding[key]);

                setRowsAdding((prev) => ({
                  ...prev,
                  [key]: {
                    id: "",
                    service_type: "extra",
                    service_id: "",
                    unit_price: 0,
                    calculation_method: "per_room",
                  },
                }));
              }}
            >
              <Plus className="size-4 text-white" /> Thêm dịch vụ
            </Button>
          </>
        ))}
    </>
  );
}
