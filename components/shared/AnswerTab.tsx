import { getUserAnswers } from '@/lib/actions/user.action';
import { SearchParamsProps } from '@/types';
import React from 'react';
import AnswerCard from '../cards/AnswerCard';
import Pagination from './Pagination';

interface Props extends SearchParamsProps {
  userId: string;
  clerkId: string | null;
}

const AnswerTab = async ({ userId, clerkId, searchParams }: Props) => {
  const resolvedParams = await searchParams;
  const { answers, isNext } = await getUserAnswers({
    userId,
    page: resolvedParams.page ? +resolvedParams.page : 1,
  });

  return (
    <>
      {answers.map((answer) => (
        <AnswerCard
          key={answer._id}
          clerkId={clerkId}
          _id={answer._id}
          question={answer.question}
          author={answer.author}
          upvotes={answer.upvotes.length}
          createdAt={answer.createdAt}
        />
      ))}

      <div className='mt-10'>
        <Pagination
          isNext={isNext}
          pageNumber={resolvedParams?.page ? parseInt(resolvedParams.page!) : 1}
        />
      </div>
    </>
  );
};

export default AnswerTab;
