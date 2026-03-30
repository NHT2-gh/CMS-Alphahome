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

export type CreateUtilityReadingFormType = z.infer<
  typeof createUtilityReadingFormSchema
>;
export type CreateInvoiceFormType = z.infer<typeof createInvoiceFormSchema>;

export type AddBillServiceDetaiFormType = z.infer<
  typeof addBillServiceDetaiFormSchema
>;
