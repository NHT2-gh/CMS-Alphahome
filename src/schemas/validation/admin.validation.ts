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
  area: z.number().min(1, "Area is required"),
  current_rent: z.number().min(1, "Current rent is required"),
  furniture_status: z.string().min(1, "Furniture status is required"),
  description: z.string().optional(),
  images: z.array(z.string()),
});

export const updateRoomInfoSchema = z.object({
  building_id: z.string().min(1, "Building ID is required"),
  code_room: z.string().min(1, "Code room is required"),
  area: z.number().min(1, "Area is required"),
  furniture_status: z.string().min(1, "Furniture status is required"),
  description: z.string().optional(),
  images: z.array(z.string()),
});

export type UpdateRoomInfoType = z.infer<typeof updateRoomInfoSchema>;

export type CreateRoomFormType = z.infer<typeof createRoomFormSchema>;

export type CreateUtilityReadingFormType = z.infer<
  typeof createUtilityReadingFormSchema
>;
export type CreateInvoiceFormType = z.infer<typeof createInvoiceFormSchema>;

export type AddBillServiceDetaiFormType = z.infer<
  typeof addBillServiceDetaiFormSchema
>;
