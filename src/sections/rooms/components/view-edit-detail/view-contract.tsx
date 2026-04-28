import React from "react";
import { UserCircle2 } from "lucide-react";
import { Contract } from "@/types/contract";
import Badge from "@/components/ui/badge/Badge";
import { formatDateTime, formatCurrency } from "@/utils/format-data";
import { ComponentCard } from "@/components/_cms/common/component-card";

interface ViewContractProps {
  contract?: Contract;
}

export default function ViewContract({ contract }: ViewContractProps) {
  return (
    <ComponentCard title="Thông tin hợp đồng" className="">
      {contract ? (
        <section className="space-y-3">
          <ul className="grid md:grid-cols-2 gap-3">
            <li className="md:col-span-2">
              <b>Mã hợp đồng:</b> {contract.id.split("-")[0].toUpperCase()}...
            </li>

            <li>
              <b>Ngày bắt đầu hợp đồng:</b>{" "}
              {formatDateTime(contract.start_date, { withTime: false })}
            </li>
            <li>
              <b>Ngày kết thúc hợp đồng:</b>{" "}
              {formatDateTime(contract.end_date, { withTime: false })}
            </li>
            <li>
              <b>Tiền cọc:</b>{" "}
              <span className="text-red-500">
                {formatCurrency(contract.deposit_amount)}
              </span>
            </li>
            <li>
              <b>Trạng thái hợp đồng:</b>{" "}
              <Badge color={contract.status === "active" ? "success" : "error"}>
                <span className="capitalize">{contract.status}</span>
              </Badge>
            </li>
          </ul>

          <div className="space-y-2 pt-3 border-t border-dashed">
            <h3 className="text-lg font-semibold inline-flex gap-2 text-neutral-800">
              <UserCircle2 /> Thông tin người thuê
            </h3>
            <ul className="grid grid-cols-2 gap-3">
              <li className="col-span-2">
                <b>Họ tên người thuê:</b> {contract.tenant_name}
              </li>
              <li>
                <b>Số điện thoại:</b> {contract.tenant_phone}
              </li>
            </ul>
          </div>
        </section>
      ) : (
        <div className="flex flex-col gap-5">
          <i className="">Chưa có hợp đồng</i>
          <a href="" className="text-blue-500 text-sm underline">
            Thêm hợp đồng
          </a>
        </div>
      )}
    </ComponentCard>
  );
}
