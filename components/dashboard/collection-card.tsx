'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Folder, MoreVertical } from "lucide-react"
import Link from "next/link"
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
    const preview = collection.sample_thumbnails?.[0]

    return (
        <Card
            className={cn(
                "group relative overflow-hidden transition-all hover:shadow-lg border-border/70",
                preview && "bg-muted/40"
            )}
        >
            {preview ? (
                <div
                    className="absolute inset-0 opacity-70 transition-opacity duration-300 group-hover:opacity-90"
                    style={{
                        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0.7)), url(${preview})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-muted to-secondary/10" />
            )}
            <Link href={`/dashboard/collections/${collection.id}`} className="absolute inset-0 z-10" />
            <CardHeader className="relative z-20 flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm border border-white/10">
                        <Folder className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                        <CardTitle className="text-sm font-semibold text-foreground">
                            {collection.name}
                        </CardTitle>
                        {collection.role && (
                            <p className="text-[11px] text-muted-foreground capitalize">
                                {collection.role}{collection.is_shared ? ' • Shared' : ''}
                            </p>
                        )}
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 z-20 relative">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Rename</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent className="relative z-20">
                <div className="text-3xl font-bold text-foreground drop-shadow-sm">{collection.item_count || 0}</div>
                <p className="text-xs text-muted-foreground">items</p>
            </CardContent>
            {collection.is_shared && (
                <CardFooter className="relative z-20 pt-0">
                    <Badge variant="secondary" className="text-[11px] rounded-full bg-background/80 backdrop-blur-sm">
                        Shared
                    </Badge>
                </CardFooter>
            )}
        </Card>
    )
}
