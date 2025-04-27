"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";
import Tag from "@/database/tag.model";
import { TagProps } from "@/types";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    connectToDatabase();
    const { userId } = params;
    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    return [
      { _id: "1", name: ".NET" },
      { _id: "2", name: "React" },
      { _id: "3", name: "Next" },
    ];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllTags() {
  try {
    connectToDatabase();
    const tags = await Tag.find<TagProps>({}).lean<TagProps[]>();

    return { tags };
  } catch (error) {
    console.log(error);
    throw error;
  }
}