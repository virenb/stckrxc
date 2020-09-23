import { Box, Button, Flex, Link } from '@chakra-ui/core';
import React from 'react';
import NextLink from 'next/link';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });

  let body = null;

  // data is loading
  if (fetching) {
    // user is not logged in
  } else if (!data?.me) {
    body = (
      <>
        <Box ml={'auto'}>
          <NextLink href='/login'>
            <Link mr={2}>Login</Link>
          </NextLink>
          <NextLink href='register'>
            <Link>Register</Link>
          </NextLink>
        </Box>
      </>
    );
    // user is logged in
  } else {
    body = (
      <Flex ml={'auto'}>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          onClick={() => {
            logout();
          }}
          isLoading={logoutFetching}
          variant='link'
        >
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex bg='darkorange' p={2}>
      stckrxc
      {body}
    </Flex>
  );
};
