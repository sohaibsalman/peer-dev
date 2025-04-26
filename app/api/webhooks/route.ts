import { createUser, deleteUser, updateUser } from "@/lib/actions/user.action";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const event = await verifyWebhook(req);

    if (event.type === "user.created") {
      const { data } = event;

      const mongoUser = await createUser({
        clerkId: data.id,
        name: `${data.first_name}${data.last_name ? ` ${data.last_name}` : ""}`,
        email: data.email_addresses[0].email_address,
        username: data.username!,
        picture: data.image_url,
      });

      return NextResponse.json({ message: "OK", mongoUser });
    }

    if (event.type === "user.updated") {
      const { data } = event;

      const mongoUser = await updateUser({
        clerkId: data.id,
        updateData: {
          name: `${data.first_name}${
            data.last_name ? ` ${data.last_name}` : ""
          }`,
          email: data.email_addresses[0].email_address,
          username: data.username!,
          picture: data.image_url,
        },
        path: `/profile/${data.id}`,
      });
    }

    if (event.type === "user.deleted") {
      const deletedUser = await deleteUser({ clerkId: event.data.id! });
      return NextResponse.json({ message: "OK", deletedUser });
    }
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
