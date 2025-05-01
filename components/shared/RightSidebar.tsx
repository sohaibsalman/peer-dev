import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTag from "./RenderTag";

const hotQuestions = [
  {
    _id: '1',
    title: 'What is the difference between == and === in JavaScript?',
  },
  {
    _id: '2',
    title: 'Explain the concept of closures in JavaScript. How do they work?',
  },
  {
    _id: '3',
    title:
      'What are the key differences between synchronous and asynchronous programming?',
  },
  {
    _id: '4',
    title:
      'How does garbage collection work in high-level languages like Java or JavaScript?',
  },
  {
    _id: '5',
    title: 'What is the difference between REST and GraphQL APIs?',
  },
];

const popularTags = [
  {
    _id: "1",
    name: "Javascript",
    totalQuestions: 50,
  },
  {
    _id: "2",
    name: "React",
    totalQuestions: 15,
  },
  {
    _id: "3",
    name: "Next",
    totalQuestions: 53,
  },
  {
    _id: "4",
    name: ".NET",
    totalQuestions: 99,
  },
  {
    _id: "5",
    name: "C#",
    totalQuestions: 5,
  },
];

const RightSidebar = () => {
  return (
    <section
      className="background-light900_dark200 light-border 
  sticky right-0 top-0 flex h-screen flex-col
  overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none 
  max-xl:hidden w-[350px] custom-scrollbar"
    >
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {hotQuestions.map((question) => (
            <Link
              href={`/questions/${question._id}`}
              key={question._id}
              className="flex items-center gap-7 justify-between cursor-pointer"
            >
              <p className="body-medium text-dark500_light700">
                {question.title}
              </p>
              <Image
                src="/assets/icons/chevron-right.svg"
                alt="chevron right"
                width={20}
                height={20}
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <div className="mt-7 flex flex-col gap-4">
          {popularTags.map((tag) => (
            <RenderTag
              key={tag._id}
              id={tag._id}
              name={tag.name}
              totalQuestions={tag.totalQuestions}
              showCount
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
