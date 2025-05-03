import Profile from '@/components/forms/Profile';
import { getUserById } from '@/lib/actions/user.action';
import { auth } from '@clerk/nextjs/server';
import { unauthorized } from 'next/navigation';

const ProfileEditPage = async () => {
  const { userId } = await auth();

  if (!userId) return null;

  const mongoUser = await getUserById({ userId });

  if (!mongoUser) return unauthorized();

  return (
    <>
      <h1 className='h1-bold text-dark100_light900'>Edit Profile</h1>
      <div className='mt-9'>
        <Profile clerkId={userId} user={JSON.stringify(mongoUser)} />
      </div>
    </>
  );
};

export default ProfileEditPage;
