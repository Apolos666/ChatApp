import VideoCall from './(components)/VideoCall'

export default function RoomPage({ params }: { params: { roomId: string } }) {
  return (
    <>
      <VideoCall roomId={params.roomId} />
    </>
  )
}
