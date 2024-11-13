import { toast } from 'sonner'
import { MdOutlineErrorOutline } from 'react-icons/md'
import { FaRegCircleCheck } from 'react-icons/fa6'

const toastSuccess = (content: string, title?: string) => {
  const toastErrorContent = (
    <div className='flex items-start gap-2 rounded-sm'>
      <FaRegCircleCheck className='text-[24px] text-green-500' />
      <div className='flex flex-col gap-px'>
        <h4 className='text-sm font-semibold text-black'>{title || ''}</h4>
        <p className='text-sm text-black'>{content}</p>
      </div>
    </div>
  )

  toast(toastErrorContent, {
    style: {
      borderRadius: '4px',
      padding: '20px'
    },
    closeButton: true
  })
}

const toastError = (content: string, title?: string) => {
  const toastErrorContent = (
    <div className='flex items-start gap-2 rounded-sm'>
      <MdOutlineErrorOutline className='text-[24px] text-red-500' />
      <div className='flex flex-col gap-px'>
        <h4 className='text-sm font-semibold text-black'>{title || ''}</h4>
        <p className='text-sm text-black'>{content}</p>
      </div>
    </div>
  )

  toast(toastErrorContent, {
    style: {
      borderRadius: '4px',
      padding: '20px'
    },
    closeButton: true
  })
}

export { toastError, toastSuccess }
