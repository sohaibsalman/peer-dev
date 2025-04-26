import Question from "@/components/forms/Question";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const AskQuestionPage = async () => {
  const userId = "clrk_abc123xyz";

  if (!userId) {
    redirect("sign-in");
  }

  const mongoUser = await getUserById({ userId });

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a question</h1>
      <Question mongoUserId={JSON.stringify(mongoUser._id)} />
    </div>
  );
};

export default AskQuestionPage;
