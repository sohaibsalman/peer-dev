"use client";
import { HomePageFilters } from "@/constants/filters";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { formUrlQuery } from '@/lib/utils';

const HomeFilters = () => {
  const [active, setActive] = useState('newest');
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleTypeClick = (item: string) => {
    let value;

    if (active === item) {
      setActive('');
      value = null;
    } else {
      setActive(item);
      value = item.toLowerCase();
    }

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'filter',
      value,
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className='mt-10 flex-wrap gap-3 md:flex hidden'>
      {HomePageFilters.map((item) => (
        <Button
          key={item.value}
          onClick={() => {
            handleTypeClick(item.value);
          }}
          className={`body-medium rounded-lg px-6 py-3 capitalize 
            shadow-none ${
              active === item.value
                ? 'bg-primary-100 text-primary-500 dark:bg-dark-400'
                : 'bg-light-800 text-light-500 hover:bg-light-700 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-200'
            }`}
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;
