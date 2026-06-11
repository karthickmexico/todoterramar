import { redirect } from "next/navigation";

export default function AdminProtectedRoot() {
  redirect("/admin/dashboard");
}
