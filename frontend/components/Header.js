import Link from 'next/link';
import Nav from './Nav';

const Header = () => (
  <div>
    <div className="bar">
      <Link href="/"><a>Reacords app</a></Link>
      <Nav />
    </div>    
  </div>
);

export default Header;
