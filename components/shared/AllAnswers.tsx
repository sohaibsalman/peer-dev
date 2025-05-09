import Filter from './Filter';
import { AnswerFilters } from '@/constants/filters';
import { getAnswers } from '@/lib/actions/answer.action';
import Link from 'next/link';
import Image from 'next/image';
import { getTimestamp } from '@/lib/utils';
import ParseHTML from './ParseHTML';
import Votes from './Votes';
import Pagination from './Pagination';

interface Props {
  questionId: string;
  userId: string;
  totalAnswers: number;
  page?: number;
  filter?: string;
}

const AllAnswers = async ({
  questionId,
  totalAnswers,
  userId,
  filter,
  page,
}: Props) => {
  const { answers, isNext } = await getAnswers({
    questionId,
    sortBy: filter,
    page,
  });

  function hasUserVoted(votes: string[], userId: string) {
    return votes.some((id) => id.toString() === userId.toString());
  }

  return (
    <div className='mt-11'>
      <div className='flex items-center justify-between'>
        <h3 className='primary-text-gradient'>
          {totalAnswers} Answer{totalAnswers > 1 ? 's' : ''}
        </h3>
        <Filter filters={AnswerFilters} />
      </div>
      <div>
        {answers.map((answer) => (
          <article key={answer._id} className='light-border border-b py-10'>
            <div className='flex items-center justify-between'>
              <div className='mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
                <Link
                  href={`/profile/${answer.author.clerkId}`}
                  className='flex flex-1 items-start gap-1 sm:items-center'
                >
                  <Image
                    src={answer.author.picture}
                    width={18}
                    height={18}
                    alt='profile'
                    className='rounded-full object-cover max-sm:mt-0.5'
                  />
                  <div className='flex flex-col sm:flex-row sm:items-center'>
                    <p className='body-semibold text-dark300_light700'>
                      {answer.author.name}
                    </p>
                    <p className='small-regular text-light400_light500 mt-0.5 line-clamp-1'>
                      &nbsp;-&nbsp;answered&nbsp;
                      {getTimestamp(answer.createdAt)}
                    </p>
                  </div>
                </Link>
                <div className='flex justify-end'>
                  <Votes
                    type='Answer'
                    itemId={JSON.stringify(answer._id)}
                    userId={JSON.stringify(userId)}
                    upVotes={answer.upvotes.length}
                    isUpVoted={hasUserVoted(answer.upvotes, userId)}
                    downVotes={answer.downvotes.length}
                    isDownVoted={hasUserVoted(answer.downvotes, userId)}
                  />
                </div>
              </div>
            </div>
            <ParseHTML data={answer.content} />
          </article>
        ))}

        <div className='mt-5'>
          <Pagination isNext={isNext} pageNumber={page ? page : 1} />
        </div>
      </div>
    </div>
  );
};

export default AllAnswers;
