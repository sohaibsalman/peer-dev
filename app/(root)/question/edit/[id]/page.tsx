import Question from '@/components/forms/Question';
import { getQuestionById } from '@/lib/actions/question.action';
import { getUserById } from '@/lib/actions/user.action';
import { ParamsProps } from '@/types';
import { auth } from '@clerk/nextjs/server';
import { unauthorized } from 'next/navigation';
import React from 'react';

const QuestionEditPage = async ({ params }: ParamsProps) => {
  const { userId } = await auth();

  if (!userId) return null;

  const mongoUser = await getUserById({ userId });

  if (!mongoUser) return unauthorized();

  const question = await getQuestionById({ questionId: (await params).id });

  return (
    <>
      <h1 className='h1-bold text-dark100_light900'>Edit Question</h1>
      <div className='mt-9'>
        <Question
          type='edit'
          mongoUserId={JSON.stringify(mongoUser?._id)}
          questionDetails={JSON.stringify(question)}
        />
      </div>
    </>
  );
};

export default QuestionEditPage;
