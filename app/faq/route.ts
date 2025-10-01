import { redirect } from "next/navigation";

export function GET() {
  redirect("/help");
}

export function HEAD() {
  redirect("/help");
}
