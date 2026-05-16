import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export const metadata = {
  title: "Forgot Password | CodePilot AI",
  description: "Reset your CodePilot AI account password",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
