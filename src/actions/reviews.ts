"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCustomerSession } from "@/lib/customer-auth";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export type ReviewState = { error?: string; success?: boolean };

export async function submitReviewAction(
  productSlug: string,
  _prev: ReviewState,
  formData: FormData
): Promise<ReviewState> {
  const session = await getCustomerSession();
  if (!session) {
    return { error: "Please sign in to review — reviews are tied to your account." };
  }

  const rating = Number(formData.get("rating"));
  const body = String(formData.get("body") ?? "").trim();
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "Pick a rating from 1 to 5 stars." };
  }
  if (body.length < 10) {
    return { error: "Tell us a little more — at least 10 characters." };
  }

  const ip = await clientIp();
  if (!rateLimit(`review:${session.customerId}`, { limit: 5, windowMs: 60 * 60 * 1000 })) {
    return { error: "Too many reviews in a short time — try again later." };
  }

  const product = await db.product.findUnique({ where: { slug: productSlug } });
  if (!product) return { error: "This product no longer exists." };

  // Verified purchase: any delivered order of theirs containing this product.
  const delivered = await db.orderItem.findFirst({
    where: {
      productId: product.id,
      order: { customerId: session.customerId, status: "DELIVERED" },
    },
  });

  await db.review.upsert({
    where: {
      productId_customerId: {
        productId: product.id,
        customerId: session.customerId,
      },
    },
    update: { rating, body: body.slice(0, 2000), verified: Boolean(delivered) },
    create: {
      productId: product.id,
      customerId: session.customerId,
      rating,
      body: body.slice(0, 2000),
      verified: Boolean(delivered),
    },
  });

  revalidatePath(`/product/${productSlug}`);
  return { success: true };
}
