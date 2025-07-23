import { useState } from 'react'
import { useDeleteActivity } from '@/services/network/lib/activity'

interface DeleteActivityHandlerProps {
  children: (deleteHandler: (id: string) => void) => React.ReactNode
}

export const DeleteActivityHandler: React.FC<DeleteActivityHandlerProps> = ({
  children,
}) => {
  const [deletingId, setDeletingId] = useState<string>('')

  const deleteActivityMutation = useDeleteActivity(deletingId)

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      setDeletingId(id)
      deleteActivityMutation.mutate(undefined, {
        onSuccess: () => {
          console.log('Activity deleted successfully')
        },
        onError: (error) => {
          console.error('Error deleting activity:', error)
          alert('Failed to delete activity. Please try again.')
        },
        onSettled: () => {
          setDeletingId('')
        },
      })
    }
  }

  return <>{children(handleDelete)}</>
}

export default DeleteActivityHandler
