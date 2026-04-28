import React, { use, useEffect, useState } from "react";

import { Pencil, Plus, RefreshCcw, Trash, X } from "lucide-react";
import { CalculationMethod, Service } from "@/types/bill";
import Button from "@/components/ui/button/Button";
import { useGetServices } from "@/hooks/queries/use-service";
import { FormField } from "@/components/_cms/components/form";
import { useFieldArray, useFormContext } from "react-hook-form";
import { formatCurrency, formatDateTime } from "@/utils/format-data";
import { CMSTableHeader } from "@/components/_cms/components/data-table";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { UpdateBuildingSettingType } from "@/schemas/validation/admin.validation";
import {
  BuildingService,
  BuildingServiceCreateDTO,
} from "@/types/utility_reading";
import { randomUUID, UUID } from "crypto";

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
                        placeholder: "Chọn đơn vị tính",
                        options: [
                          ...Object.entries(CalculationMethod).map(
                            ([key, value]) => ({
                              value: String(key),
                              label: value,
                            }),
                          ),
                          {
                            value: "other-" + String(fields[index].service_id!),
                            label: fields[index].unit_name!,
                          },
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

              {Object.entries(rowsAdding).map(([key, addingItem]) => (
                <TableRow key={key}>
                  <TableCell>
                    <FormField
                      field={{
                        type: "select",
                        placeholder: "Chọn dịch vụ",
                        options:
                          allServices
                            ?.filter(
                              (service) => service.service_type === "extra",
                            )
                            .map((service) => ({
                              value: String(service.id),
                              label: service.service_name,
                            })) || [],
                        handleOnChange(value) {
                          const service = allServices?.find(
                            (service) => String(service.id) === value,
                          );
                          if (service) {
                            handleUpdateAddingRow(key, "id", randomUUID());
                            handleUpdateAddingRow(
                              key,
                              "service_id",
                              String(service.id),
                            );
                            handleUpdateAddingRow(
                              key,
                              "calculation_method",
                              service.unit_name
                                ? "other-" + service.id
                                : service.calculation_method,
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
                  </TableCell>
                  <TableCell>
                    <FormField
                      field={{
                        readOnly: true,
                        type: "text",
                        placeholder: "Đơn vị tính",
                        value: addingItem.calculation_method.startsWith(
                          "other-",
                        )
                          ? addingItem.unit_name
                          : CalculationMethod[
                              addingItem.calculation_method as unknown as keyof typeof CalculationMethod
                            ],
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <FormField
                      field={{
                        type: "number",
                        placeholder: "Nhập đơn giá",
                        min: 0,
                        formatCurrency: true,
                        value: rowsAdding[key].unit_price,
                        onChange(e: React.ChangeEvent<HTMLInputElement>) {
                          handleUpdateAddingRow(
                            key,
                            "unit_price",
                            Number(e.target.value),
                          );
                        },
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <Button
                      className="bg-brand-500 p-2"
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
                      <Plus className="size-4 text-white" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </>
          ) : (
            fields?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.service_name}</TableCell>
                <TableCell>
                  {
                    CalculationMethod[
                      item.calculation_method as unknown as keyof typeof CalculationMethod
                    ]
                  }
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
    </>
  );
}
