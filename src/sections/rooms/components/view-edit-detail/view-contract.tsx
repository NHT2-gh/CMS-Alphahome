import ComponentCard from "@/components/common/ComponentCard";
import Badge from "@/components/ui/badge/Badge";
import { Contract } from "@/types/contract";
import { formatDateTime, formatPrice } from "@/utils/format-data";
import { UserCircle2, UserIcon } from "lucide-react";
import React from "react";

interface ViewContractProps {
  contract?: Contract;
}

export default function ViewContract({ contract }: ViewContractProps) {
  return (
    <ComponentCard title="Thông tin hợp đồng" className="">
      {contract ? (
        <section className="space-y-3">
          <ul className="grid grid-cols-2 gap-3">
            <li className="col-span-2">
              <b>Mã hợp đồng:</b> {contract.id.split("-")[0].toUpperCase()}
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
                {formatPrice(contract.deposit_amount)}
              </span>
            </li>
            <li>
              <b>Trạng thái hợp đồng:</b>{" "}
              <Badge color={contract.status === "active" ? "success" : "error"}>
                <span className="capitalize">{contract.status}</span>
              </Badge>
            </li>
          </ul>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold inline-flex gap-2 text-blue-500">
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
        <div>Chưa có hợp đồng</div>
      )}
    </ComponentCard>
  );
}
