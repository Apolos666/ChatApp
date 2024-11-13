import React, { useRef, useEffect, useState, Dispatch, SetStateAction } from 'react'
import UserAvatar from '../user-avatar'
import { IoCameraOutline } from 'react-icons/io5'
import { useLoggedInUserProfile } from '@/entities/user/hooks/userLoggedInUserProfile'
import { toastError, toastSuccess } from '@/components/shared/Toast'
import { useUpdateLoggedUserAvatarMutation } from './updateAvatar.mutation'
import { UserQueries } from '@/entities/user'
import { queryClient } from '@/providers/query-provider'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

function UploadAvatarButton({ setUpdatingAvatar }: { setUpdatingAvatar: Dispatch<SetStateAction<boolean>> }) {
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { mutate: updateAvatar, isPending } = useUpdateLoggedUserAvatarMutation({
    onMutate: () => {
      setUpdatingAvatar(true)
    },
    onSuccess: async () => {
      toastSuccess("Update user's avatar successfully!")
      queryClient.invalidateQueries({
        queryKey: UserQueries.loggedInUserProfileQuery().queryKey
      })
    },
    onError: (error) => {
      console.log(error)
    },
    onSettled: () => {
      setUpdatingAvatar(false)
    }
  })

  const validFileExtensions = ['jpg', 'png', 'jfif']

  const handleInputFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const selectedFile = files[0]
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase()

      if (fileExtension && validFileExtensions.includes(fileExtension)) {
        const formData = new FormData()
        formData.append('file', selectedFile)
        updateAvatar(formData)
      } else {
        toastError('Selected file is not a valid image format.')
      }
    }
  }

  useEffect(() => {
    const handleClickInputFile = () => {
      if (inputRef && inputRef.current) {
        const inputFileElement = inputRef.current
        inputFileElement?.click()
      }
    }

    ref.current?.addEventListener('click', handleClickInputFile)

    return () => {
      ref.current?.removeEventListener('click', handleClickInputFile)
    }
  }, [ref, inputRef])

  return (
    <div
      ref={ref}
      className='group absolute bottom-0 right-[-10px] z-20 flex size-10 cursor-pointer items-center justify-center rounded-full border border-2 bg-gray-400 hover:bg-gray-300'
    >
      <IoCameraOutline className='text-xl text-white group-hover:text-black' />
      <input ref={inputRef} type='file' className='hidden' onChange={handleInputFileChange}></input>
    </div>
  )
}

function UserAvatarPanel() {
  const { data } = useLoggedInUserProfile()
  const { name = '', avatar = '' } = data || {}
  const [isUpdatingAvatar, setUpdatingAvatar] = useState(false)

  return (
    <div className='flex w-full items-center justify-center'>
      <div className='relative'>
        <UserAvatar name={name} size='lg' avatarUrl={avatar} />
        <UploadAvatarButton setUpdatingAvatar={setUpdatingAvatar} />
        {isUpdatingAvatar && (
          <div className='absolute inset-0 top-0 z-10 flex size-full items-center justify-center rounded-full bg-white opacity-80'>
            <AiOutlineLoading3Quarters className='animate-spin text-xl text-black' />
          </div>
        )}
      </div>
    </div>
  )
}

export default UserAvatarPanel
