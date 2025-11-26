'use client'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { Search, Filter, ArrowUpDown, LayoutGrid, List as ListIcon } from "lucide-react"

interface ToolbarProps {
    searchQuery: string
    setSearchQuery: (query: string) => void
    viewMode: 'grid' | 'list'
    setViewMode: (mode: 'grid' | 'list') => void
    sort: string
    setSort: (sort: string) => void
}

export function Toolbar({
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    sort,
    setSort,
}: ToolbarProps) {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 md:max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search items..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9 gap-1">
                            <Filter className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Filter
                            </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem checked>
                            All Items
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem>Unread</DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem>Favorites</DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-9 gap-1">
                            <ArrowUpDown className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Sort
                            </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
                            <DropdownMenuRadioItem value="newest">Newest</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="oldest">Oldest</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="title">Title</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex items-center rounded-md border bg-background p-1">
                    <Button
                        variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => setViewMode('grid')}
                    >
                        <LayoutGrid className="h-4 w-4" />
                        <span className="sr-only">Grid</span>
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => setViewMode('list')}
                    >
                        <ListIcon className="h-4 w-4" />
                        <span className="sr-only">List</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}
