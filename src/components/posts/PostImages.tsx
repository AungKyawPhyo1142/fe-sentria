import { useState } from 'react'
import ReportDetailModal from './ReportDetailModal'

const fakeUser = {
  name: 'Scarlett Johansson',
  avatar:
    'https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-male-user-profile-vector-illustration-isolated-background-man-profile-sign-business-concept_157943-38764.jpg?semt=ais_hybrid&w=740',
  isVerified: true,
}

const fakeImages = [
  'https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg',
  'https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg',
  'https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg',
  'https://images.pexels.com/photos/709552/pexels-photo-709552.jpeg',
  'https://images.pexels.com/photos/709552/pexels-photo-709552.jpeg',
  'https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg',
  'https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg',
  'https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg',
  'https://images.pexels.com/photos/709552/pexels-photo-709552.jpeg',
  'https://images.pexels.com/photos/709552/pexels-photo-709552.jpeg',
]

const PostImages = ({ images }: { images?: string[] }) => {
  const [showDetail, setShowDetail] = useState(false)
  if (!images || images.length === 0) return null

  const displayImages = images.slice(0, 4)
  const extraImageCount = images.length - displayImages.length

  return (
    <div className='grid grid-cols-4 gap-2'>
      {displayImages.map((image, index) => (
        <div key={index} className='relative'>
          <img
            src={image}
            alt={`Disaster image ${index + 1}`}
            className='aspect-square w-full rounded-xl object-cover transition-opacity duration-150 hover:opacity-90'
          />
          {index === displayImages.length - 1 && extraImageCount > 0 && (
            <div
              onClick={() => setShowDetail(true)}
              className='absolute inset-0 flex cursor-pointer items-center justify-center rounded-xl bg-gray-900/40 text-sm font-semibold text-white backdrop-blur-[1px] transition-colors duration-150 hover:bg-gray-900/50'
            >
              +{extraImageCount}
            </div>
          )}
          {showDetail && (
            <ReportDetailModal
              coords={{ lat: 51.5074, lng: -0.1278 }}
              _id='fake-id'
              isOpen={showDetail}
              setIsOpen={setShowDetail}
              user={fakeUser}
              trustScore={15}
              isDebunked={false}
              location='London, UK'
              title='Severe Earthquake in Central London'
              content='It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.'
              images={fakeImages}
              disasterType='earthquake'
              upvotes={1234}
              downvotes={125}
              comments={12}
              createdAt={new Date(Date.now() - 2 * 60 * 60 * 1000)}
              onUpvote={() => {}}
              onDownvote={() => {}}
              onComment={() => {}}
              reporterId='user123'
              loginUser='user123'
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default PostImages
