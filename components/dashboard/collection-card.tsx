'use client'

/* eslint-disable @next/next/no-img-element */
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Folder, MoreVertical, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface Collection {
    id: string
    name: string
    created_at?: string
    updated_at?: string
    item_count?: number
    role?: string
    is_shared?: boolean
    sample_thumbnails?: string[]
}

interface CollectionCardProps {
    collection: Collection
}

export function CollectionCard({ collection }: CollectionCardProps) {
    const router = useRouter()
    const thumbnails = collection.sample_thumbnails?.filter(Boolean).slice(0, 4) || []
    const hasMultipleThumbnails = thumbnails.length > 1

    const handleClick = () => {
        router.push(`/dashboard/collections/${collection.id}`)
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleClick()
        }
    }

    return (
        <Card
            className={cn(
                "group relative overflow-hidden transition-all duration-200 cursor-pointer",
                "hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]",
                "border-border/50 bg-card"
            )}
            onClick={handleClick}
            onKeyDown={handleKeyPress}
            role="button"
            tabIndex={0}
        >
            {/* Thumbnail area */}
            <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden bg-muted">
                {thumbnails.length > 0 ? (
                    hasMultipleThumbnails ? (
                        // Grid of thumbnails
                        <div className="grid grid-cols-2 grid-rows-2 h-full w-full gap-0.5">
                            {thumbnails.slice(0, 4).map((thumb, idx) => (
                                <div key={idx} className="relative overflow-hidden bg-muted">
                                    <img
                                        src={thumb}
                                        alt=""
                                        className="h-full w-full object-cover"
                                        onError={(e) => e.currentTarget.style.display = 'none'}
                                    />
                                </div>
                            ))}
                            {/* Fill empty slots */}
                            {thumbnails.length < 4 && [...Array(4 - thumbnails.length)].map((_, idx) => (
                                <div key={`empty-${idx}`} className="bg-muted/50" />
                            ))}
                        </div>
                    ) : (
                        // Single thumbnail
                        <img
                            src={thumbnails[0]}
                            alt=""
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => e.currentTarget.style.display = 'none'}
                        />
                    )
                ) : (
                    // Placeholder gradient
                    <div className="h-full w-full bg-gradient-to-br from-primary/10 via-muted to-secondary/10 flex items-center justify-center">
                        <Folder className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground/30" />
                    </div>
                )}
                
                {/* Gradient overlay - works for both light and dark */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Item count badge */}
                <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3">
                    <Badge 
                        variant="secondary" 
                        className="bg-white/90 dark:bg-black/70 text-foreground dark:text-white backdrop-blur-sm border-0 text-xs sm:text-sm font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1"
                    >
                        {collection.item_count || 0} {(collection.item_count || 0) === 1 ? 'item' : 'items'}
                    </Badge>
                </div>

                {/* Shared indicator */}
                {collection.is_shared && (
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                        <Badge 
                            variant="secondary" 
                            className="bg-blue-500/90 text-white backdrop-blur-sm border-0 text-[10px] sm:text-xs font-medium px-1.5 py-0.5 sm:px-2 flex items-center gap-1"
                        >
                            <Users className="h-3 w-3" />
                            <span className="hidden sm:inline">Shared</span>
                        </Badge>
                    </div>
                )}

                {/* Menu button */}
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="secondary" 
                                size="icon"
                                className="h-7 w-7 sm:h-8 sm:w-8 bg-white/90 dark:bg-black/70 backdrop-blur-sm hover:bg-white dark:hover:bg-black"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MoreVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                <span className="sr-only">Open menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Rename</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Card content */}
            <div className="p-2 sm:p-3">
                <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">
                    {collection.name}
                </h3>
                {collection.role && (
                    <p className="text-[10px] sm:text-xs text-muted-foreground capitalize mt-0.5">
                        {collection.role}
                    </p>
                )}
            </div>
        </Card>
    )
}
