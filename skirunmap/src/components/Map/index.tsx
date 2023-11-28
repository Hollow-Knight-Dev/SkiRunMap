import GPX from 'gpx-parser-builder'
import { useEffect, useState } from 'react'
import { useMapStore } from '../../store/useMap'

interface MapProps {
  gpxUrl: string
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

const Map: React.FC<MapProps> = ({ gpxUrl }) => {
  const mapStyles = {
    height: '100%',
    width: '100%'
  }

  const { map, setMap } = useMapStore()
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
          heading: 320,
          tilt: 47.5,
          restriction: {
            latLngBounds: {
              north: 45.551483,
              south: 24.396308,
              east: 153.986672,
              west: 122.93457
            }
          },
          draggableCursor: 'pointer'
        })
        setMap(googleMap)
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
    if (map && gpxTrackPoint) {
      new google.maps.Polyline({
        path: gpxTrackPoint,
        strokeColor: '#ff2527',
        strokeOpacity: 1,
        strokeWeight: 2,
        map: map
      })

      let infoWindow = new google.maps.InfoWindow({
        content: 'Click the map to create new marker!',
        position: { lat: 42.84676617984929, lng: 140.68491306976668 }
      })
      infoWindow.open(map)

      map.addListener('click', (mapsMouseEvent: google.maps.MapMouseEvent) => {
        if (infoWindow) {
          infoWindow.close()
        }
        const latLng = mapsMouseEvent.latLng
        const marker = new google.maps.Marker({
          position: latLng,
          map: map,
          icon: {
            url: 'https://firebasestorage.googleapis.com/v0/b/skirunmap.appspot.com/o/logo.png?alt=media&token=d49dbd60-cfea-48a3-b15a-d7de4b1facdd',
            scaledSize: new google.maps.Size(40, 40)
          },
          animation: google.maps.Animation.DROP,
          draggable: true,
          title: 'Drag me!'
        })

        const renewMarkerPosition = () => {
          if (infoWindow) {
            infoWindow.close()
          }
          const markerPosition = marker.getPosition() as google.maps.LatLng
          const markercontent = JSON.stringify(markerPosition?.toJSON(), null, 2)
          console.log('Marker latlng', markerPosition, typeof markerPosition)
          console.log('Marker content', markercontent, typeof markercontent)
          infoWindow = new google.maps.InfoWindow({
            content: markercontent
          })
          infoWindow.open(map, marker)
        }
        marker.addListener('dragend', () => renewMarkerPosition())
        marker.addListener('click', () => renewMarkerPosition())
        marker.addListener('dblclick', () => {
          marker.setMap(null)
        })
      })
    }
  }, [map, gpxTrackPoint])

  return <div id='map' style={mapStyles}></div>
}

export default Map
