"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from './shared.types';
import Tag, { ITag } from '@/database/tag.model';
import { TagProps } from '@/types';
import Question from '@/database/question.model';
import { FilterQuery } from 'mongoose';

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    await connectToDatabase();
    const { userId } = params;
    const user = await User.findById(userId);

    if (!user) throw new Error('User not found');

    return [
      { _id: '1', name: '.NET' },
      { _id: '2', name: 'React' },
      { _id: '3', name: 'Next' },
    ];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    await connectToDatabase();

    const { searchQuery, filter } = params;
    const query: FilterQuery<typeof Tag> = {};

    if (searchQuery) {
      query.$or = [
        {
          name: { $regex: new RegExp(searchQuery, 'i') },
        },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case 'popular':
        sortOptions = { questions: 1 };
        break;
      case 'recent':
        sortOptions = { createdAt: -1 };
        break;
      case 'name':
        sortOptions = { name: 1 };
        break;
      case 'old':
        sortOptions = { createdAt: 1 };
        break;
      default:
        break;
    }

    const tags = await Tag.find<TagProps>(query)
      .sort(sortOptions)
      .lean<TagProps[]>();

    return { tags };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    await connectToDatabase();

    const { tagId, searchQuery } = params;

    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const tag = await Tag.findOne<TagProps>(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    if (!tag) throw new Error("Tag not found");

    return { tagTitle: tag.name, questions: tag.questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getTopPopularTags() {
  try {
    await connectToDatabase();

    const popularTags = await Tag.aggregate([
      { $project: { name: 1, numberOfQuestions: { $size: '$questions' } } },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: 5 },
    ]);

    return popularTags;
  } catch (error) {
    console.log(error);
    throw error;
  }
}