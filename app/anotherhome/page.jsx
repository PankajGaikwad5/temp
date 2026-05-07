import dynamic from 'next/dynamic'

const HeroPage = dynamic(() => import('../../components/HeroPage'), { ssr: false })

export default function Page() {
  return (
    <div className='overflow-hidden'>
      <HeroPage />
    </div>
  )
}