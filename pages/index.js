import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/askvelvet');
    }, 1500);
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#fdfaf6] font-[Outfit] text-center px-4">
      <div className="animate-pulse">
        <h1 className="text-3xl sm:text-4xl font-semibold text-[#2c2c2c] mb-2">
          Loading Velvet...
        </h1>
        <p className="text-[#888]">Bringing elegance to your screen ✨</p>
      </div>
    </main>
  );
}
