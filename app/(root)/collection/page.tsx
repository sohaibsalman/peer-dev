import QuestionCard from "@/components/cards/QuestionCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import { QuestionFilters } from "@/constants/filters";
import { getSavedQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from '@/types';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function CollectionPage({
  searchParams,
}: SearchParamsProps) {
  const { userId: clerkId } = await auth();

  if (!clerkId) return redirect('sign-in');

  const { questions } = await getSavedQuestions({
    clerkId,
    searchQuery: (await searchParams).q,
    filter: (await searchParams).filter,
  });

  return (
    <>
      <h1 className='h1-bold text-dark100_light900'>Saved Questions</h1>

      <div className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
        <LocalSearchbar
          route='/collection'
          iconPosition='left'
          imgSrc='/assets/icons/search.svg'
          placeholder='Search for saved questions'
          otherClasses='flex-1'
        />
        <Filter
          filters={QuestionFilters}
          otherClasses='min-h-[56px] sm:min-w-[170px]'
        />
      </div>

      <div className='mt-10 flex w-full flex-col gap-6'>
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionCard key={question._id} question={question} />
          ))
        ) : (
          <NoResult
            title="There's no saved question to show"
            description="You haven't saved any questions yet. 📚 Find questions that interest you and save them for quick access later. Your collection of knowledge starts here! 🚀"
            link='/'
            linkTitle='Browse Questions'
          />
        )}
      </div>
    </>
  );
}
