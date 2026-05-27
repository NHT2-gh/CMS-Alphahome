import SignUpForm from "@/components/_cms/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng ký | AlphaHome",
  description: "Đăng ký tài khoản AlphaHome",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
