import clsx from 'clsx'
import { ChevronDown, CloudUpload, X } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import Button from './Button'
import MapSelector, { LocationCoordinates } from './MapSelector'
import { useTranslation } from 'react-i18next'
import Input from './Input'
// import { PlaceInfo } from '@/services/network/lib/disasterReport'
import { array, mixed, number, object, ObjectSchema, string } from 'yup'
import { useFormik } from 'formik'
import { useCustomEvents } from '@/services/formik/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/services/network/apiClient'
import { ApiConstantRoutes } from '@/services/network/path'
import { ReverseGeocodeResponse } from '@/services/network/lib/report'
import {
  selectUserCurrentLocation,
  useUserCurrentLocationStore,
} from '@/zustand/userCurrentLocationStore'
import { useCreateDisasterReport } from '@/services/network/lib/disasterReport'

// Create Post Modal Interfaace
interface createPostProps {
  className?: string
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

//animation effects
export const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}
export const modalVariants = {
  hidden: { opacity: 0, scale: 0.8, y: -50 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 200,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.85,
    y: 40,
    transition: {
      duration: 0.2,
      ease: 'easeInOut' as const,
    },
  },
}

// select disaster type
export interface DisasterOption {
  value: string
  label: string
}
// disaster type select
export interface DisasterTypeSelectOption {
  onSelect: (selectedValue: string) => void
  initialValue?: string
}

interface CreateReportParameters {
  description: string
  incidentType: 'EARTHQUAKE' | 'FLOOD' | 'FIRE' | 'STORM' | 'OTHER'
  severity: 'UNKNOWN' | 'MINOR' | 'MODERATE' | 'SEVERE'
  incidentTimestamp: string
  location: {
    city: string
    country: string
    latitude: number
    longitude: number
  }
  media: string[] | null //tbh it should be removed from be, just leave it for now like this
}

export interface CreateReportFormValues {
  reportImage: File[] | null
  reportType: 'DISASTER_INCIDENT' // add more later if needed
  name: string
  parameters: CreateReportParameters
}

