import Link from 'next/link';

const Header = () => {
  return (
    <header className='tw-w-full tw-flex tw-flex-row tw-gap-x-2 tw-py-4 tw-px-2 tw-text-lg'>
      <Link href={'/'}>Home</Link>
    </header>
  );
};

export default Header;
