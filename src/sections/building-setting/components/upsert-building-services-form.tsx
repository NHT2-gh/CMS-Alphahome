import { CMSTableHeader } from "@/components/_cms/components/data-table";
import { FormField } from "@/components/_cms/components/form";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { UpdateBuildingSettingType } from "@/schemas/validation/admin.validation";
import { CalculationMethod } from "@/types/bill";
import { formatCurrency, formatDateTime } from "@/utils/format-data";
import React from "react";
import { useFormContext, useWatch } from "react-hook-form";

export default function UpsertBuildingServicesForm() {
  const formBuildingSetting = useFormContext<UpdateBuildingSettingType>();
  const services = useWatch({
    name: "services",
    control: formBuildingSetting.control,
  });
  return (
    <Table>
      <CMSTableHeader
        columns={[
          { key: "name", title: "Tên dịch vụ" },
          { key: "calculation_method", title: "Đơn vị tính" },
          { key: "unit_price", title: "Đơn giá" },
          { key: "updated_at", title: "Ngày cập nhật" },
          { key: "updated_by", title: "Người cập nhật" },
        ]}
      />

      <TableBody>
        {services?.map((item) => (
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
        ))}
      </TableBody>
    </Table>
  );
}
