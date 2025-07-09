import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import LanguageToggle from '@/components/common/LanguageToggle'
import Map from '@/components/common/Map'
import { MapFilterProvider } from '@/components/common/MapFilterContext'
// import PostCard from '@/components/posts/PostCard'
import ActivityPostCard from '@/components/posts/ActivityPostCard'
import ResourceCard from '@/components/resources/ResourceCard'
import CreateResourceModal from '@/components/resources/CreateResourceModal'
import { AppConstantRoutes } from '@/services/routes/path'
import {
  decrement,
  increment,
  selectCount,
  useCountStore,
} from '@/zustand/countStore'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { useState } from 'react'

// const samplePosts = [
//   {
//     id: '1',
//     user: {
//       name: 'Scarlett Johansson',
//       avatar: null,
//       isVerified: true,
//     },
//     trustScore: 19,
//     isDebunked: true,
//     location: 'London, UK',
//     content:
//       'Itis a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English.',
//     images: [
//       'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400',
//       'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400',
//       'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400',
//       'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=400',
//     ],
//     disasterType: 'storm' as const,
//     upvotes: 3800,
//     downvotes: 1200,
//     comments: 8120,
//     createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
//   },
//   {
//     id: '2',
//     user: {
//       name: 'John Doe',
//       avatar: null,
//       isVerified: false,
//     },
//     trustScore: 80,
//     isDebunked: false,
//     location: 'London',
//     content:
//       'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
//     images: [
//       'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400',
//       'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400',
//     ],
//     disasterType: 'flood' as const,
//     upvotes: 1000,
//     downvotes: 1200,
//     comments: 4350,
//     createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
//   },
// ]

const sampleActivityFeedPosts = [
  {
    id: '1',
    user: {
      name: 'Scarlett Johansson',
      avatar: null,
      isVerified: true,
    },

    location: 'London, UK',
    content:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English.',

    helpType: 'Offering Help' as const,
    offeredHelp: ['water', 'food', 'shelter'],

    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: '2',
    user: {
      name: 'Scarlett Johansson',
      avatar: null,
      isVerified: true,
    },

    location: 'London, UK',
    content:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English.',

    helpType: 'Need Help' as const,
    offeredHelp: ['water', 'food', 'shelter'],

    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
]

const sampleResources = [
  {
    id: '1',
    user: {
      name: 'Scarlett Johansson',
      avatar: null,
      isVerified: true,
    },

    location: 'London, UK',
    content:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English.',

    resourceTypes: ['survival', 'hotline', 'first aid'],
    hotlineNumbers: ['123-456-7890', '987-654-3210'],
    hotlineEmail: 'support@example.com',
    images: [
      'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400',
      'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400',
    ],

    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: '2',
    user: {
      name: 'Scarlett Johansson',
      avatar: null,
      isVerified: true,
    },

    location: 'London, UK',
    content:
      'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here, making it look like readable English.',

    resourceTypes: ['hotline', 'survival'],
    images: [
      'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400',
    ],

    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
]

const Example = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const count = useCountStore(selectCount)
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className='fade-in flex h-screen flex-col bg-white'>
      <div className='w-96 rounded-xl border border-black/30 bg-white p-8'>
        <div className='flex flex-col gap-4'>
          <h2 className='mb-6 text-center text-2xl font-bold'>
            Example & Count: {count}
          </h2>
          <div className='flex items-center gap-4'>
            <button
              onClick={() => increment()}
              className='bg-primary w-[200px] rounded py-2 text-center text-white'
            >
              Increase
            </button>
            <button
              onClick={() => decrement()}
              className='bg-red w-[200px] rounded py-2 text-center text-white'
            >
              Decrease
            </button>
          </div>
        </div>
        <div className='mt-5 flex flex-col gap-y-3 rounded p-10'>
          <LanguageToggle />
          <p>
            {t('common.greeting', {
              name: 'Aung',
            })}
          </p>
          <p>
            {t('error.common.mandatory', {
              field: 'Name',
            })}
          </p>
        </div>
        <div className='mt-5 flex flex-col gap-y-3 rounded p-10'>
          <Input placeholder='example' />
          {/* <Input placeholder='Password' type='password' /> */}
          <Button primary>Primary Button</Button>
          <Button secondary>Secondary Button</Button>
          <Button destructive>Destructive Button</Button>
          <Button outline>Outline Button</Button>
        </div>
        <div className='mt-10 border-t border-black pt-4'>
          <button
            onClick={() => navigate(AppConstantRoutes.paths.auth.login)}
            className='bg-primary w-[200px] rounded py-2 text-center text-white'
          >
            Go to Login
          </button>
        </div>
      </div>
      {/* Sample Post Cards */}
      {/* <div className='mt-10 flex w-full flex-col items-center gap-y-4'>
        {samplePosts.map((post, index) => (
          <PostCard
            key={index}
            {...post}
            onUpvote={() => alert('Upvoted post')}
            onDownvote={() => alert('Downvoted post')}
            onComment={() => alert('Comment on post')}
          />
        ))}
      </div> */}

      {/* Sample activity feed Cards */}
      <div className='mt-10 flex w-full flex-col items-center gap-y-4'>
        {sampleActivityFeedPosts.map((resource, index) => (
          <ActivityPostCard key={index} {...resource} />
        ))}
      </div>
      {/* Sample Resource Cards */}
      <div className='mt-10 flex w-full flex-col items-center gap-y-4'>
        {sampleResources.map((resource, index) => (
          <ResourceCard key={index} {...resource} />
        ))}
      </div>

      {/* Resource Modal */}
      <div className='mt-10 flex w-full flex-col items-center gap-y-4'>
        <CreateResourceModal isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>

      {/*Map component*/}
      <div className='flex w-full flex-row items-start p-10'>
        <MapFilterProvider>
          <Map />
        </MapFilterProvider>
      </div>
    </div>
  )
}

export default Example
