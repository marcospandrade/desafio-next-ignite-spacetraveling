import { asHTML, asText } from '@prismicio/helpers';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface ContentProps {
  heading: string;
  body: {
    text: string;
  }[];
}

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: ContentProps[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();
  const [timeReading, setTimeReading] = useState<string>('');
  console.log(post);
  const calculateReadingTime = useCallback(() => {
    const wordsPerMinute = 200;
    // const words = post.data.content.reduce((acc, content) => {
    //   const sectionHeadingLength = content.heading.trim().length;
    //   const sectionBodyLength = content.body.reduce((accBody, body) => {
    //     return accBody + body.text.trim().length;
    //   }, 0);
    //   console.log('content.body', content.body);
    //   // const sectionBodyLength = content.body.map(() => {

    //   // })
    //   return acc + (sectionHeadingLength + sectionBodyLength);
    // }, 0);

    // const minutes = Math.ceil(words / wordsPerMinute);
    setTimeReading(`${'minutes'} min`);
  }, [post.data.content]);

  useEffect(() => {
    calculateReadingTime();
  }, [calculateReadingTime, post]);

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  return (
    <>
      <Head>
        <title>{`Space T - ${post.data.title}`}</title>
      </Head>
      <img
        className={styles.banner}
        src={post?.data.banner.url}
        alt={post.data.title}
        height={400}
        width="100%"
      />
      <div className={commonStyles.container}>
        <h2 className={styles.headline}>{post?.data.title || 'Sem titulo'}</h2>
        <div className={commonStyles.postInfo}>
          <FiCalendar />
          <time>
            {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
              locale: ptBR,
            })}
          </time>
          <FiUser />
          <span>{post.data.author}</span>
          <FiClock />
          <span>{timeReading}</span>
        </div>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('post');

  const postsPaths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    paths: postsPaths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('post', String(slug), {});

  const PostInfo: Post = {
    first_publication_date: format(
      new Date(response.first_publication_date),
      'dd MMM yyyy',
      {
        locale: ptBR,
      }
    ),
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content,
    },
  };

  return {
    props: {
      post: PostInfo,
    },
    redirect: 60 * 30, // 30 minutes
  };
};
