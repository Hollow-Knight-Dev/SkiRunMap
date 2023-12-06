import GPX from 'gpx-parser-builder'
import { useEffect, useState } from 'react'
import { useMapStore } from '../../store/useMap'
import { useCoordinateStore } from '../../store/useRoute'

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

  const { routeCoordinate, setRouteCoordinate } = useCoordinateStore()

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

  // useEffect(() => {
  //   console.log('route start coordinate: ', routeCoordinate)
  // }, [routeCoordinate])

  const fetchGpxFile = async (filePath: string, Map: any) => {
    try {
      const response = await fetch(filePath)
      // console.log(response)
      const gpxContent = await response.text()
      // console.log(gpxContent)
      const parsedGpx = GPX.parse(gpxContent)
      // console.log(typeof parsedGpx) // object
      // console.log(parsedGpx)
      // console.log(parsedGpx.$)
      // console.log(parsedGpx.metadata)
      // console.log(parsedGpx.wpt)
      // console.log(parsedGpx.trk)

      const firstTrackPoint = parsedGpx.trk[0]?.trkseg[0]?.trkpt[0]
      // console.log(firstTrackPoint)
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
          // heading: 320,
          // tilt: 47.5,
          // restriction: {
          //   latLngBounds: {
          //     north: 45.551483,
          //     south: 24.396308,
          //     east: 153.986672,
          //     west: 122.93457
          //   }
          // },
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
      // console.log(typeof trkptArray)
      // console.log(trkptArray)
    } catch (error) {
      console.error('Parsing gpx file error: ', error)
    }
  }

  // const addMarker = (coordinate: google.maps.LatLngLiteral, icon: string, content: string) => {}

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
