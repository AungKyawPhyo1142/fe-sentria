import MapLibreGL, { type PopupOptions, type MarkerOptions } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { X, Minus, Plus, Locate, Maximize, Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'

// ─── Theme Detection ────────────────────────────────────────────────────────

function getDocumentTheme(): Theme | null {
  if (typeof document === 'undefined') return null
  if (document.documentElement.classList.contains('dark')) return 'dark'
  if (document.documentElement.classList.contains('light')) return 'light'
  return null
}

function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function useResolvedTheme(themeProp?: 'light' | 'dark'): 'light' | 'dark' {
  const [detectedTheme, setDetectedTheme] = useState<'light' | 'dark'>(
    () => getDocumentTheme() ?? getSystemTheme(),
  )

  useEffect(() => {
    if (themeProp) return

    const observer = new MutationObserver(() => {
      const docTheme = getDocumentTheme()
      if (docTheme) {
        setDetectedTheme(docTheme)
      }
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (!getDocumentTheme()) {
        setDetectedTheme(e.matches ? 'dark' : 'light')
      }
    }
    mediaQuery.addEventListener('change', handleSystemChange)

    return () => {
      observer.disconnect()
      mediaQuery.removeEventListener('change', handleSystemChange)
    }
  }, [themeProp])

  return themeProp ?? detectedTheme
}

// ─── Context ────────────────────────────────────────────────────────────────

type MapContextValue = {
  map: MapLibreGL.Map | null
  isLoaded: boolean
}

const MapContext = createContext<MapContextValue | null>(null)

function getViewport(map: MapLibreGL.Map): MapViewport {
  const center = map.getCenter()
  return {
    center: [center.lng, center.lat],
    zoom: map.getZoom(),
    bearing: map.getBearing(),
    pitch: map.getPitch(),
  }
}

function useMap() {
  const context = useContext(MapContext)
  if (!context) {
    throw new Error('useMap must be used within a Map component')
  }
  return context
}

// ─── Types ──────────────────────────────────────────────────────────────────

const defaultStyles = {
  dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
}

type MapStyleOption = string | MapLibreGL.StyleSpecification

type Theme = 'light' | 'dark'

type MapViewport = {
  center: [number, number]
  zoom: number
  bearing: number
  pitch: number
}

type MapProps = {
  children?: ReactNode
  className?: string
  theme?: Theme
  styles?: {
    light?: MapStyleOption
    dark?: MapStyleOption
  }
  projection?: MapLibreGL.ProjectionSpecification
  viewport?: Partial<MapViewport>
  onViewportChange?: (viewport: MapViewport) => void
} & Omit<MapLibreGL.MapOptions, 'container' | 'style'>

type MapRef = MapLibreGL.Map

// ─── Map Component ──────────────────────────────────────────────────────────

const DefaultLoader = () => (
  <div className='absolute inset-0 flex items-center justify-center'>
    <div className='flex gap-1'>
      <span className='size-1.5 animate-pulse rounded-full bg-gray-400/60' />
      <span className='size-1.5 animate-pulse rounded-full bg-gray-400/60 [animation-delay:150ms]' />
      <span className='size-1.5 animate-pulse rounded-full bg-gray-400/60 [animation-delay:300ms]' />
    </div>
  </div>
)

const Map = forwardRef<MapRef, MapProps>(function Map(
  {
    children,
    className,
    theme: themeProp,
    styles,
    projection,
    viewport,
    onViewportChange,
    ...props
  },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mapInstance, setMapInstance] = useState<MapLibreGL.Map | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isStyleLoaded, setIsStyleLoaded] = useState(false)
  const currentStyleRef = useRef<MapStyleOption | null>(null)
  const styleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const internalUpdateRef = useRef(false)
  const resolvedTheme = useResolvedTheme(themeProp)

  const isControlled = viewport !== undefined && onViewportChange !== undefined

  const onViewportChangeRef = useRef(onViewportChange)
  onViewportChangeRef.current = onViewportChange

  const mapStyles = useMemo(
    () => ({
      dark: styles?.dark ?? defaultStyles.dark,
      light: styles?.light ?? defaultStyles.light,
    }),
    [styles],
  )

  useImperativeHandle(ref, () => mapInstance as MapLibreGL.Map, [mapInstance])

  const clearStyleTimeout = useCallback(() => {
    if (styleTimeoutRef.current) {
      clearTimeout(styleTimeoutRef.current)
      styleTimeoutRef.current = null
    }
  }, [])

  // Initialize the map
  useEffect(() => {
    if (!containerRef.current) return

    const initialStyle =
      resolvedTheme === 'dark' ? mapStyles.dark : mapStyles.light
    currentStyleRef.current = initialStyle

    const map = new MapLibreGL.Map({
      container: containerRef.current,
      style: initialStyle,
      renderWorldCopies: false,
      attributionControl: {
        compact: true,
      },
      ...props,
      ...viewport,
    })

    const styleDataHandler = () => {
      clearStyleTimeout()
      styleTimeoutRef.current = setTimeout(() => {
        setIsStyleLoaded(true)
        if (projection) {
          map.setProjection(projection)
        }
      }, 100)
    }
    const loadHandler = () => setIsLoaded(true)

    const handleMove = () => {
      if (internalUpdateRef.current) return
      onViewportChangeRef.current?.(getViewport(map))
    }

    map.on('load', loadHandler)
    map.on('styledata', styleDataHandler)
    map.on('move', handleMove)
    setMapInstance(map)

    return () => {
      clearStyleTimeout()
      map.off('load', loadHandler)
      map.off('styledata', styleDataHandler)
      map.off('move', handleMove)
      map.remove()
      setIsLoaded(false)
      setIsStyleLoaded(false)
      setMapInstance(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync controlled viewport to map
  useEffect(() => {
    if (!mapInstance || !isControlled || !viewport) return
    if (mapInstance.isMoving()) return

    const current = getViewport(mapInstance)
    const next = {
      center: viewport.center ?? current.center,
      zoom: viewport.zoom ?? current.zoom,
      bearing: viewport.bearing ?? current.bearing,
      pitch: viewport.pitch ?? current.pitch,
    }

    if (
      next.center[0] === current.center[0] &&
      next.center[1] === current.center[1] &&
      next.zoom === current.zoom &&
      next.bearing === current.bearing &&
      next.pitch === current.pitch
    ) {
      return
    }

    internalUpdateRef.current = true
    mapInstance.jumpTo(next)
    internalUpdateRef.current = false
  }, [mapInstance, isControlled, viewport])

  // Handle style change
  useEffect(() => {
    if (!mapInstance || !resolvedTheme) return

    const newStyle = resolvedTheme === 'dark' ? mapStyles.dark : mapStyles.light

    if (currentStyleRef.current === newStyle) return

    clearStyleTimeout()
    currentStyleRef.current = newStyle
    setIsStyleLoaded(false)

    mapInstance.setStyle(newStyle, { diff: true })
  }, [mapInstance, resolvedTheme, mapStyles, clearStyleTimeout])

  const contextValue = useMemo(
    () => ({
      map: mapInstance,
      isLoaded: isLoaded && isStyleLoaded,
    }),
    [mapInstance, isLoaded, isStyleLoaded],
  )

  return (
    <MapContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        className={cn('relative h-full w-full', className)}
      >
        {!isLoaded && <DefaultLoader />}
        {mapInstance && children}
      </div>
    </MapContext.Provider>
  )
})

// ─── MapMarker ──────────────────────────────────────────────────────────────

type MarkerContextValue = {
  marker: MapLibreGL.Marker
  map: MapLibreGL.Map | null
}

const MarkerContext = createContext<MarkerContextValue | null>(null)

function useMarkerContext() {
  const context = useContext(MarkerContext)
  if (!context) {
    throw new Error('Marker components must be used within MapMarker')
  }
  return context
}

type MapMarkerProps = {
  longitude: number
  latitude: number
  children: ReactNode
  onClick?: (e: MouseEvent) => void
  onMouseEnter?: (e: MouseEvent) => void
  onMouseLeave?: (e: MouseEvent) => void
  onDragStart?: (lngLat: { lng: number; lat: number }) => void
  onDrag?: (lngLat: { lng: number; lat: number }) => void
  onDragEnd?: (lngLat: { lng: number; lat: number }) => void
} & Omit<MarkerOptions, 'element'>

function MapMarker({
  longitude,
  latitude,
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onDragStart,
  onDrag,
  onDragEnd,
  draggable = false,
  ...markerOptions
}: MapMarkerProps) {
  const { map } = useMap()

  const callbacksRef = useRef({
    onClick,
    onMouseEnter,
    onMouseLeave,
    onDragStart,
    onDrag,
    onDragEnd,
  })
  callbacksRef.current = {
    onClick,
    onMouseEnter,
    onMouseLeave,
    onDragStart,
    onDrag,
    onDragEnd,
  }

  const marker = useMemo(() => {
    const markerInstance = new MapLibreGL.Marker({
      ...markerOptions,
      element: document.createElement('div'),
      draggable,
    }).setLngLat([longitude, latitude])

    const handleClick = (e: MouseEvent) => callbacksRef.current.onClick?.(e)
    const handleMouseEnter = (e: MouseEvent) =>
      callbacksRef.current.onMouseEnter?.(e)
    const handleMouseLeave = (e: MouseEvent) =>
      callbacksRef.current.onMouseLeave?.(e)

    markerInstance.getElement()?.addEventListener('click', handleClick)
    markerInstance
      .getElement()
      ?.addEventListener('mouseenter', handleMouseEnter)
    markerInstance
      .getElement()
      ?.addEventListener('mouseleave', handleMouseLeave)

    const handleDragStart = () => {
      const lngLat = markerInstance.getLngLat()
      callbacksRef.current.onDragStart?.({ lng: lngLat.lng, lat: lngLat.lat })
    }
    const handleDrag = () => {
      const lngLat = markerInstance.getLngLat()
      callbacksRef.current.onDrag?.({ lng: lngLat.lng, lat: lngLat.lat })
    }
    const handleDragEnd = () => {
      const lngLat = markerInstance.getLngLat()
      callbacksRef.current.onDragEnd?.({ lng: lngLat.lng, lat: lngLat.lat })
    }

    markerInstance.on('dragstart', handleDragStart)
    markerInstance.on('drag', handleDrag)
    markerInstance.on('dragend', handleDragEnd)

    return markerInstance
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!map) return

    marker.addTo(map)

    return () => {
      marker.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])

  if (
    marker.getLngLat().lng !== longitude ||
    marker.getLngLat().lat !== latitude
  ) {
    marker.setLngLat([longitude, latitude])
  }
  if (marker.isDraggable() !== draggable) {
    marker.setDraggable(draggable)
  }

  const currentOffset = marker.getOffset()
  const newOffset = markerOptions.offset ?? [0, 0]
  const [newOffsetX, newOffsetY] = Array.isArray(newOffset)
    ? newOffset
    : [newOffset.x, newOffset.y]
  if (currentOffset.x !== newOffsetX || currentOffset.y !== newOffsetY) {
    marker.setOffset(newOffset)
  }

  return (
    <MarkerContext.Provider value={{ marker, map }}>
      {children}
    </MarkerContext.Provider>
  )
}

// ─── MarkerContent ──────────────────────────────────────────────────────────

type MarkerContentProps = {
  children?: ReactNode
  className?: string
}

function MarkerContent({ children, className }: MarkerContentProps) {
  const { marker } = useMarkerContext()

  return createPortal(
    <div className={cn('relative cursor-pointer', className)}>
      {children || <DefaultMarkerIcon />}
    </div>,
    marker.getElement(),
  )
}

function DefaultMarkerIcon() {
  return (
    <div className='relative h-4 w-4 rounded-full border-2 border-white bg-blue-500 shadow-lg' />
  )
}

// ─── MarkerPopup ────────────────────────────────────────────────────────────

type MarkerPopupProps = {
  children: ReactNode
  className?: string
  closeButton?: boolean
} & Omit<PopupOptions, 'className' | 'closeButton'>

function MarkerPopup({
  children,
  className,
  closeButton = false,
  ...popupOptions
}: MarkerPopupProps) {
  const { marker, map } = useMarkerContext()
  const container = useMemo(() => document.createElement('div'), [])
  const prevPopupOptions = useRef(popupOptions)

  const popup = useMemo(() => {
    const popupInstance = new MapLibreGL.Popup({
      offset: 16,
      ...popupOptions,
      closeButton: false,
    })
      .setMaxWidth('none')
      .setDOMContent(container)

    return popupInstance
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!map) return

    popup.setDOMContent(container)
    marker.setPopup(popup)

    return () => {
      marker.setPopup(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])

  if (popup.isOpen()) {
    const prev = prevPopupOptions.current

    if (prev.offset !== popupOptions.offset) {
      popup.setOffset(popupOptions.offset ?? 16)
    }
    if (prev.maxWidth !== popupOptions.maxWidth && popupOptions.maxWidth) {
      popup.setMaxWidth(popupOptions.maxWidth ?? 'none')
    }

    prevPopupOptions.current = popupOptions
  }

  const handleClose = () => popup.remove()

  return createPortal(
    <div
      className={cn(
        'relative rounded-lg border border-gray-200 bg-white p-3 text-gray-900 shadow-md',
        className,
      )}
    >
      {closeButton && (
        <button
          type='button'
          onClick={handleClose}
          className='absolute top-1 right-1 z-10 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none'
          aria-label='Close popup'
        >
          <X className='h-4 w-4' />
        </button>
      )}
      {children}
    </div>,
    container,
  )
}

// ─── MarkerTooltip ──────────────────────────────────────────────────────────

type MarkerTooltipProps = {
  children: ReactNode
  className?: string
} & Omit<PopupOptions, 'className' | 'closeButton' | 'closeOnClick'>

function MarkerTooltip({
  children,
  className,
  ...popupOptions
}: MarkerTooltipProps) {
  const { marker, map } = useMarkerContext()
  const container = useMemo(() => document.createElement('div'), [])

  const tooltip = useMemo(() => {
    const tooltipInstance = new MapLibreGL.Popup({
      offset: 16,
      ...popupOptions,
      closeOnClick: true,
      closeButton: false,
    }).setMaxWidth('none')

    return tooltipInstance
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!map) return

    tooltip.setDOMContent(container)

    const handleMouseEnter = () => {
      tooltip.setLngLat(marker.getLngLat()).addTo(map)
    }
    const handleMouseLeave = () => tooltip.remove()

    marker.getElement()?.addEventListener('mouseenter', handleMouseEnter)
    marker.getElement()?.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      marker.getElement()?.removeEventListener('mouseenter', handleMouseEnter)
      marker.getElement()?.removeEventListener('mouseleave', handleMouseLeave)
      tooltip.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])

  return createPortal(
    <div
      className={cn(
        'rounded-md bg-gray-900 px-2 py-1 text-xs text-white shadow-md',
        className,
      )}
    >
      {children}
    </div>,
    container,
  )
}

// ─── MapControls ────────────────────────────────────────────────────────────

type MapControlsProps = {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  showZoom?: boolean
  showCompass?: boolean
  showLocate?: boolean
  showFullscreen?: boolean
  className?: string
  onLocate?: (coords: { longitude: number; latitude: number }) => void
}

const controlPositionClasses = {
  'top-left': 'top-2 left-2',
  'top-right': 'top-2 right-2',
  'bottom-left': 'bottom-2 left-2',
  'bottom-right': 'bottom-10 right-2',
}

function ControlGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm [&>button:not(:last-child)]:border-b [&>button:not(:last-child)]:border-gray-200'>
      {children}
    </div>
  )
}

function ControlButton({
  onClick,
  label,
  children,
  disabled = false,
}: {
  onClick: () => void
  label: string
  children: React.ReactNode
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      type='button'
      className={cn(
        'flex size-8 items-center justify-center transition-colors hover:bg-gray-50',
        disabled && 'pointer-events-none cursor-not-allowed opacity-50',
      )}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

function MapControls({
  position = 'bottom-right',
  showZoom = true,
  showCompass = false,
  showLocate = false,
  showFullscreen = false,
  className,
  onLocate,
}: MapControlsProps) {
  const { map } = useMap()
  const [waitingForLocation, setWaitingForLocation] = useState(false)

  const handleZoomIn = useCallback(() => {
    map?.zoomTo(map.getZoom() + 1, { duration: 300 })
  }, [map])

  const handleZoomOut = useCallback(() => {
    map?.zoomTo(map.getZoom() - 1, { duration: 300 })
  }, [map])

  const handleResetBearing = useCallback(() => {
    map?.resetNorthPitch({ duration: 300 })
  }, [map])

  const handleLocate = useCallback(() => {
    setWaitingForLocation(true)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            longitude: pos.coords.longitude,
            latitude: pos.coords.latitude,
          }
          map?.flyTo({
            center: [coords.longitude, coords.latitude],
            zoom: 14,
            duration: 1500,
          })
          onLocate?.(coords)
          setWaitingForLocation(false)
        },
        (error) => {
          console.error('Error getting location:', error)
          setWaitingForLocation(false)
        },
      )
    }
  }, [map, onLocate])

  const handleFullscreen = useCallback(() => {
    const container = map?.getContainer()
    if (!container) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      container.requestFullscreen()
    }
  }, [map])

  return (
    <div
      className={cn(
        'absolute z-10 flex flex-col gap-1.5',
        controlPositionClasses[position],
        className,
      )}
    >
      {showZoom && (
        <ControlGroup>
          <ControlButton onClick={handleZoomIn} label='Zoom in'>
            <Plus className='size-4 text-gray-700' />
          </ControlButton>
          <ControlButton onClick={handleZoomOut} label='Zoom out'>
            <Minus className='size-4 text-gray-700' />
          </ControlButton>
        </ControlGroup>
      )}
      {showCompass && (
        <ControlGroup>
          <CompassButton onClick={handleResetBearing} />
        </ControlGroup>
      )}
      {showLocate && (
        <ControlGroup>
          <ControlButton
            onClick={handleLocate}
            label='Find my location'
            disabled={waitingForLocation}
          >
            {waitingForLocation ? (
              <Loader2 className='size-4 animate-spin text-gray-700' />
            ) : (
              <Locate className='size-4 text-gray-700' />
            )}
          </ControlButton>
        </ControlGroup>
      )}
      {showFullscreen && (
        <ControlGroup>
          <ControlButton onClick={handleFullscreen} label='Toggle fullscreen'>
            <Maximize className='size-4 text-gray-700' />
          </ControlButton>
        </ControlGroup>
      )}
    </div>
  )
}

