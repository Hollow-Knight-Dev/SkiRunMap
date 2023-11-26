import GPX from 'gpx-parser-builder'
import { useEffect, useState } from 'react'

interface MapProps {
  gpxUrl: string
}
interface GPXPoint {
  $: {
    lat: string
    lon: string
  }
  ele: string
}

const Map: React.FC<MapProps> = ({ gpxUrl }) => {
  const mapStyles = {
    height: '100%',
    width: '100%'
  }

  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [defaultCenter, setDefaultCenter] = useState<google.maps.LatLngLiteral>({
    lat: 42.84886847854739,
    lng: 140.7229683345836
  })
  const [gpxTrackPoint, setGpxTrackPoint] = useState<google.maps.LatLngLiteral[] | undefined>(
    undefined
  )

  useEffect(() => {
    const loadGoogleMapsApi = async () => {
      const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary
      if (gpxUrl) {
        fetchGpxFile(gpxUrl, Map)
      } else {
        new Map(document.getElementById('map') as HTMLElement, {
          center: defaultCenter,
          zoom: 12
        })
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
        setDefaultCenter(center)

        const googleMap = new Map(document.getElementById('map') as HTMLElement, {
          center: center,
          zoom: 13
        })
        setMap(googleMap)
      }

      const trkptArray: google.maps.LatLngLiteral[] = []

      parsedGpx?.trk[0]?.trkseg[0]?.trkpt.forEach((point: GPXPoint) => {
        const latLng: google.maps.LatLngLiteral = {
          lat: parseFloat(point.$.lat),
          lng: parseFloat(point.$.lon)
        }
        trkptArray.push(latLng)
      })

      setGpxTrackPoint(trkptArray)
      // console.log(typeof trkptArray)
      // console.log(trkptArray)
    } catch (error) {
      console.error('Parsing gpx file error: ', error)
    }
  }

  useEffect(() => {
    if (map && gpxTrackPoint) {
      new google.maps.Polyline({
        path: gpxTrackPoint,
        strokeColor: '#ff2527',
        strokeOpacity: 1,
        strokeWeight: 4,
        map: map,
        geodesic: true
      })
    }
  }, [map, gpxTrackPoint])

  return <div id='map' style={mapStyles}></div>
}

export default Map
