import clsx from 'clsx'
import {
  CloudUpload,
  X,
  Activity,
  Droplets,
  CloudLightning,
  Flame,
  MapPin,
  Loader2,
} from 'lucide-react'
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
import { backdropVariants, modalVariants } from '../posts/constants/constants'

const DISASTER_TYPES = [
  { value: 'EARTHQUAKE', labelKey: 'createPost.earthquake', Icon: Activity },
  { value: 'FLOOD', labelKey: 'createPost.flood', Icon: Droplets },
  { value: 'STORM', labelKey: 'createPost.storm', Icon: CloudLightning },
  { value: 'FIRE', labelKey: 'createPost.fire', Icon: Flame },
] as const

const SEVERITY_LEVELS = [
  { value: 'UNKNOWN', labelKey: 'severity.unknown', activeClass: 'border-gray-500 bg-gray-100 text-gray-700' },
  { value: 'MINOR', labelKey: 'severity.minor', activeClass: 'border-info bg-info-light text-info' },
  { value: 'MODERATE', labelKey: 'severity.moderate', activeClass: 'border-warning bg-warning-light text-warning' },
  { value: 'SEVERE', labelKey: 'severity.severe', activeClass: 'border-danger bg-danger-light text-danger' },
] as const

// Create Post Modal Interface
interface createPostProps {
  className?: string
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

//animation effects

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
    [queryClient, formik],
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
    // [formik.values.reportImage, formik.setFieldValue],
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

