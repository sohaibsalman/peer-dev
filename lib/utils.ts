import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from 'query-string';
import { Query } from 'mongoose';
import { PaginateOptions, PaginateResult } from './actions/shared.types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimestamp = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
};

export const formatNumber = (num: number): string => {
  if (!num) {
    return '0';
  } else if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  } else {
    return num.toString();
  }
};

export function getJoinedDate(date: Date): string {
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}

export const formUrlQuery = ({
  params,
  key,
  value,
}: {
  params: string;
  key: string;
  value: string | null;
}) => {
  const currentUrl = qs.parse(params);
  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

export const removeKeysFromQuery = ({
  params,
  keysToRemove: keys,
}: {
  params: string;
  keysToRemove: string[];
}) => {
  const currentUrl = qs.parse(params);

  keys.forEach((key) => delete currentUrl[key]);

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};

export async function paginate<T>(
  query: Query<T[], T>,
  options: PaginateOptions
): Promise<PaginateResult<T>> {
  const { page = 1, pageSize = 10 } = options;
  const skip = (page - 1) * pageSize;

  const data = await query.skip(skip).limit(pageSize).exec();

  const totalCount = await query.model.countDocuments(query.getQuery()).exec();
  const isNext = totalCount > skip + data.length;

  return { data, isNext, totalCount };
}
