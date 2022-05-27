import type { GetStaticPropsContext } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

import type { User } from '@/interfaces/user.interface';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';
import { getData, useRequest } from '@/utils/Api';
import cache from '@/utils/cache';

type PropTypes = {
  user: User;
};
function UserDetail({ user }: PropTypes) {
  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading } = useRequest<User>(
    `http://localhost:3001/users/${id}`,
    {
      fallbackData: user,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 3600000,
    }
  );

  if (isLoading) return <div>Loading....</div>;

  return (
    <>
      <Main
        meta={
          <Meta
            title={`NextJS - ${data?.username ?? ''} profile`}
            description="Next js Boilerplate is the perfect starter code for your project. Build your React application with the Next.js framework."
          />
        }
      >
        {data && (
          <div className="container">
            <p>{data.username}</p>
            <p>
              {data.firstName} - {data.lastName}
            </p>
            <br />
          </div>
        )}
      </Main>
    </>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  let user: User | undefined;
  if (process.env.USE_CACHE) {
    user = await cache.get<User>(context.params?.id as string, 'user');
  } else {
    user = await getData(`http://localhost:3001/users/${context.params?.id}`);
  }

  return {
    props: {
      user,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  };
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// the path has not been generated.

export async function getStaticPaths() {
  const users: User[] = await getData('http://localhost:3001/users');
  const data: Record<string, User> = {};
  // Get the paths we want to pre-render based on users
  const paths = Array.isArray(users)
    ? users.map((user) => {
        data[user.id] = user;
        return {
          params: { id: user.id.toString() },
        };
      })
    : null;

  if (Object.keys(data).length) {
    await cache.set(data, 'user');
  }
  // We'll pre-render only these paths at build time.
  // {fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: 'blocking' };
}

export default UserDetail;
