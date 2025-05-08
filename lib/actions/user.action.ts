"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from './shared.types';
import { revalidatePath } from 'next/cache';
import Question from '@/database/question.model';
import { AnswerProps, QuestionProps, UserProps } from '@/types';
import { FilterQuery } from 'mongoose';
import Tag from '@/database/tag.model';
import Answer from '@/database/answer.model';
import { paginate } from '../utils';

export async function getUserById(params: GetUserByIdParams) {
  try {
    await connectToDatabase();

    const { userId } = params;
    const user = await User.findOne<UserProps>({
      clerkId: userId,
    }).lean<UserProps>();

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createUser(params: CreateUserParams) {
  try {
    await connectToDatabase();

    const newUser = await User.create(params);
    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    await connectToDatabase();
    const { clerkId, updateData, path } = params;

    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    await connectToDatabase();
    const { clerkId } = params;
    const user = await User.findOne({ clerkId });

    if (!user) {
      throw new Error('User not found');
    }

    // const userQuestionIds = await Question.find({
    //   author: user._id,
    // }).distinct("_id");

    await Question.deleteMany({ author: user._id });

    const deletedUser = await User.findOneAndDelete(user._id);
    return deletedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    await connectToDatabase();
    const { searchQuery, filter, page, pageSize } = params;

    const query: FilterQuery<typeof User> = {};

    if (searchQuery) {
      query.$or = [
        {
          name: { $regex: new RegExp(searchQuery, 'i') },
        },
        {
          username: { $regex: new RegExp(searchQuery, 'i') },
        },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case 'new_users':
        sortOptions = { joinedAt: -1 };
        break;
      case 'old_users':
        sortOptions = { joinedAt: 1 };
        break;
      case 'top_contributors':
        sortOptions = { reputation: -1 };
        break;
    }

    const usersQuery = User.find(query).sort(sortOptions);

    const { data: users, isNext } = await paginate<UserProps>(usersQuery, {
      page,
      pageSize,
    });

    return { users, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    await connectToDatabase();
    const { userId, questionId, path } = params;

    const user = await User.findById(userId);

    if (!user) throw new Error('User not found');

    const isQuestionSaved = user.saved.includes(questionId);

    if (isQuestionSaved) {
      // Remove question from saved
      await User.findByIdAndUpdate(
        userId,
        {
          $pull: { saved: questionId },
        },
        { new: true }
      );
    } else {
      // Add question to saved
      await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: { saved: questionId },
        },
        { new: true }
      );
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    await connectToDatabase();

    const { clerkId, searchQuery, filter, page, pageSize } = params;

    const user = await User.findOne({ clerkId }).lean<UserProps>();
    if (!user || !user.saved || user.saved.length === 0) {
      return { questions: [], isNext: false };
    }

    const query: FilterQuery<typeof Question> = {
      _id: { $in: user.saved },
    };

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, 'i') } },
        { content: { $regex: new RegExp(searchQuery, 'i') } },
      ];
    }

    let sortOrder = {};

    switch (filter) {
      case 'most_recent':
        sortOrder = { createdAt: -1 };
        break;
      case 'oldest':
        sortOrder = { createdAt: 1 };
        break;
      case 'most_voted':
        sortOrder = { upvotes: -1 };
        break;
      case 'most_viewed':
        sortOrder = { views: -1 };
        break;
      case 'most_answered':
        sortOrder = { answers: -1 };
        break;
      default:
        break;
    }

    const q = Question.find<QuestionProps>(query)
      .sort(sortOrder)
      .populate({ path: 'tags', model: Tag, select: '_id name' })
      .populate({
        path: 'author',
        model: User,
        select: '_id clerkId name picture',
      });

    const { data: questions, isNext } = await paginate(q, {
      page,
      pageSize,
    });

    return { questions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserInfo(params: GetUserByIdParams) {
  try {
    await connectToDatabase();

    const { userId } = params;
    const user = await User.findOne<UserProps>({ clerkId: userId });

    if (!user) throw new Error('User not found');

    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });

    return {
      user,
      totalQuestions,
      totalAnswers,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    await connectToDatabase();
    const { userId, page, pageSize } = params;

    const userQuestionsQuery = Question.find<QuestionProps>({ author: userId })
      .sort({
        views: -1,
        upvotes: -1,
      })
      .populate('tags', '_id name')
      .populate('author', '_id clerkId name picture');

    const { data: userQuestions, isNext } = await paginate(userQuestionsQuery, {
      page,
      pageSize,
    });

    return { questions: userQuestions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    await connectToDatabase();

    const { userId, page, pageSize } = params;

    const userAnswersQuery = Answer.find<AnswerProps>({ author: userId })
      .sort({
        upvotes: -1,
      })
      .populate('question', '_id title')
      .populate('author', '_id clerkId name picture');

    const { data: answers, isNext } = await paginate(userAnswersQuery, {
      page,
      pageSize,
    });

    return { answers, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}