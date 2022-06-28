import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { FiCalendar, FiUser } from 'react-icons/fi';

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

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [listPosts, setListPosts] = useState<Post[]>(postsPagination.results);
  const [nextPostPage, setNextPostPage] = useState<string | null>(
    postsPagination.next_page || null
  );

  async function handleLoadMorePosts(): Promise<void> {
    await fetch(nextPostPage)
      .then(response => {
        response.json().then(resultJson => {
          setNextPostPage(resultJson.next_page || null);
          const newPosts = resultJson.results.map((post: Post) => {
            return {
              uid: post.uid,
              first_publication_date: format(
                new Date(post.first_publication_date),
                'dd MMM yyyy',
                { locale: ptBR }
              ),
              data: {
                title: post.data.title,
                subtitle: post.data.subtitle,
                author: post.data.author,
              },
            };
          });

          setListPosts([...listPosts, ...newPosts]);
        });
      })
      .catch(error => {
        throw new Error(error);
      });
  }

  return (
    <>
      <Head>
        <title>Posts | SpaceTraveling</title>
      </Head>

      <main className={commonStyles.container}>
        <div className={styles.posts}>
          {listPosts.map(post => (
            <Link href={`/post/${post.uid}`} key={post.uid}>
              <a>
                <strong>{post.data.title}</strong>
                <p>{post.data.subtitle}</p>

                <div className={commonStyles.postInfo}>
                  <FiCalendar />
                  <time>{post.first_publication_date}</time>
                  <FiUser />
                  <span>{post.data.author}</span>
                </div>
              </a>
            </Link>
          ))}
        </div>
        {nextPostPage && (
          <button
            type="button"
            className={styles.btnLoadMorePosts}
            onClick={handleLoadMorePosts}
          >
            Carregar mais posts
          </button>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const response = await prismic.getByType('post', {
    pageSize: 2,
    orderings: {
      field: 'document.first_publication_date',
      direction: 'desc',
    },
  });

  const postsResponse: Post[] = response.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd MMM yyyy',
        { locale: ptBR }
      ),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  return {
    props: {
      postsPagination: {
        results: postsResponse,
        next_page: response.next_page,
      },
    },
  };
};
