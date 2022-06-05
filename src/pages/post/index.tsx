import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { FiCalendar, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../../services/prismic';

import styles from './styles.module.scss';

interface Post {
  slug: string;
  updatedAt: string;
  title: string;
  subtitle: string;
  author: string;
}

interface ListPostsProps {
  postsList: Post[];
}

export default function ListPosts({ postsList }: ListPostsProps): JSX.Element {
  return (
    <>
      <Head>
        <title>Posts | SpaceTraveling</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {postsList.map(post => (
            <Link href={`/post/${post.slug}`} key={post.slug}>
              <a>
                <strong>{post.title}</strong>
                <p>{post.subtitle}</p>

                <div className={styles.postInfo}>
                  <FiCalendar />
                  <time>{post.updatedAt}</time>
                  <FiUser />
                  <span>{post.author}</span>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const response = await prismic.getByType('post', {
    pageSize: 5,
  });

  console.log(response);

  const postsResponse = response.results.map(post => {
    return {
      slug: post.uid,
      updatedAt: format(new Date(post.last_publication_date), 'dd MMM yyyy', {
        locale: ptBR,
      }),
      title: post.data.title,
      subtitle: post.data.subtitle,
      author: post.data.author,
    };
  });

  return {
    props: {
      postsList: postsResponse,
    },
  };
};
