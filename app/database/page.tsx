"use client";

import { useState, useMemo } from "react";
import dbData from "@/lib/data/database_analysis.json";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Database, Search, ExternalLink, Info } from "lucide-react";

export default function DatabasePage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const filteredData = useMemo(() => {
    return dbData.analysis_data.filter((row: any) => 
      row.district_name.toLowerCase().includes(search.toLowerCase()) ||
      row.state_name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="container max-w-7xl py-10 space-y-10 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Database Explorer</h1>
        <p className="text-xl text-zinc-500 dark:text-zinc-400">
          Search and browse through the integrated malnutrition dataset.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-indigo-500" />
                  Analysis Dataset
                </CardTitle>
                <CardDescription>
                  Showing {filteredData.length} districts found
                </CardDescription>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                <input
                  type="search"
                  placeholder="Search districts or states..."
                  className="pl-9 h-9 w-[250px] rounded-md border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <Table>
                <TableHeader className="bg-zinc-50 dark:bg-zinc-900">
                  <TableRow>
                    <TableHead className="w-[200px]">District</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead className="text-right">Stunting (%)</TableHead>
                    <TableHead className="text-right">Sanitation (%)</TableHead>
                    <TableHead className="text-right">Schooling (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((row: any, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{row.district_name}</TableCell>
                      <TableCell>{row.state_name}</TableCell>
                      <TableCell className="text-right">{row.stunting_pct?.toFixed(1) || "N/A"}</TableCell>
                      <TableCell className="text-right">{row.improved_sanitation_pct?.toFixed(1) || "N/A"}</TableCell>
                      <TableCell className="text-right">{row.women_10plus_schooling_pct?.toFixed(1) || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                  {paginatedData.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-zinc-500">
                        No results found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex items-center justify-between py-4">
              <p className="text-sm text-zinc-500">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm rounded-md border border-zinc-200 dark:border-zinc-800 disabled:opacity-50 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm rounded-md border border-zinc-200 dark:border-zinc-800 disabled:opacity-50 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Next
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Info className="w-5 h-5 text-indigo-500" />
                Data Architecture
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dbData.metadata.tables.map((table: any, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-400">
                      {table.name}
                    </code>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {table.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ExternalLink className="w-5 h-5 text-indigo-500" />
                Data Credits
              </CardTitle>
              <CardDescription>
                Primary data sources via NDAP (National Data Analytics Platform)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "NFHS-5 : District", url: "https://ndap.niti.gov.in/dataset/6822", desc: "Primary nutrition & health indicators (2019-21)" },
                { name: "NFHS-4 : District", url: "https://ndap.niti.gov.in/dataset/7034", desc: "Historical comparison baseline (2015-16)" },
                { name: "Har Ghar Jal", url: "https://ndap.niti.gov.in/dataset/9310", desc: "Jal Jeevan Mission water access monitoring" },
                { name: "Crop Production Statistics", url: "https://ndap.niti.gov.in/dataset/6820", desc: "District-level weighted crop yield (Agriculture)" },
                { name: "HMIS", url: "https://ndap.niti.gov.in/dataset/6707", desc: "Health Management Information System records" }
              ].map((source, i) => (
                <div key={i} className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{source.name}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {source.desc}
                    </p>
                  </div>
                  <a 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-indigo-500 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
              <Separator />
              <p className="text-[10px] text-zinc-400 italic">
                All data was harmonized at the district level using a custom state-district name normalization engine to bridge inconsistent naming across NDAP datasets.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
