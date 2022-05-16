import Head from 'next/head';
import Link from 'next/link';

import { FiCalendar, FiUser } from 'react-icons/fi';

import styles from './styles.module.scss';

export default function ListPosts(): JSX.Element {
  return (
    <>
      <Head>
        <title>Posts | SpaceTraveling</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <Link href="/">
            <a>
              <strong>Criando um app CRA do zero</strong>
              <p>Pensando em sincronização em vez de ciclos de vida.</p>

              <div className={styles.postInfo}>
                <FiCalendar />
                <time>16 Jun 2022</time>
                <FiUser />
                <span>Marcos Andrade</span>
              </div>
            </a>
          </Link>

          <Link href="/">
            <a>
              <strong>Criando um app CRA do zero</strong>
              <p>SUBTITLE</p>

              <div className={styles.postInfo}>
                <FiCalendar />
                <time>16 Jun 2022</time>
                <FiUser />
                <span>Marcos Andrade</span>
              </div>
            </a>
          </Link>
        </div>
      </main>
    </>
  );
}
