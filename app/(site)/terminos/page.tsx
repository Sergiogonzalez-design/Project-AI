import { redirect } from "next/navigation";

/** Terms are on the privacy page. Keep this route for old links. */
export default function TerminosPage() {
  redirect("/privacidad");
}
