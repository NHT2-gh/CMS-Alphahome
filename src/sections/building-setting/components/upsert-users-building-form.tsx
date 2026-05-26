"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/_cms/ui/table";
import {
  UpdateBuildingSettingType,
  UpsertUsersBuildingType,
} from "@/schemas/validation/admin.validation";
import { TenantRole } from "@/types/building";
import { Input } from "@/components/_cms/ui/input";
import { Select } from "@/components/_cms/ui/select";
import { Button } from "@/components/_cms/ui/button";
import { Pencil, Plus, Trash, X } from "lucide-react";
import { useAllProfile } from "@/hooks/queries/use-profile";
import { useFieldArray, useFormContext } from "react-hook-form";
import { DataEmpty } from "@/components/_cms/common/table/state";
import { CMSTableHeader } from "@/components/_cms/components/table";

export default function UpsertUsersBuildingForm() {
  const formBuildingSetting = useFormContext<UpdateBuildingSettingType>();
  const { data: profiles } = useAllProfile();
  const { fields, append, remove } = useFieldArray({
    control: formBuildingSetting.control,
    name: "users",
    keyName: "fieldId",
  });
  const [isEdit, setIsEdit] = useState<boolean>();
  const [userSelected, setUserSelected] = useState<
    Record<string, UpsertUsersBuildingType>
  >({
    [crypto.randomUUID()]: {
      id: "",
      user_id: "",
      full_name: "",
      email: "",
      phone: "",
      role: "user",
    },
  });

  const handleUpdateUserSelected = (
    key: string,
    field: keyof UpsertUsersBuildingType,
    value: string,
  ) => {
    setUserSelected((prev) => {
      const userInfo = prev[key] ?? {
        id: undefined,
        user_id: "",
        full_name: "",
        email: "",
        phone: "",
        role: "user",
      };

      const updatedUserSelected = {
        ...userInfo,
        [field]: value,
      };
      return { ...prev, [key]: updatedUserSelected };
    });
  };
  return (
    <>
      <Button
        variant="outline"
        className={"absolute right-2 top-2.5 px-4 py-2.5"}
        onClick={() => setIsEdit(!isEdit)}
      >
        {isEdit ? <X className="size-4" /> : <Pencil className="size-4" />}
        {isEdit ? "Hủy" : "Chỉnh sửa"}
      </Button>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <CMSTableHeader
            columns={[
              { key: "name", title: "Tên" },
              { key: "email", title: "Email" },
              { key: "phone", title: "Số điện thoại" },
              { key: "role", title: "Phân quyền" },
              { key: "actions", title: "" },
            ]}
          />
          <TableBody>
            {fields.length === 0 ? (
              <DataEmpty
                message={"Hiện tại chưa có quản lý nào được thêm"}
                colSpan={5}
              />
            ) : (
              fields.map((field, index) => (
                <TableRow key={field.fieldId}>
                  <TableCell>{field.full_name}</TableCell>
                  <TableCell>{field.email}</TableCell>
                  <TableCell>{field.phone}</TableCell>
                  <TableCell>
                    {
                      TenantRole[
                        field.role as unknown as keyof typeof TenantRole
                      ]
                    }
                  </TableCell>

                  <TableCell>
                    <button
                      className="text-error-500"
                      onClick={() => remove(index)}
                    >
                      <Trash className="size-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {isEdit &&
          Object.entries(userSelected || {}).map(([key, user]) => (
            <>
              <div
                className="w-full border-t pt-5 grid grid-cols-2 gap-5 md:grid-cols-[repeat(4,minmax(150px,1fr))]"
                key={key}
              >
                <Select
                  id="user-select"
                  options={[
                    {
                      label: "Chọn người dùng",
                      value: "",
                    },
                    ...(profiles
                      ?.filter(
                        (profile) =>
                          !fields.some((f) => f.user_id === profile.id),
                      )
                      .map((item) => ({
                        label: item.full_name,
                        value: item.id,
                      })) || []),
                  ]}
                  placeholder="Chọn người dùng"
                  handleOnChange={(value) => {
                    const profile = profiles?.find((p) => p.id === value);
                    handleUpdateUserSelected(key, "id", crypto.randomUUID());
                    handleUpdateUserSelected(key, "user_id", value);
                    handleUpdateUserSelected(
                      key,
                      "full_name",
                      profile?.full_name || "",
                    );
                    profile?.email &&
                      handleUpdateUserSelected(key, "email", profile?.email);
                    profile?.phone &&
                      handleUpdateUserSelected(key, "phone", profile?.phone);
                  }}
                />
                <Input
                  id="user-email"
                  type="text"
                  placeholder="Email"
                  readOnly
                  value={user.email || "Chưa có"}
                />
                <Input
                  id="user-phone"
                  type="text"
                  placeholder="Số điện thoại"
                  readOnly
                  value={user.phone || "Chưa có"}
                />
                <Select
                  id="user-role"
                  placeholder="Phần quyền"
                  options={
                    Object.entries(TenantRole).map(([key, value]) => ({
                      value: key,
                      label: value,
                    })) || []
                  }
                  value={user.role}
                  handleOnChange={(value) => {
                    handleUpdateUserSelected(key, "role", value);
                  }}
                />
              </div>
              <Button
                className="bg-brand-500 w-full mt-5 float-end md:w-fit"
                onClick={() => {
                  append({
                    id: userSelected[key].id,
                    user_id: userSelected[key].user_id,
                    full_name: userSelected[key].full_name,
                    email: userSelected[key].email,
                    phone: userSelected[key].phone,
                    role: userSelected[key].role,
                  });

                  setUserSelected((prev) => ({
                    ...prev,
                    [key]: {
                      id: "",
                      user_id: "",
                      full_name: "",
                      email: "",
                      phone: "",
                      role: "user",
                    },
                  }));
                }}
              >
                <Plus className="size-5 text-white" /> Thêm người quản trị
              </Button>
            </>
          ))}
      </div>
    </>
  );
}
