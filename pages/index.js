import Head from 'next/head'
import Sidebar from '../components/sidebar/Sidebar'

export default function Home() {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <Head>
        <title>Potyfi</title>
        <meta name="description" content="All your favourite songs are listed here" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className=''>
        <Sidebar />
        {/* Center */}
      </main>

      <div>
        {/* Player */}
      </div>
    </div>
  )
}
