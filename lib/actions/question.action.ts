"use server";

import { connectToDatabase } from "../mongoose";
import Question, { IQuestion } from '@/database/question.model';
import Tag from '@/database/tag.model';
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
} from './shared.types';
import User from '@/database/user.model';
import { revalidatePath } from 'next/cache';
import { QuestionProps } from '@/types';
import Answer from '@/database/answer.model';
import Interaction from '@/database/interaction.model';
import { FilterQuery } from 'mongoose';

export async function createQuestion(params: CreateQuestionParams) {
  try {
    await connectToDatabase();
    const { title, content, tags, author, path } = params;

    const question = await Question.create({ title, content, author });

    const tagDocuments = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        {
          name: { $regex: new RegExp(`^${tag}$`, 'i') },
        },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
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

export async function getQuestions(params: GetQuestionsParams) {
  try {
    await connectToDatabase();

    const { searchQuery, filter } = params;

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, 'i') } },
        { content: { $regex: new RegExp(searchQuery, 'i') } },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'frequent':
        sortOptions = { views: -1 };
        break;
      case 'unanswered':
        query.answers = { $size: 0 };
        break;
      default:
        break;
    }

    const questions = await Question.find(query)
      .populate({
        path: 'tags',
        model: Tag,
      })
      .populate({
        path: 'author',
        model: User,
      })
      .sort(sortOptions);

    return { questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    await connectToDatabase();

    const question = await Question.findById<QuestionProps>(params.questionId)
      .populate({
        path: 'tags',
        model: Tag,
        select: '_id name',
      })
      .populate({
        path: 'author',
        model: User,
        select: '_id clerkId name picture',
      })
      .lean<QuestionProps>();

    return question;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function upVoteQuestion(params: QuestionVoteParams) {
  try {
    await connectToDatabase();
    const { questionId, userId, hasUpVoted, hasDownVoted, path } = params;

    let updateQuery = {};

    if (hasUpVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasDownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error('Question not found');
    }

    // Increment authors reputation

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downVoteQuestion(params: QuestionVoteParams) {
  try {
    await connectToDatabase();
    const { questionId, userId, hasUpVoted, hasDownVoted, path } = params;

    let updateQuery = {};

    if (hasDownVoted) {
      updateQuery = { $pull: { downvotes: userId } };
    } else if (hasUpVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error('Question not found');
    }

    // Increment authors reputation

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    await connectToDatabase();
    const { questionId, path } = params;

    await Question.deleteOne({ _id: questionId });
    await Answer.deleteMany({ question: questionId });
    await Interaction.deleteMany({ question: questionId });
    await Tag.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } }
    );

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function editQuestion(params: EditQuestionParams) {
  try {
    await connectToDatabase();
    const { questionId, title, content, path } = params;

    const question = await Question.findById<IQuestion>(questionId).populate(
      'tags'
    );

    if (!question) throw new Error('Question not found');

    question.title = title;
    question.content = content;

    await question.save();

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getHotQuestions() {
  try {
    await connectToDatabase();
    const hotQuestions = await Question.find<QuestionProps[]>({})
      .sort({
        views: -1,
        upvotes: -1,
      })
      .limit(5)
      .lean<QuestionProps[]>();

    return hotQuestions;
  } catch (error) {
    console.log(error);
    throw error;
  }
}