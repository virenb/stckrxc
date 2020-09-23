import { Box, Flex, Link } from '@chakra-ui/core';
import React from 'react';
import NextLink from 'next/link';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  return (
    <Flex bg='darkorange' p={2}>
      stckrxc
      <Box ml={'auto'}>
        <NextLink href='/login'>
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href='register'>
          <Link>Register</Link>
        </NextLink>
      </Box>
    </Flex>
  );
};
