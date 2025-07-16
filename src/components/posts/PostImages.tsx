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
// ////////

const PostImages = ({ images }: { images?: string[] }) => {
  if (!images || images.length === 0) return null

  const displayImages = images.slice(0, 4)

  const extraImageCount = images.length - displayImages.length

  const [showDetail, setShowDetail] = useState(false)

  return (
    <div className='mt-1 grid grid-cols-4 gap-3'>
      {displayImages.map((image, index) => (
        <div key={index} className='relative'>
          <img
            src={image}
            alt={`Disaster image ${index + 1}`}
            className='aspect-square w-full rounded-lg object-cover'
          />
          {index === displayImages.length - 1 && extraImageCount > 0 && (
            <div
              onClick={() => setShowDetail(true)}
              className='bg-opacity-50 absolute inset-0 flex items-center justify-center rounded-lg bg-zinc-500/30 text-lg font-semibold text-white hover:cursor-pointer'
            >
              +{extraImageCount}
            </div>
          )}
          {/* SHOW POST DETAIL */}
          {showDetail && (
            <ReportDetailModal
              _id='fake-id'
              isOpen={showDetail}
              setIsOpen={setShowDetail}
              user={fakeUser}
              trustScore={15}
              isDebunked={false}
              location='London, UK'
              title='Severe Earthquake in Central London'
              content={`It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. 
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda, eos. Nemo, maxime aliquid facilis est dolore cupiditate eaque numquam perspiciatis earum voluptate doloribus eveniet, animi nihil odio tempora illum dicta!
               The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters...`}
              images={fakeImages}
              disasterType='earthquake'
              upvotes={1234}
              downvotes={125}
              comments={12}
              createdAt={new Date(Date.now() - 2 * 60 * 60 * 1000)} // 2 hours ago
              onUpvote={() => alert('Upvoted')}
              onDownvote={() => alert('Downvoted')}
              onComment={() => alert('Commented')}
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
