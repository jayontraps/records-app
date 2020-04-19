import Link from 'next/link';

const Nav = () => (
  <div>
    <Link href="/create">
      <a>Create</a>
    </Link>
    <Link href="/">
      <a>Dashboard</a>
    </Link>
  </div>
);

export default Nav;
