'use client'

import { tw } from "@/lib/tw"
import ScrollButton from "./ScrollButton"

interface Props {
  withNav?: boolean
}

export default function ScrollButtonGroup({withNav = false}: Props){
  return (
    <div className={tw('sticky flex justify-end pointer-events-none', withNav ? 'bottom-[calc(65px+16px)]':'bottom-4')}>
      <div className='flex flex-col gap-2 pointer-events-auto'>
        <ScrollButton direction="top" />
        <ScrollButton direction="bottom" />
      </div>
    </div>
  )
}