function CompassButton({ onClick }: { onClick: () => void }) {
  const { map } = useMap()
  const compassRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!map || !compassRef.current) return

    const compass = compassRef.current

    const updateRotation = () => {
      const bearing = map.getBearing()
      const pitch = map.getPitch()
      compass.style.transform = `rotateX(${pitch}deg) rotateZ(${-bearing}deg)`
    }

    map.on('rotate', updateRotation)
    map.on('pitch', updateRotation)
    updateRotation()

    return () => {
      map.off('rotate', updateRotation)
      map.off('pitch', updateRotation)
    }
  }, [map])

  return (
    <ControlButton onClick={onClick} label='Reset bearing to north'>
      <svg
        ref={compassRef}
        viewBox='0 0 24 24'
        className='size-5 transition-transform duration-200'
        style={{ transformStyle: 'preserve-3d' }}
      >
        <path d='M12 2L16 12H12V2Z' className='fill-red-500' />
        <path d='M12 2L8 12H12V2Z' className='fill-red-300' />
        <path d='M12 22L16 12H12V22Z' className='fill-gray-400/60' />
        <path d='M12 22L8 12H12V22Z' className='fill-gray-400/30' />
      </svg>
    </ControlButton>
  )
}

// ─── MapPopup (Standalone) ──────────────────────────────────────────────────

