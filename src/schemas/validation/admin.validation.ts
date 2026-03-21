import z from "zod";

export const createInvoiceFormSchema = z.object({
  invoice_number: z.string().min(1, "Invoice number is required"),
  room_code: z.string().min(1, "Room is required"),
  month_date: z.date(),
});

export const createUtilityReadingFormSchema = z.object({
  month: z.string(),
});

export const addBillServiceDetaiFormSchema = z.object({
  service_id: z.string(),
  quantity: z.number(),
  unit_price: z.string(),
});

export type CreateUtilityReadingFormType = z.infer<
  typeof createUtilityReadingFormSchema
>;
export type CreateInvoiceFormType = z.infer<typeof createInvoiceFormSchema>;

export type AddBillServiceDetaiFormType = z.infer<
  typeof addBillServiceDetaiFormSchema
>;
