"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { isOrderStatus } from "@/lib/order-status";

export async function updateOrderStatusAction(orderId: string, formData: FormData) {
  await requireAdmin();
  const status = String(formData.get("status") ?? "");
  if (!isOrderStatus(status)) return;

  await db.order.update({ where: { id: orderId }, data: { status } });
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}

export async function updateOrderNotesAction(orderId: string, formData: FormData) {
  await requireAdmin();
  const adminNotes = String(formData.get("adminNotes") ?? "");

  await db.order.update({ where: { id: orderId }, data: { adminNotes } });
  revalidatePath(`/admin/orders/${orderId}`);
}
