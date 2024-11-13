import React from 'react'
import Image from 'next/image'
import { useLoggedInUserProfile } from '@/entities/user/hooks/userLoggedInUserProfile'

const COLORS = [
  '#2E4057', // midnightNavy
  '#F94144', // persimmonRed
  '#3CAA8F', // jungleGreen
  '#7C3F85', // regalPurple
  '#F9C74F', // marigoldYellow
  '#2B6777', // steelTeal
  '#E76F51', // terracottaOrange
  '#557B83', // blueGray
  '#845EC2', // amethystPurple
  '#4D908E', // jadeTeal
  '#D62839', // carminRed
  '#577590', // atlanticBlue
  '#FF9E00', // tangerineOrange
  '#38A3A5', // aquaTeal
  '#9C528B', // plumPurple
  '#1A936F', // forestGreen
  '#FF477E', // hotPink
  '#564946', // espressoBrown
  '#4361EE', // royalBlue
  '#FF7F51', // coralOrange
  '#2D6A4F', // pineGreen
  '#C9184A', // raspberryRed
  '#48CAE4', // brightTurquoise
  '#B5838D', // mauveRose
  '#FFB700', // honeyYellow
  '#6D597A', // dustyPurple
  '#355070', // indigoBlue
  '#E56B6F', // salmonPink
  '#0B525B', // darkTeal
  '#8338EC' // electricPurple
]

function getBackgroundColorBasedOnName(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  return COLORS[Math.abs(hash) % name.length]
}

function getDisplayNameLetters(name: string): string {
  const words = name.split(' ')
  const letters =
    words.length > 2
      ? words.slice(0, 2).reduce((prev, curr) => {
          return prev + curr.slice(0, 1)
        }, '')
      : words.map((word) => word.slice(0, 1)).join('')

  return letters
}

type UserAvatarSizes = 'sm' | 'base' | 'lg'

interface IProps {
  name: string
  avatarUrl?: string | null
  size?: UserAvatarSizes
  className?: string
}

const sizes: { [key in UserAvatarSizes]: string } = {
  sm: 'size-12 text-lg',
  base: 'size-14 text-xl',
  lg: 'size-24 text-2xl'
}

function UserAvatar({ size = 'base', avatarUrl, name, className }: IProps) {
  const classes = ['relative rounded-full overflow-hidden']
  size && classes.push(sizes[size])
  className && classes.push(className)

  const defaultAvatarLetters = getDisplayNameLetters(name)
  const backgroundColor = getBackgroundColorBasedOnName(name)

  return (
    <div className={classes.join(' ')}>
      {avatarUrl ? (
        <Image src={avatarUrl} alt='user avatar' className='object-fit size-full' width={100} height={100} />
      ) : (
        <div style={{ backgroundColor }} className='flex size-full items-center justify-center'>
          <span className='block h-auto font-medium text-white'>{defaultAvatarLetters}</span>
        </div>
      )}
    </div>
  )
}

export default UserAvatar