// Create Post Modal
const CreatePostModal: React.FC<createPostProps> = ({
  className,
  isOpen,
  setIsOpen,
}) => {
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [isGeocoding, setIsGeocoding] = useState(false)
  const hasFetchedInitialLocation = useRef(false)
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const userCurrentLocation = useUserCurrentLocationStore(
    selectUserCurrentLocation,
  )
  const setUserCurrentLocationInStore = useUserCurrentLocationStore(
    (state) => state.setUserCurrentLocation,
  )

  const initialValues: CreateReportFormValues = {
    reportImage: null,
    reportType: 'DISASTER_INCIDENT',
    name: '',
    parameters: {
      description: '',
      incidentType: 'EARTHQUAKE',
      severity: 'UNKNOWN',
      incidentTimestamp: new Date().toISOString(),
      location: {
        city: '',
        country: '',
        latitude: 0,
        longitude: 0,
      },
      media: [], //tbh it should be removed from be, just leave it for now like this
    },
  }

  const validationSchema: ObjectSchema<CreateReportFormValues> = object({
    reportImage: array()
      .of(mixed<File>().required('Image is required'))
      .nullable()
      .default(null),
    reportType: string()
      .oneOf(['DISASTER_INCIDENT'], 'Invalid report type')
      .required('Report type is required'),
    name: string().required('Name is required'),
    parameters: object().shape({
      description: string()
        .required('Description is required')
        .min(10, 'Description must be at least 10 characters long'),
      incidentType: string()
        .oneOf(
          ['EARTHQUAKE', 'FLOOD', 'FIRE', 'STORM', 'OTHER'],
          'Invalid incident type',
        )
        .required('Incident type is required'),
      severity: string()
        .oneOf(['UNKNOWN', 'MINOR', 'MODERATE', 'SEVERE'], 'Invalid severity')
        .required('Severity is required'),
      incidentTimestamp: string().required('Incident timestamp is required'),
      location: object().shape({
        city: string().required('City is required'),
        country: string().required('Country is required'),
        latitude: number().required('Latitude is required'),
        longitude: number().required('Longitude is required'),
      }),
      media: array().of(string().required()).nullable().default(null),
    }),
  })

  const { mutate: createReport } = useCreateDisasterReport()
  const handleSubmit = (values: CreateReportFormValues) => {
    console.log('Form values submitted:', values)
    // The city and country are already populated.
    // You can now proceed with your API call to create the report.
    setIsOpen(false) // Close modal on submit
    createReport(values)
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
    validateOnChange: false,
    validateOnBlur: false,
  })

  // handle locaton
  const handlePositionChange = useCallback(
    async (location: LocationCoordinates) => {
      console.log('📌 Location received in CreatePostModal:', location)
      const lat = location.lat ?? 0
      const lng = location.lng ?? 0

      formik.setFieldValue('parameters.location.latitude', lat)
      formik.setFieldValue('parameters.location.longitude', lng)

      if (!lat || !lng) return

      setIsGeocoding(true)
      try {
        const data = await queryClient.fetchQuery<ReverseGeocodeResponse>({
          queryKey: ['get-reverse-geocode', lat, lng],
          queryFn: () =>
            apiClient.post(ApiConstantRoutes.paths.location.reverseGeocode, {
              lat,
              lng,
            }),
          staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        })

        if (data.status === 'SUCCESS' && data.data) {
          formik.setFieldValue('parameters.location.city', data.data.city)
          formik.setFieldValue('parameters.location.country', data.data.country)
        } else {
          formik.setFieldValue('parameters.location.city', 'Unknown City')
          formik.setFieldValue('parameters.location.country', 'Unknown Country')
        }
      } catch (error) {
        console.error('Failed to reverse geocode location', error)
        formik.setFieldValue('parameters.location.city', 'Error Fetching City')
        formik.setFieldValue(
          'parameters.location.country',
          'Error Fetching Country',
        )
      } finally {
        setIsGeocoding(false)
      }
    },
    [queryClient, formik.setFieldValue],
  )

  // On modal open, if we have a user location, perform reverse geocoding to pre-fill the form.
  useEffect(() => {
    if (!isOpen) {
      hasFetchedInitialLocation.current = false
      return
    }

    if (hasFetchedInitialLocation.current) {
      return
    }

    const fetchAndSetLocation = (coords: { lat: number; lng: number }) => {
      handlePositionChange(coords)
      hasFetchedInitialLocation.current = true
    }

    // If location is already in the global store, use it.
    if (userCurrentLocation.lat && userCurrentLocation.lng) {
      fetchAndSetLocation({
        lat: userCurrentLocation.lat,
        lng: userCurrentLocation.lng,
      })
    } else {
      // Otherwise, get it directly from the browser's geolocation API.
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          // Update the global store so we don't have to ask again
          setUserCurrentLocationInStore(coords)
          // Use the location for the current modal instance
          fetchAndSetLocation(coords)
        },
        (error) => {
          console.error('Could not get user location:', error)
          // Mark as attempted to prevent re-fetching, allowing user to set manually
          hasFetchedInitialLocation.current = true
        },
      )
    }
  }, [
    isOpen,
    userCurrentLocation,
    handlePositionChange,
    setUserCurrentLocationInStore,
  ])

  // cancel button
  const handleCancel = () => {
    formik.resetForm()
    setPreviewImages([])
    setIsOpen(false)
  }

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const currentImages = formik.values.reportImage || []
      formik.setFieldValue('reportImage', [...currentImages, ...acceptedFiles])
      acceptedFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onload = () => {
          setPreviewImages((prev) => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
    },
    [formik],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const { onInputChange } = useCustomEvents<CreateReportFormValues>(formik)

  // remove selected image
  const handleRemoveImage = (indexToRemove: number) => {
    const currentImages = formik.values.reportImage || []
    formik.setFieldValue(
      'reportImage',
      currentImages.filter((_, i) => i !== indexToRemove),
    )
    setPreviewImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove),
    )
  }

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={clsx(
            'fixed inset-0 z-[100] flex items-center justify-center bg-black/30',
            className,
          )}
          initial='hidden'
          animate='visible'
          exit='exit'
          variants={backdropVariants}
        >
          <motion.div
            className='custom-scroll relative max-h-[90vh] w-189 rounded-lg bg-white px-8 shadow-xl'
            variants={modalVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
          >
            {/* Header */}
            <div className='sticky top-0 z-20 flex items-baseline justify-between border-b-1 border-black/30 bg-white py-5'>
              <h1 className='text-2xl font-semibold'>
                {t('createPost.create')}
              </h1>

              <button
                onClick={() => setIsOpen(false)}
                className='absolute right-0 cursor-pointer text-gray-500 hover:text-gray-700'
              >
                <X className='h-8 w-8' strokeWidth={2} />
              </button>
            </div>
            {/* Form */}
            <form onSubmit={formik.handleSubmit} className='space-y-5 pt-6'>
              {/* Select Disaster Type */}
              <div>
                <label
                  htmlFor='incidentType'
                  className='mb-2 block text-xl font-semibold'
                >
                  {t('createPost.disaster')} <span className='text-red'>*</span>
                </label>
                <div className='relative w-full'>
                  <select
                    id='incidentType'
                    name='incidentType'
                    className='block min-h-[50px] w-full appearance-none rounded-[10px] border border-zinc-300 px-4 py-2 text-base font-light text-black transition-colors duration-200 focus:outline-black/30'
                    value={formik.values.parameters.incidentType}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      formik.setFieldValue(
                        'parameters.incidentType',
                        e.target.value,
                      )
                    }}
                    required
                  >
                    <option value='EARTHQUAKE'>
                      {t('createPost.earthquake')}
                    </option>
                    <option value='FLOOD'>{t('createPost.flood')}</option>
                    <option value='STORM'>{t('createPost.storm')}</option>
                    <option value='FIRE'>{t('createPost.fire')}</option>
                  </select>
                  <div className='absolute inset-y-0 right-0 flex items-center px-4 text-black'>
                    <ChevronDown />
                  </div>
                </div>
                {formik.errors.parameters?.incidentType && (
                  <p className='text-red mt-1 text-sm'>
                    {formik.errors.parameters.incidentType}
                  </p>
                )}
              </div>

              {/* Pick Severity type */}
              <div>
                <label
                  htmlFor='severity'
                  className='mb-2 block text-xl font-semibold'
                >
                  {t('createPost.severity')} <span className='text-red'>*</span>
                </label>
                <div className='relative w-full'>
                  <select
                    id='severity'
                    name='severity'
                    className='block min-h-[50px] w-full appearance-none rounded-[10px] border border-zinc-300 px-4 py-2 text-base font-light text-black transition-colors duration-200 focus:outline-black/30'
                    value={formik.values.parameters.severity}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      formik.setFieldValue(
                        'parameters.severity',
                        e.target.value,
                      )
                    }}
                    required
                  >
                    <option value='UNKOWN'>{t('severity.unknown')} </option>
                    <option value='MINOR'>{t('severity.minor')}</option>
                    <option value='MODERATE'>{t('severity.moderate')}</option>
                    <option value='SEVERE'>{t('severity.severe')}</option>
                  </select>
                  <div className='absolute inset-y-0 right-0 flex items-center px-4 text-black'>
                    <ChevronDown />
                  </div>
                </div>
                {formik.errors.parameters?.severity && (
                  <p className='text-red mt-1 text-sm'>
                    {formik.errors.parameters.severity}
                  </p>
                )}
              </div>
              {/* title is name */}
              <div>
                <label
                  htmlFor='name'
                  className='mb-2 block text-xl font-semibold'
                >
                  {t('createPost.title')}
                  <span className='text-red'>*</span>
                </label>
                <Input
                  type='text'
                  name='name'
                  value={formik.values.name}
                  onChange={onInputChange}
                  error={formik.errors.name}
                  required
                />
              </div>
              {/* description */}
              <div>
                <label
                  htmlFor='description'
                  className='mb-2 block text-xl font-semibold'
                >
                  {t('createPost.description')}
                  <span className='text-red'>*</span>
                </label>
                <textarea
                  maxLength={300}
                  id='description'
                  name='description'
                  value={formik.values.parameters.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    formik.setFieldValue(
                      'parameters.description',
                      e.target.value,
                    )
                  }}
                  className='block min-h-28 w-full appearance-none rounded-[10px] border border-zinc-300 px-4 py-2 text-base font-light text-black transition-colors duration-200 focus:outline-black/30'
                  required
                ></textarea>
                {formik.errors.parameters?.description && (
                  <p className='text-red mt-1 text-sm'>
                    {formik.errors.parameters.description}
                  </p>
                )}
              </div>

              {/* Pick the location where the disaster occurred */}
              <div>
                <label className='mb-2 block text-xl font-semibold'>
                  {t('createPost.location')}
                  <span className='text-red'>*</span>
                </label>
                {formik.touched.parameters?.location &&
                  formik.errors.parameters?.location &&
                  typeof formik.errors.parameters.location === 'object' &&
                  Object.values(formik.errors.parameters.location).map(
                    (error, index) => (
                      <p key={index} className='text-red mt-1 text-sm'>
                        {error}
                      </p>
                    ),
                  )}
                {formik.touched.parameters?.location &&
                  formik.errors.parameters?.location &&
                  typeof formik.errors.parameters.location === 'string' && (
                    <p className='text-red mt-1 text-sm'>
                      {formik.errors.parameters.location}
                    </p>
                  )}
                <p className='mb-2 text-sm font-thin text-black/50'>
                  {isGeocoding
                    ? 'Fetching address...'
                    : t('createPost.dragPin')}
                </p>

                {/* Placeholder for Leaflet map */}
                <MapSelector onPositionChange={handlePositionChange} />
              </div>

              {/* drop or upload images */}
              <div>
                <label className='mb-2 block text-xl font-semibold'>
                  {t('createPost.images')}
                </label>
                <div
                  {...getRootProps()}
                  className='cursor-pointer rounded-lg border-2 border-dashed border-zinc-300 px-6 py-10 text-center transition-colors hover:border-black/30'
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p>{t('createPost.dropFile')} ...</p>
                  ) : (
                    <div className='flex flex-col items-center justify-center text-black/30 hover:text-black'>
                      <p>
                        <CloudUpload className='mb-2' />
                        {/* optional size and margin */}
                      </p>
                      <p className='mb-2'>{t('createPost.upload')}</p>
                      <p className='mb-2'>{t('createPost.or')}</p>
                      <button
                        type='button'
                        className='rounded-[10px] border border-black/30 px-4 py-2 transition-colors hover:cursor-pointer'
                      >
                        {t('createPost.browse')}
                      </button>
                    </div>
                  )}
                </div>
                {/* image preview */}
                {previewImages.length > 0 && (
                  <div className='mt-4 grid grid-cols-5 gap-4'>
                    {previewImages.map((src, index) => (
                      <div
                        key={index}
                        className='group relative h-26 w-full overflow-hidden rounded-[10px]'
                      >
                        <img
                          src={src}
                          alt={`preview-${index}`}
                          className='h-full w-full object-cover'
                        />
                        <button
                          type='button'
                          onClick={(e) => {
                            e.stopPropagation() // prevent dropzone click
                            handleRemoveImage(index)
                          }}
                          className='absolute top-1 right-1 rounded-full bg-black/50 p-1 text-white transition-opacity group-hover:cursor-pointer group-hover:bg-black/30'
                        >
                          <X className='h-4 w-4' />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className='sticky bottom-0 z-20 flex justify-end space-x-5 bg-white py-4'>
                <Button
                  className='w-29'
                  tertiary
                  type='button'
                  onClick={handleCancel}
                >
                  {t('createPost.cancel')}
                </Button>
                <Button className='w-29' primary type='submit'>
                  {/* {isPending ? 'Submitting...' : t('createPost.submit')} */}
                  {t('createPost.submit')}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
export default CreatePostModal
