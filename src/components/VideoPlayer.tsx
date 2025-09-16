interface VideoPlayerProps {
  src: string
  lessonId: string
  title?: string
}

export const VideoPlayer = ({ src, lessonId, title }: VideoPlayerProps) => {
  return (
    <div className="relative bg-card rounded-lg overflow-hidden shadow-card">
      <iframe
        src={src}
        title={title || `Lesson Video ${lessonId}`}
        className="w-full aspect-video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
      {title && (
        <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
          {title}
        </div>
      )}
    </div>
  )
}