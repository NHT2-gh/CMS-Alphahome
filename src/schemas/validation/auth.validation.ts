import { z } from "zod";

export const signUpSchema = z.object({
  fname: z.string().min(2, "Tên không được ít hơn 2 ký tự"),
  lname: z.string().min(2, "Tên không được ít hơn 2 ký tự"),
  email: z.string().email("Địa chỉ email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  password_confirmation: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
});

export const signInSchema = z.object({
  email: z.string().email("Địa chỉ email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
});

// Schema with password confirmation validation
export const signUpFormSchema = signUpSchema.superRefine((values, ctx) => {
  if (values.password !== values.password_confirmation) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Mật khẩu không khớp",
      path: ["password_confirmation"],
    });
  }
});

// Type inference

export type SignUpDataType = z.infer<typeof signUpSchema>;
export type SignInDataType = z.infer<typeof signInSchema>;

// Validation helper functions

export const validateSignUp = (data: SignUpDataType) => {
  return signUpSchema.safeParse(data);
};

export const validateSignIn = (data: SignInDataType) => {
  return signInSchema.safeParse(data);
};
