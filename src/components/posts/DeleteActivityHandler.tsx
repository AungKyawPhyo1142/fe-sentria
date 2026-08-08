import { useState } from 'react'
import { useDeleteActivity } from '@/services/network/lib/activity'
import DeleteConfirmationModal from './DeleteConfirmationModal'

interface DeleteActivityHandlerProps {
  children: (deleteHandler: (id: string) => void) => React.ReactNode
}

export const DeleteActivityHandler: React.FC<DeleteActivityHandlerProps> = ({
  children,
}) => {
  const [deletingId, setDeletingId] = useState<string>('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string>('')

  const deleteActivityMutation = useDeleteActivity(deletingId)

  const handleDelete = (id: string) => {
    setPendingDeleteId(id)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    setDeletingId(pendingDeleteId)
    deleteActivityMutation.mutate(undefined, {
      onSuccess: () => {
        console.log('Activity deleted successfully')
        setShowDeleteModal(false)
        setPendingDeleteId('')
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

  const cancelDelete = () => {
    setShowDeleteModal(false)
    setPendingDeleteId('')
  }

  return (
    <>
      {children(handleDelete)}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        isDeleting={deleteActivityMutation.isPending}
      />
    </>
  )
}

export default DeleteActivityHandler
