import { Image } from '@nextui-org/react'
import { DocumentData } from 'firebase/firestore'
import { Link } from 'react-router-dom'
import { Spot } from '../../store/useRoute'
import { useRouteCardStore } from '../../store/useRouteCard'

interface RouteCardDocData {
  data: DocumentData[]
}

const RouteCard: React.FC<RouteCardDocData> = ({ data }) => {
  const { selectedImages, setSelectedImages } = useRouteCardStore()

  const handleDotClick = (routeID: string, index: number) => {
    const newSelectedImages = { ...selectedImages, [routeID]: index }
    setSelectedImages(newSelectedImages)
  }

  // useEffect(() => {
  //   console.log('selectedImages:', selectedImages)
  // }, [selectedImages])

  // const handleImageBug = (index: number) => {
  //   console.log(index)
  // }

  return (
    <div className='flex w-full flex-col flex-wrap gap-4'>
      {data.map((route, index) => {
        let imageIndex = 0
        return (
          <div
            key={index}
            className='relative h-60 w-full cursor-pointer rounded-2xl bg-blue-50 p-4 shadow-[3px_5px_7px_-6px_#7e7e7e] duration-300 hover:shadow-[10px_12px_10px_-12px_#7e7e7e]'
          >
            <Link
              key={`${route.routeID}_${index}`}
              to={`/route/${route.routeID}`}
              className='absolute left-0 top-0 h-full w-full cursor-pointer rounded-2xl'
            />
            <div className='flex gap-8 text-xl'>
              <div className='relative h-52 w-52 rounded-xl bg-zinc-200'>
                <div className='flex h-full w-full'>
                  {route.spots?.map((spot: Spot) =>
                    spot.imageUrls.map((url: string) => (
                      <Image
                        isZoomed
                        key={imageIndex++}
                        src={url}
                        alt={spot.spotTitle}
                        className={`aspect-square rounded-xl object-cover ${
                          selectedImages[route.routeID] === imageIndex ? 'block' : 'hidden'
                        }`}
                        // onClick={() => handleImageBug(imageIndex)}
                      />
                    ))
                  )}
                </div>
                <div className='absolute bottom-2 z-20 flex h-4 w-full flex-wrap items-center justify-center gap-2'>
                  {Array.from({
                    length: route.spots?.reduce(
                      (acc: number, spot: Spot) => acc + spot.imageUrls.length,
                      0
                    )
                  }).map((_, spanIndex) => (
                    <span
                      key={spanIndex}
                      className={`dot h-2 w-2 rounded-full opacity-70 ${
                        selectedImages[route.routeID] === spanIndex ? 'bg-blue-500' : 'bg-white'
                      }`}
                      onClick={() => handleDotClick(route.routeID, spanIndex)}
                    />
                  ))}
                </div>
              </div>

              <div className='flex flex-col gap-6 p-2'>
                <p className='text-2xl font-bold'>{route.routeTitle}</p>
                <p>Likes: {route.likeCount}</p>
                <div className='flex flex-wrap gap-2'>
                  <p>Tag: </p>
                  {route.tags.length > 0 ? (
                    route.tags.map((tag: string, index: number) => (
                      <Link
                        key={`${route.routeID}_tag_${index}`}
                        to={`/search/${tag}`}
                        className='z-10 rounded-xl bg-blue-100 pl-2 pr-2'
                      >
                        # {tag}
                      </Link>
                    ))
                  ) : (
                    <p>None</p>
                  )}
                </div>
                <div className='flex flex-wrap gap-2'>
                  <p>Spots: </p>
                  {route.spots.length > 0 ? (
                    route.spots?.map((spot: Spot, index: number) => (
                      <Link
                        key={`${route.routeID}_spot_${index}`}
                        to={`/search/${spot.spotTitle}`}
                        className='z-10 rounded-xl bg-blue-100 pl-2 pr-2'
                      >
                        {spot.spotTitle}
                      </Link>
                    ))
                  ) : (
                    <p>None</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default RouteCard
