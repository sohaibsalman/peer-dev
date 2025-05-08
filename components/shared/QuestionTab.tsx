import { getUserQuestions } from '@/lib/actions/user.action';
import { SearchParamsProps } from '@/types';
import QuestionCard from '../cards/QuestionCard';
import Pagination from './Pagination';

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const QuestionTab = async ({ userId, clerkId, searchParams }: Props) => {
  const resolvedParams = await searchParams;
  const { questions, isNext } = await getUserQuestions({
    userId,
    page: resolvedParams.page ? +resolvedParams.page : 1,
  });

  return (
    <>
      <div className='space-y-3'>
        {questions.map((question) => (
          <QuestionCard
            key={question._id}
            question={question}
            clerkId={clerkId}
          />
        ))}
      </div>

      <div className='mt-10'>
        <Pagination
          isNext={isNext}
          pageNumber={resolvedParams?.page ? parseInt(resolvedParams.page!) : 1}
        />
      </div>
    </>
  );
};

export default QuestionTab;
