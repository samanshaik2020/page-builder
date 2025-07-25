import { ImageResponse } from 'next/og'

export const alt = 'SquPage - Landing Page Builder'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 72, marginBottom: 20 }}>SquPage</div>
          <div style={{ fontSize: 32, opacity: 0.9 }}>
            Landing Page Builder
          </div>
          <div style={{ fontSize: 24, opacity: 0.8, marginTop: 20 }}>
            Create stunning pages with drag-and-drop
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
