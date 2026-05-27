import SignInForm from "@/components/_cms/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng nhập | AlphaHome",
  description: "Đăng nhập vào hệ thống quản lý",
};

export default function SignIn() {
  return <SignInForm />;
}
