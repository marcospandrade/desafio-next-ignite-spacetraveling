import Image from 'next/image';
import Link from 'next/link';
import { ActiveLink } from '../ActiveLink';
import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/">
          <a>
            <Image src="/images/logo.svg" alt="logo" height={26} width={210} />
          </a>
        </Link>
        <nav>
          <ActiveLink href="/" activeClassName={styles.active}>
            <a>Home</a>
          </ActiveLink>
          <ActiveLink href="/posts" activeClassName={styles.active}>
            <a>Posts</a>
          </ActiveLink>
          <ActiveLink href="/contact" activeClassName={styles.active}>
            <a>Contact</a>
          </ActiveLink>
        </nav>
      </div>
    </header>
  );
}
