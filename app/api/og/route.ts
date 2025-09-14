import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
          color: '#fff'
        }}
      >
        <div style={{display:'flex', alignItems:'center', gap: 24}}>
          <div style={{height:96, width:96, borderRadius:24, background:'#fff', color:'#000', display:'flex', alignItems:'center', justifyContent:'center', fontSize:48, fontWeight:700}}>S</div>
          <div style={{fontSize:48, fontWeight:700, letterSpacing:-1}}>SavedIt</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