type MapPopupProps = {
  longitude: number
  latitude: number
  onClose?: () => void
  children: ReactNode
  className?: string
  closeButton?: boolean
} & Omit<PopupOptions, 'className' | 'closeButton'>

function MapPopup({
  longitude,
  latitude,
  onClose,
  children,
  className,
  closeButton = false,
  ...popupOptions
}: MapPopupProps) {
  const { map } = useMap()
  const popupOptionsRef = useRef(popupOptions)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  const container = useMemo(() => document.createElement('div'), [])

  const popup = useMemo(() => {
    const popupInstance = new MapLibreGL.Popup({
      offset: 16,
      ...popupOptions,
      closeButton: false,
    })
      .setMaxWidth('none')
      .setLngLat([longitude, latitude])

    return popupInstance
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!map) return

    const onCloseProp = () => onCloseRef.current?.()

    popup.on('close', onCloseProp)

    popup.setDOMContent(container)
    popup.addTo(map)

    return () => {
      popup.off('close', onCloseProp)
      if (popup.isOpen()) {
        popup.remove()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])

  if (popup.isOpen()) {
    const prev = popupOptionsRef.current

    if (
      popup.getLngLat().lng !== longitude ||
      popup.getLngLat().lat !== latitude
    ) {
      popup.setLngLat([longitude, latitude])
    }

    if (prev.offset !== popupOptions.offset) {
      popup.setOffset(popupOptions.offset ?? 16)
    }
    if (prev.maxWidth !== popupOptions.maxWidth && popupOptions.maxWidth) {
      popup.setMaxWidth(popupOptions.maxWidth ?? 'none')
    }
    popupOptionsRef.current = popupOptions
  }

  const handleClose = () => {
    popup.remove()
  }

  return createPortal(
    <div
      className={cn(
        'relative rounded-lg border border-gray-200 bg-white p-3 text-gray-900 shadow-md',
        className,
      )}
    >
      {closeButton && (
        <button
          type='button'
          onClick={handleClose}
          className='absolute top-1 right-1 z-10 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none'
          aria-label='Close popup'
        >
          <X className='h-4 w-4' />
        </button>
      )}
      {children}
    </div>,
    container,
  )
}

// ─── Exports ────────────────────────────────────────────────────────────────

export {
  Map,
  useMap,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
  MapPopup,
  MapControls,
}

export type { MapRef, MapViewport, MapProps, MapMarkerProps, MapControlsProps }