  const detectedCity = formik.values.parameters.location.city
  const detectedCountry = formik.values.parameters.location.country

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={clsx(
            'fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/30',
            className,
          )}
          initial='hidden'
          animate='visible'
          exit='exit'
          variants={backdropVariants}
        >
          <motion.div
            className='custom-scroll relative max-h-[90vh] w-[756px] overflow-y-auto rounded-xl bg-white shadow-xl'
            variants={modalVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
          >
            {/* Header */}
            <div className='sticky top-0 z-20 border-b border-gray-200 bg-white px-8 py-5'>
              <div className='flex items-center justify-between'>
                <div>
                  <h1 className='text-lg font-semibold text-gray-900'>
                    {t('createPost.create')}
                  </h1>
                  <p className='mt-0.5 text-sm text-gray-500'>
                    Help your community by reporting what you see on the ground.
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600'
                >
                  <X className='h-5 w-5' strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={formik.handleSubmit} className='px-8'>
              {/* Disaster Type — icon card grid */}
              <div className='py-5'>
                <label className='mb-1.5 block text-sm font-medium text-gray-700'>
                  {t('createPost.disaster')} <span className='text-danger'>*</span>
                </label>
                <div className='grid grid-cols-4 gap-2.5'>
                  {DISASTER_TYPES.map(({ value, labelKey, Icon }) => {
                    const isSelected =
                      formik.values.parameters.incidentType === value
                    return (
                      <button
                        key={value}
                        type='button'
                        onClick={() =>
                          formik.setFieldValue('parameters.incidentType', value)
                        }
                        className={clsx(
                          'flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-3.5 transition-all duration-150',
                          isSelected
                            ? 'border-primary bg-primary-light text-primary'
                            : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-500',
                        )}
                      >
                        <Icon
                          className='h-5 w-5'
                          strokeWidth={isSelected ? 2.5 : 2}
                        />
                        <span className='text-xs font-medium'>
                          {t(labelKey as never)}
                        </span>
                      </button>
                    )
                  })}
                </div>
                {formik.errors.parameters?.incidentType && (
                  <p className='mt-1.5 text-sm text-danger'>
                    {formik.errors.parameters.incidentType}
                  </p>
                )}
              </div>

              {/* Severity — color-coded pills */}
              <div className='pb-5'>
                <label className='mb-1.5 block text-sm font-medium text-gray-700'>
                  {t('createPost.severity')} <span className='text-danger'>*</span>
                </label>
                <div className='flex gap-2'>
                  {SEVERITY_LEVELS.map(({ value, labelKey, activeClass }) => {
                    const isSelected =
                      formik.values.parameters.severity === value
                    return (
                      <button
                        key={value}
                        type='button'
                        onClick={() =>
                          formik.setFieldValue('parameters.severity', value)
                        }
                        className={clsx(
                          'rounded-lg border px-4 py-1.5 text-sm font-medium transition-all duration-150',
                          isSelected
                            ? activeClass
                            : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50',
                        )}
                      >
                        {t(labelKey as never)}
                      </button>
                    )
                  })}
                </div>
                {formik.errors.parameters?.severity && (
                  <p className='mt-1.5 text-sm text-danger'>
                    {formik.errors.parameters.severity}
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className='border-t border-gray-100' />

              {/* Title */}
              <div className='pt-5'>
                <label
                  htmlFor='name'
                  className='mb-1.5 block text-sm font-medium text-gray-700'
                >
                  {t('createPost.title')}
                  <span className='text-danger'> *</span>
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

              {/* Description */}
              <div className='pt-5'>
                <label
                  htmlFor='description'
                  className='mb-1.5 block text-sm font-medium text-gray-700'
                >
                  {t('createPost.description')}
                  <span className='text-danger'> *</span>
                </label>
                <textarea
                  id='description'
                  name='description'
                  placeholder='Describe what happened — what you saw, heard, or experienced...'
                  value={formik.values.parameters.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                    formik.setFieldValue(
                      'parameters.description',
                      e.target.value,
                    )
                  }}
                  className='focus:border-primary focus:ring-primary/20 block min-h-24 w-full resize-none rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 transition-colors duration-200 placeholder:text-gray-400 focus:ring-2 focus:outline-none'
                  required
                />
                {formik.errors.parameters?.description && (
                  <p className='mt-1.5 text-sm text-danger'>
                    {formik.errors.parameters.description}
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className='mt-5 border-t border-gray-100' />

              {/* Location */}
              <div className='py-5'>
                <label className='mb-1 block text-sm font-medium text-gray-700'>
                  {t('createPost.location')}
                  <span className='text-danger'> *</span>
                </label>
                <p className='mb-3 text-xs text-gray-400'>
                  {isGeocoding ? (
                    <span className='inline-flex items-center gap-1.5'>
                      <Loader2 className='h-3 w-3 animate-spin' />
                      Detecting location...
                    </span>
                  ) : (
                    t('createPost.dragPin')
                  )}
                </p>

                {/* Detected location badge */}
                {detectedCity && detectedCountry && !isGeocoding && (
                  <div className='mb-3 inline-flex items-center gap-1.5 rounded-lg bg-primary-light px-3 py-1.5 text-sm text-primary'>
                    <MapPin className='h-3.5 w-3.5' />
                    <span className='font-medium'>
                      {detectedCity}, {detectedCountry}
                    </span>
                  </div>
                )}

                {/* Validation errors */}
                {formik.touched.parameters?.location &&
                  formik.errors.parameters?.location &&
                  typeof formik.errors.parameters.location === 'object' &&
                  Object.values(formik.errors.parameters.location).map(
                    (error, index) => (
                      <p key={index} className='mb-1 text-sm text-danger'>
                        {error}
                      </p>
                    ),
                  )}
                {formik.touched.parameters?.location &&
                  formik.errors.parameters?.location &&
                  typeof formik.errors.parameters.location === 'string' && (
                    <p className='mb-1 text-sm text-danger'>
                      {formik.errors.parameters.location}
                    </p>
                  )}

                <div className='overflow-hidden rounded-xl border border-gray-200'>
                  <MapSelector onPositionChange={handlePositionChange} />
                </div>
              </div>

              {/* Divider */}
              <div className='border-t border-gray-100' />

              {/* Image Upload */}
              <div className='py-5'>
                <label className='mb-1.5 block text-sm font-medium text-gray-700'>
                  {t('createPost.images')}
                  <span className='ml-1 text-xs font-normal text-gray-400'>
                    (optional)
                  </span>
                </label>
                <div
                  {...getRootProps()}
                  className={clsx(
                    'cursor-pointer rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors duration-150',
                    isDragActive
                      ? 'border-primary bg-primary-light'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50',
                  )}
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p className='text-sm font-medium text-primary'>
                      {t('createPost.dropFile')} ...
                    </p>
                  ) : (
                    <div className='flex flex-col items-center gap-2 text-gray-400'>
                      <CloudUpload className='h-8 w-8' strokeWidth={1.5} />
                      <div>
                        <p className='text-sm text-gray-500'>
                          {t('createPost.upload')}
                        </p>
                        <p className='mt-0.5 text-xs text-gray-400'>
                          PNG, JPG up to 10MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Image previews */}
                {previewImages.length > 0 && (
                  <div className='mt-3 grid grid-cols-5 gap-2.5'>
                    {previewImages.map((src, index) => (
                      <div
                        key={index}
                        className='group relative aspect-square w-full overflow-hidden rounded-lg'
                      >
                        <img
                          src={src}
                          alt={`preview-${index}`}
                          className='h-full w-full object-cover'
                        />
                        <button
                          type='button'
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveImage(index)
                          }}
                          className='absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900/60 text-white opacity-0 transition-opacity group-hover:opacity-100'
                        >
                          <X className='h-3 w-3' />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer Buttons */}
              <div className='sticky bottom-0 z-20 flex justify-end gap-3 border-t border-gray-100 bg-white py-4'>
                <Button
                  variant='secondary'
                  type='button'
                  onClick={handleCancel}
                >
                  {t('createPost.cancel')}
                </Button>
                <Button variant='primary' type='submit'>
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
