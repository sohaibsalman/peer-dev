import { getUserQuestions } from '@/lib/actions/user.action';
import { SearchParamsProps } from '@/types';
import QuestionCard from '../cards/QuestionCard';

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const QuestionTab = async ({ userId, clerkId }: Props) => {
  const { questions } = await getUserQuestions({
    userId,
    page: 1,
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
    </>
  );
};

export default QuestionTab;
