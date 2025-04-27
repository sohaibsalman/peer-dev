import React from "react";
import { QuestionProps } from "@/types";
import Link from "next/link";
import RenderTag from "../shared/RenderTag";
import Metric from "../shared/Metric";
import { formatNumber, getTimestamp } from "@/lib/utils";

interface Props {
  question: QuestionProps;
}

const QuestionCard = ({ question }: Props) => {
  return (
    <div className="card-wrapper p-9 sm:px-11 rounded-[10px]">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
          {getTimestamp(question.createdAt)}
        </span>
        <Link href={`/question/${question._id}`}>
          <h3 className="sm:h3-semi-bold base-semibold text-dark200_light900 line-clamp-1 flex-1">
            {question.title}
          </h3>
        </Link>
      </div>
      {/* TODO: if signed in and owner, add edit delete action */}
      <div className="mt-3.5 flex flex-wrap gap-2">
        {question.tags.map((tag) => (
          <RenderTag key={tag._id} id={tag._id} name={tag.name} />
        ))}
      </div>

      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={question.author.picture}
          alt="user"
          value={question.author.name}
          title={` - asked ${getTimestamp(question.createdAt)}`}
          href={`/profile/${question.author._id}`}
          isAuthor
          textStyles="body-medium text-dark400_light700"
        />
        <Metric
          imgUrl="/assets/icons/like.svg"
          alt="UpVotes"
          value={formatNumber(question.upvotes.length)}
          title=" Votes"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="Message"
          value={formatNumber(question.answers.length)}
          title=" Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="Eye"
          value={formatNumber(question.views)}
          title=" Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>
    </div>
  );
};

export default QuestionCard;
