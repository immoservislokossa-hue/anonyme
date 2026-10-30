import type { Metadata } from "next";
import Workspace from "@/components/pro/workspace/Workspace";
import { getPays } from "@/lib/pays";

export const metadata: Metadata = { title: "Mon service" };

export default function MonServiceLayout({ children }: { children: React.ReactNode }) {
  return <Workspace zones={getPays().zones}>{children}</Workspace>;
}
