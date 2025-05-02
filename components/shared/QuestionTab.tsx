import { getUserQuestions } from '@/lib/actions/user.action';
import { SearchParamsProps } from '@/types';
import QuestionCard from '../cards/QuestionCard';

interface Props extends SearchParamsProps {
  userId: string;
}

const QuestionTab = async ({ userId }: Props) => {
  const { questions } = await getUserQuestions({
    userId,
    page: 1,
  });

  return (
    <>
      <div className='space-y-3'>
        {questions.map((question) => (
          <QuestionCard key={question._id} question={question} />
        ))}
      </div>
    </>
  );
};

export default QuestionTab;
