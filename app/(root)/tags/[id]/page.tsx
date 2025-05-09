import QuestionCard from "@/components/cards/QuestionCard";
import NoResult from "@/components/shared/NoResult";
import Pagination from '@/components/shared/Pagination';
import LocalSearchbar from '@/components/shared/search/LocalSearchbar';
import { getQuestionsByTagId } from '@/lib/actions/tag.actions';
import { URLProps } from '@/types';

const TagDetailPage = async ({ params, searchParams }: URLProps) => {
  const resolvedParams = await searchParams;
  const { questions, tagTitle, isNext } = await getQuestionsByTagId({
    tagId: (await params).id,
    page: resolvedParams.page ? +resolvedParams.page : 1,
    searchQuery: resolvedParams.q,
  });

  return (
    <>
      <h1 className='h1-bold text-dark100_light900'>{tagTitle}</h1>

      <div className='mt-11 w-full'>
        <LocalSearchbar
          route={`/tags/${(await params).id}`}
          iconPosition='left'
          imgSrc='/assets/icons/search.svg'
          placeholder='Search for tag questions...'
          otherClasses='flex-1'
        />
      </div>

      <div className='mt-10 flex w-full flex-col gap-6'>
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionCard key={question._id} question={question} />
          ))
        ) : (
          <NoResult
            title="There's no tag question to show"
            description='There are no questions for this tag yet. 🔖 Try exploring other tags or ask a new question to spark a discussion. Your contribution helps the community grow! 🌱'
            link='/'
            linkTitle='Browse Questions'
          />
        )}
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

export default TagDetailPage;
