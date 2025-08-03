'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, Filter, Download } from "lucide-react"
import { cn } from "@/lib/utils"

interface Column {
  key: string
  label: string
  sortable?: boolean
  render?: (value: any, row: any) => React.ReactNode
}

interface DataTableProps {
  data: any[]
  columns: Column[]
  searchable?: boolean
  searchPlaceholder?: string
  onRowClick?: (row: any) => void
  actions?: (row: any) => React.ReactNode
  emptyMessage?: string
  className?: string
}

export function DataTable({
  data,
  columns,
  searchable = true,
  searchPlaceholder = "Search...",
  onRowClick,
  actions,
  emptyMessage = "No data found",
  className
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const filteredData = data.filter(row => {
    if (!searchTerm) return true
    return Object.values(row).some(value => 
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0
    
    const aValue = a[sortColumn]
    const bValue = b[sortColumn]
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(columnKey)
      setSortDirection('asc')
    }
  }

  return (
    <Card className={cn(
      "border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-800/80",
      className
    )}>
      <CardContent className="p-0">
        {searchable && (
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-slate-200 dark:border-slate-600"
                />
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                {columns.map((column) => (
                  <TableHead 
                    key={column.key}
                    className={cn(
                      "font-semibold text-slate-700 dark:text-slate-300",
                      column.sortable && "cursor-pointer hover:text-slate-900 dark:hover:text-slate-100"
                    )}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {column.sortable && sortColumn === column.key && (
                        <span className="text-xs">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
                {actions && (
                  <TableHead className="text-center font-semibold text-slate-700 dark:text-slate-300">
                    Actions
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((row, index) => (
                <TableRow 
                  key={row.id || index}
                  className={cn(
                    "hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((column) => (
                    <TableCell key={column.key} className="text-slate-600 dark:text-slate-400">
                      {column.render 
                        ? column.render(row[column.key], row)
                        : row[column.key]
                      }
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell className="text-center">
                      <div onClick={(e) => e.stopPropagation()} className="flex items-center justify-center">
                        {actions(row)}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {sortedData.length === 0 && (
                <TableRow>
                  <TableCell 
                    colSpan={columns.length + (actions ? 1 : 0)} 
                    className="text-center py-8 text-slate-500 dark:text-slate-400"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
