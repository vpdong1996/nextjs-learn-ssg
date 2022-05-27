import Link from 'next/link';
import React from 'react';

import type { User } from '@/interfaces/user.interface';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';
import { getData, useRequest } from '@/utils/Api';

type PropTypes = {
  users: User[];
};

function UserList({ users }: PropTypes) {
  const { data, isLoading } = useRequest<User[]>(
    'http://localhost:3001/users',
    { fallbackData: users, revalidateOnFocus: false }
  );

  if (isLoading) return <div>Loading....</div>;

  return (
    <>
      <Main
        meta={
          <Meta
            title="Next.js User list"
            description="Next js Boilerplate is the perfect starter code for your project. Build your React application with the Next.js framework."
          />
        }
      >
        {data?.length &&
          data.map((user, index) => (
            <Link key={index} href={`/user/${user.id}`}>
              <div>
                <p>{user.username}</p>
                <p>
                  {user.firstName} - {user.lastName}
                </p>
                <br />
              </div>
            </Link>
          ))}
      </Main>
    </>
  );
}

export async function getStaticProps() {
  const users = await getData('http://localhost:3001/users');

  return {
    props: {
      users,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  };
}

export default UserList;
