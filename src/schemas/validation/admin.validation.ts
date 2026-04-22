import z from "zod";

export const createInvoiceFormSchema = z.object({
  bill_code: z.string().min(1, "Bill code is required"),
  room_selected: z
    .union([z.string(), z.array(z.string()).min(1, "Room is required")])
    .optional(),
  month_date: z.string(),
});

export const createUtilityReadingFormSchema = z.object({
  month: z.string(),
});

export const addBillServiceDetaiFormSchema = z.object({
  service_id: z.string(),
  quantity: z.number(),
  calculation_method: z.string(),
  unit_price: z.number(),
});

export const createRoomFormSchema = z.object({
  building_id: z.string().min(1, "Building ID is required"),
  code_room: z.string().min(1, "Code room is required"),
  area: z.number().optional(),
  current_rent: z.number().min(1, "Current rent is required"),
  furniture_status: z.string().min(1, "Furniture status is required"),
  description: z.string().optional(),
  images: z.array(z.string()),
});

export const updateRoomInfoSchema = z.object({
  id: z.string().min(1, "Room ID is required"),
  code_room: z.string().min(1, "Code room is required"),
  area: z.number().optional(),
  furniture_status: z.string().min(1, "Furniture status is required"),
  description: z.string().optional(),
  images: z.array(z.string()),
  current_rent: z.number().min(1, "Current rent is required"),
});

export const createTransactionSchema = z
  .object({
    category_id: z.string().min(1, "Hạng mục là bắt buộc"),
    description: z.string().optional(),
    amount: z.number().min(1, "Số tiền là bắt buộc"),
    type: z.string().min(1, "Loại là bắt buộc"),
    transaction_date: z.string().min(1, "Ngày là bắt buộc"),
    payment_method: z.string().min(1, "Phương thức thanh toán là bắt buộc"),
    room_id: z.string().optional(),
    building_id: z.string().min(1, "Building ID is required"),
  })
  .superRefine((data, ctx) => {
    if (data.category_id === "other" && !data.description) {
      ctx.addIssue({
        path: ["description"],
        code: z.ZodIssueCode.custom,
        message: "Mô tả là bắt buộc khi chọn 'Khác'",
      });
    }
  });

export const upsertBuildingServiceSchema = z.object({
  id: z.string().min(1, "Building service ID is required"),
  service_id: z.string().min(1, "Service ID is required"),
  unit_price: z.number().min(1, "Unit price is required"),
  service_name: z.string().optional(),
  service_type: z.string().optional(),
  unit: z.string().nullable().optional(),
  calculation_method: z.string().optional(),
  updated_at: z.string().optional(),
  updated_by: z.string().nullable().optional(),
});

export const updatetBuildingInfoSchema = z.object({
  code: z.string().min(1, "Code is required"),
  address: z.string().min(1, "Address is required"),
  is_active: z.boolean().optional(),
  price_rent: z.number().min(1, "Price rent is required"),
  price_deposit: z.number().min(1, "Price deposit is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
});

export const upsertUsersBuildingSchema = z.object({
  user_id: z.string().min(1, "User ID is required"),
  full_name: z.string().min(1, "Full name is required").optional(),
  phone: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  role: z.string(),
});

export const updateBuildingSettingSchema = z.object({
  info: updatetBuildingInfoSchema,
  services: z.array(upsertBuildingServiceSchema).optional(),
  users: z.array(upsertUsersBuildingSchema).optional(),
});

export type UpdateBuildingSettingType = z.infer<
  typeof updateBuildingSettingSchema
>;

export type UpdateBuildingInfoType = z.infer<typeof updatetBuildingInfoSchema>;

export type UpsertBuildingServiceType = z.infer<
  typeof upsertBuildingServiceSchema
>;

export type UpsertUsersBuildingType = z.infer<typeof upsertUsersBuildingSchema>;

export type CreateTransactionType = z.infer<typeof createTransactionSchema>;

export type UpdateRoomInfoType = z.infer<typeof updateRoomInfoSchema>;

export type CreateRoomFormType = z.infer<typeof createRoomFormSchema>;

export type CreateUtilityReadingFormType = z.infer<
  typeof createUtilityReadingFormSchema
>;
export type CreateInvoiceFormType = z.infer<typeof createInvoiceFormSchema>;

export type AddBillServiceDetaiFormType = z.infer<
  typeof addBillServiceDetaiFormSchema
>;
