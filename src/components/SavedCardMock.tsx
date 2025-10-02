import { MapPin, Heart, MessageCircle, Calendar } from 'lucide-react'

export function SavedCardMock() {
  return (
    <div className="rounded-2xl border p-4 w-72 bg-white dark:bg-black">
      <div className="flex gap-2 mb-3 text-xs">
        <span className="rounded-full px-2 py-1 border">Instagram</span>
        <span className="rounded-full px-2 py-1 border">by @foodjoy</span>
      </div>
      <div className="space-y-2">
        <h4 className="font-medium leading-snug">Hand-pulled ramen spot in Kensington</h4>
        <div className="flex items-center gap-2 text-text-dim text-sm">
          <MapPin className="h-4 w-4" />
          <span>Toronto, ON</span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full px-2 py-1 border">Ramen</span>
          <span className="rounded-full px-2 py-1 border">Date night</span>
          <span className="rounded-full px-2 py-1 border">$$</span>
        </div>
        <div className="pt-2 mt-1 flex items-center justify-between border-t">
          <div className="flex items-center gap-3 text-text-dim">
            <button className="flex items-center gap-1 hover:underline"><Heart className="h-4 w-4" /> Like</button>
            <button className="flex items-center gap-1 hover:underline"><MessageCircle className="h-4 w-4" /> Comment</button>
          </div>
          <button className="flex items-center gap-1 hover:underline"><Calendar className="h-4 w-4" /> Plan</button>
        </div>
      </div>
    </div>
  )
}
