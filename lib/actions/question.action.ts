"use server";

import { connectToDatabase } from "../mongoose";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import { CreateQuestionParams, GetQuestionByIdParams } from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import { QuestionProps } from "@/types";

export async function createQuestion(params: CreateQuestionParams) {
  try {
    connectToDatabase();
    const { title, content, tags, author, path } = params;

    const question = await Question.create({ title, content, author });

    const tagDocuments = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        {
          name: { $regex: new RegExp(`^${tag}$`, "i") },
        },
        { $setOnInsert: { name: tag }, $push: { question: question._id } },
        { upsert: true, new: true }
      );

      tagDocuments.push(existingTag._id);
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestions() {
  try {
    connectToDatabase();

    const questions = await Question.find({})
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({
        path: "author",
        model: User,
      });

    return { questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    connectToDatabase();

    const question = await Question.findById<QuestionProps>(params.questionId)
      .populate({
        path: "tags",
        model: Tag,
        select: "_id name",
      })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      })
      .lean<QuestionProps>();

    return question;
  } catch (error) {
    console.log(error);
    throw error;
  }
}