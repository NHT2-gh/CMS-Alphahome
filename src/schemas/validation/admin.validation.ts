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
  unit_price: z.string(),
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
