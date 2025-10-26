import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import LanguageToggle from '@/components/common/LanguageToggle'
import Map from '@/components/common/Map'
import { MapFilterProvider } from '@/components/common/MapFilterContext'
// import ActivityPostCard from '@/components/posts/ActivityPostCard'
// import ResourceCard from '@/components/resources/ResourceCard'
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
import ActivityPostModal from '@/components/posts/ActivityPostModal'
import LogoLoader from '@/components/common/LogoLoader'
import NoDataStatement from '@/components/common/NoDataStatement'
import ErrorFetch from '@/components/common/ErrorFetch'

const Example = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const count = useCountStore(selectCount)
  const [isCreateResourceModalOpen, setIsCreateResourceModalOpen] =
    useState(false)
  const [isActivityFeedModalOpen, setIsActivityFeedModalOpen] = useState(false)

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

      {/* open modals */}
      <button
        className='bg-secondary'
        onClick={() => {
          setIsActivityFeedModalOpen(true)
        }}
      >
        Open Activity Post Modal
      </button>
      <button
        className='bg-primary'
        onClick={() => {
          setIsCreateResourceModalOpen(true)
        }}
      >
        Open Create Resource Modal
      </button>

      {/* Sample Post Cards */}

      <ActivityPostModal
        isOpen={isActivityFeedModalOpen}
        setIsOpen={setIsActivityFeedModalOpen}
        onSubmit={(data) => {
          console.log('Activity data:', data)
          // Handle the form submission
        }}
      />

      {/* Sample activity feed Cards */}
      <div>Sample activity feed Cards</div>
      {/* <div className='mt-10 flex w-full flex-col items-center gap-y-4'>
        {sampleActivityFeedPosts.map((resource, index) => (
          <ActivityPostCard key={index} {...resource} />
        ))}
      </div> */}
      {/* Sample Resource Cards */}
      <div>Sample Resource Cards</div>
      {/* <div className='mt-10 flex w-full flex-col items-center gap-y-4'>
        {sampleResources.map((resource, index) => (
          <ResourceCard
            key={index}
            user={resource.user}
            location={resource.location}
            description={resource.content}
            resourceTypes={resource.resourceTypes}
          />
        ))}
      </div> */}

      {/* Resource Modal */}
      <div className='mt-10 flex w-full flex-col items-center gap-y-4'>
        <CreateResourceModal
          isOpen={isCreateResourceModalOpen}
          setIsOpen={setIsCreateResourceModalOpen}
        />
      </div>

      {/*Map component*/}
      <div className='flex w-full flex-row items-start p-10'>
        <MapFilterProvider>
          <Map />
        </MapFilterProvider>
      </div>
      {/* Logo */}
      <LogoLoader />
      {/*  */}
      <NoDataStatement
        heading='No Disaster Report Found'
        subHeading="There's nothing here yet! Start by adding your first disaster report post."
      />
      <br />
      <ErrorFetch
        heading='Try Again!'
        subHeading='Error data fetch'
        reFetch={() => console.log('refetch')}
      />
      <br />
    </div>
  )
}

export default Example
