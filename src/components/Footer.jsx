import { useGSAP } from '@gsap/react'
import React from 'react'
import gsap from 'gsap'
export const Footer = () => {
  useGSAP(() => {
    gsap.to('.footer', {
        scrollTrigger: {
            trigger: '.footer',
            toggleActions: 'play pause reverse restart'
        },
        opacity: 1,
        duration: 2
    })
  }, [])
  return (
    <footer className='screen-max-width footer'>
        <div className='bg-neutral-700 w-full h-[1px]'></div>
        <div className='flex items-center justify-center p-12'>
            <h3 className='text-4xl font-extrabold'>More Coming Soon</h3>
        </div>
    </footer>
  )
}
