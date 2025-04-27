"use client";

import { downVoteAnswer, upVoteAnswer } from "@/lib/actions/answer.action";
import {
  downVoteQuestion,
  upVoteQuestion,
} from "@/lib/actions/question.action";
import { toggleSaveQuestion } from "@/lib/actions/user.action";
import { formatNumber } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface Props {
  type: "Question" | "Answer";
  itemId: string;
  userId: string;
  upVotes: number;
  isUpVoted: boolean;
  downVotes: number;
  isDownVoted: boolean;
  isSaved?: boolean;
}

const Votes = ({
  type,
  itemId,
  userId,
  upVotes,
  isUpVoted,
  downVotes,
  isDownVoted,
  isSaved,
}: Props) => {
  const pathname = usePathname();

  const handleSave = async () => {
    await toggleSaveQuestion({
      userId: JSON.parse(userId),
      questionId: JSON.parse(itemId),
      path: pathname,
    });
  };

  const handleVote = async (action: "upvote" | "downvote") => {
    if (!userId) return;

    if (action === "upvote") {
      if (type === "Question") {
        await upVoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpVoted: isUpVoted,
          hasDownVoted: isDownVoted,
          path: pathname,
        });
      } else if (type === "Answer") {
        await upVoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpVoted: isUpVoted,
          hasDownVoted: isDownVoted,
          path: pathname,
        });
      }
      return;
    }

    if (action === "downvote") {
      if (type === "Question") {
        await downVoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpVoted: isUpVoted,
          hasDownVoted: isDownVoted,
          path: pathname,
        });
      } else if (type === "Answer") {
        await downVoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasUpVoted: isUpVoted,
          hasDownVoted: isDownVoted,
          path: pathname,
        });
      }
      return;
    }
  };

  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={
              isUpVoted
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upvote.svg"
            }
            width={18}
            height={18}
            onClick={() => handleVote("upvote")}
            alt="upvote"
            className="cursor-pointer"
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatNumber(upVotes)}
            </p>
          </div>
        </div>
        <div className="flex-center gap-1.5">
          <Image
            src={
              isDownVoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            width={18}
            height={18}
            onClick={() => handleVote("downvote")}
            alt="downvote"
            className="cursor-pointer"
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatNumber(downVotes)}
            </p>
          </div>
        </div>
      </div>
      <Image
        src={
          isSaved
            ? "/assets/icons/star-filled.svg"
            : "/assets/icons/star-red.svg"
        }
        width={18}
        height={18}
        onClick={handleSave}
        alt="star"
        className="cursor-pointer"
      />
    </div>
  );
};

export default Votes;
