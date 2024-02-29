import GPX from 'gpx-parser-builder'
import { useEffect, useState } from 'react'
import { useMapStore } from '../../store/useMap'
import { useRouteStore } from '../../store/useRoute'

interface MapProps {
  gpxUrl: string
  createMode: boolean
}
interface Waypoint {
  $: {
    lat: string
    lon: string
  }
  ele: string
}

interface TrackSegment {
  trkpt: Waypoint[]
}

const Map: React.FC<MapProps> = ({ gpxUrl, createMode }) => {
  const mapStyles = {
    height: '100%',
    width: '100%'
  }

  const { map, setMap, infoWindow, setInfoWindow } = useMapStore()
  const { routeCoordinate, setRouteCoordinate } = useRouteStore()
  const [gpxTrackPoint, setGpxTrackPoint] = useState<google.maps.LatLngLiteral[] | undefined>(
    undefined
  )

  useEffect(() => {
    const loadGoogleMapsApi = async () => {
      try {
        const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary
        if (gpxUrl) {
          fetchGpxFile(gpxUrl, Map)
        } else {
          console.log('GPX route fail to load in')
        }
      } catch (error) {
        console.error('Error loading Google Maps API:', error)
      }
    }

    loadGoogleMapsApi()
  }, [gpxUrl])

  const fetchGpxFile = async (filePath: string, Map: any) => {
    try {
      const response = await fetch(filePath)
      const gpxContent = await response.text()
      const parsedGpx = GPX.parse(gpxContent)
      const firstTrackPoint = parsedGpx.trk[0]?.trkseg[0]?.trkpt[0]

      if (firstTrackPoint) {
        const center: google.maps.LatLngLiteral = {
          lat: parseFloat(firstTrackPoint.$.lat),
          lng: parseFloat(firstTrackPoint.$.lon)
        }

        const googleMap = new Map(document.getElementById('map') as HTMLElement, {
          center: center,
          zoom: 13,
          mapTypeId: 'terrain',
          scrollwheel: true,
          scaleControl: true,
          rotateControl: true,
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            position: google.maps.ControlPosition.TOP_LEFT
          },
          fullscreenControl: true,
          fullscreenControlOptions: {
            position: google.maps.ControlPosition.BOTTOM_RIGHT
          },
          draggableCursor: 'pointer'
        })
        setMap(googleMap)
        setRouteCoordinate(center)
      }

      const trkptArray: google.maps.LatLngLiteral[] = []

      parsedGpx?.trk[0]?.trkseg.forEach((trkseg: TrackSegment) => {
        trkseg.trkpt.forEach((point: Waypoint) => {
          const latLng: google.maps.LatLngLiteral = {
            lat: parseFloat(point.$.lat),
            lng: parseFloat(point.$.lon)
          }
          trkptArray.push(latLng)
        })
      })
      setGpxTrackPoint(trkptArray)
    } catch (error) {
      console.error('Parsing gpx file error: ', error)
    }
  }

  useEffect(() => {
    if (
      map &&
      gpxTrackPoint &&
      routeCoordinate.lat !== undefined &&
      routeCoordinate.lng !== undefined
    ) {
      new google.maps.Polyline({
        path: gpxTrackPoint,
        strokeColor: '#ff2527',
        strokeOpacity: 1,
        strokeWeight: 2,
        map: map
      })

      if (createMode) {
        const newInfoWindow = new google.maps.InfoWindow({
          content: 'You can also add marker on the spot!',
          position: { lat: routeCoordinate.lat, lng: routeCoordinate.lng }
        })
        if (infoWindow) {
          infoWindow.close()
        }
        setInfoWindow(newInfoWindow)
        newInfoWindow.open(map)
      }
    }
  }, [map, gpxTrackPoint])

  return <div id='map' style={mapStyles}></div>
}

export default Map
