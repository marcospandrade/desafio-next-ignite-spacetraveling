import { GetStaticProps } from 'next';
import Head from 'next/head';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

interface TesteProps {
  posts: Post[];
}

export default function Home({ posts }: TesteProps): JSX.Element {
  return (
    <>
      <Head>
        <title>Home | SpaceTraveling</title>
      </Head>
      <h1>Hello World</h1>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  // const postsResponse = await prismic.getByType('post', {
  //   pageSize: 2,
  // });

  // TODO

  return {
    props: {
      posts: 'MARQUINDJ',
    },
  };
};
