"use client";
import React, { useEffect, useState } from "react";
import { Plus, Trash, X } from "lucide-react";
import { TenantRole } from "@/types/building";
import Button from "@/components/ui/button/Button";
import { Input } from "@/components/_cms/ui/input";
import { Select } from "@/components/_cms/ui/select";
import { useAllProfile } from "@/hooks/queries/use-profile";
import { useFieldArray, useFormContext } from "react-hook-form";
import { CMSTableHeader } from "@/components/_cms/components/data-table";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  UpdateBuildingSettingType,
  UpsertUsersBuildingType,
} from "@/schemas/validation/admin.validation";

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
        {isEdit ? <X className="size-4" /> : <Plus className="size-4" />}
        {isEdit ? "Hủy" : "Chỉnh sửa"}
      </Button>
      <Table>
        <CMSTableHeader
          columns={[
            { key: "name", title: "Tên" },
            { key: "email", title: "Email" },
            { key: "phone", title: "Số điện thoại" },
            { key: "role", title: "Phân quyền" },
          ]}
        />
        <TableBody>
          {fields.map((field, index) => (
            <TableRow key={field.fieldId}>
              <TableCell>{field.full_name}</TableCell>
              <TableCell>{field.email}</TableCell>
              <TableCell>{field.phone}</TableCell>
              <TableCell>
                {TenantRole[field.role as unknown as keyof typeof TenantRole]}
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
          ))}
          {isEdit &&
            Object.entries(userSelected || {}).map(([key, user]) => (
              <TableRow className="w-full border-t" key={key}>
                <TableCell>
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
                </TableCell>

                <TableCell>
                  <Input
                    id="user-email"
                    type="text"
                    placeholder="Email"
                    readOnly
                    value={user.email || "Chưa có"}
                  />
                </TableCell>
                <TableCell className="max-w-[10rem]">
                  <Input
                    id="user-phone"
                    type="text"
                    placeholder="Số điện thoại"
                    readOnly
                    value={user.phone || "Chưa có"}
                  />
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  <Button
                    className="bg-brand-500 p-2"
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
                    <Plus className="size-4 text-white" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  );
}
