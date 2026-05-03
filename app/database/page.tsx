"use client";

import { useMemo, useState } from "react";
import { Database, ExternalLink, Filter, Layers3, Search, Table2, ChevronLeft, ChevronRight, MapPinned, Rows3, ArrowUpDown, FileStack } from "lucide-react";
import dbData from "@/lib/data/database_analysis.json";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type AnalysisRow = {
  district_id: number;
  state_name: string;
  district_name: string;
  stunting_pct?: number;
  wasting_pct?: number;
  underweight_pct?: number;
  improved_sanitation_pct?: number;
  women_10plus_schooling_pct?: number;
  institutional_births_pct?: number;
  total_area_ha?: number;
  total_production_t?: number;
  weighted_yield_t_per_ha?: number;
  crop_count?: number;
  usable_for_eda?: number;
  [key: string]: string | number | undefined;
};

type DatabaseFile = {
  metadata: {
    tables: { name: string; description: string }[];
    sources: { name: string; url: string; description: string }[];
  };
  analysis_data: AnalysisRow[];
};

const db = dbData as DatabaseFile;
const rows = db.analysis_data;
const numberFormat = new Intl.NumberFormat("en-IN");
const pageSize = 12;

const sortOptions = [
  { value: "district", label: "District A to Z" },
  { value: "state", label: "State A to Z" },
  { value: "stunting", label: "Stunting high to low" },
  { value: "sanitation", label: "Sanitation high to low" },
  { value: "schooling", label: "Schooling high to low" },
  { value: "births", label: "Institutional births high to low" },
] as const;

type SortKey = (typeof sortOptions)[number]["value"];

function formatPercent(value?: number) {
  return typeof value === "number" ? `${value.toFixed(1)}%` : "-";
}

function formatNumber(value?: number) {
  return typeof value === "number" ? numberFormat.format(Math.round(value)) : "-";
}

function average(rowsToAverage: AnalysisRow[], key: keyof AnalysisRow) {
  const values = rowsToAverage
    .map((row) => row[key])
    .filter((value): value is number => typeof value === "number");

  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export default function DatabasePage() {
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState("all");
  const [sortBy, setSortBy] = useState<SortKey>("stunting");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDistrictId, setSelectedDistrictId] = useState(
    rows[0]?.district_id.toString() ?? ""
  );

  const stateOptions = useMemo(
    () =>
      Array.from(new Set(rows.map((row) => row.state_name))).sort((a, b) =>
        a.localeCompare(b)
      ),
    []
  );

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    const visible = rows.filter((row) => {
      const matchesQuery =
        !query ||
        row.district_name.toLowerCase().includes(query) ||
        row.state_name.toLowerCase().includes(query);
      const matchesState =
        selectedState === "all" || row.state_name === selectedState;

      return matchesQuery && matchesState;
    });

    const sorted = [...visible].sort((a, b) => {
      switch (sortBy) {
        case "district":
          return a.district_name.localeCompare(b.district_name);
        case "state":
          return a.state_name.localeCompare(b.state_name) ||
            a.district_name.localeCompare(b.district_name);
        case "sanitation":
          return (b.improved_sanitation_pct ?? -Infinity) - (a.improved_sanitation_pct ?? -Infinity) ||
            a.district_name.localeCompare(b.district_name);
        case "schooling":
          return (b.women_10plus_schooling_pct ?? -Infinity) - (a.women_10plus_schooling_pct ?? -Infinity) ||
            a.district_name.localeCompare(b.district_name);
        case "births":
          return (b.institutional_births_pct ?? -Infinity) - (a.institutional_births_pct ?? -Infinity) ||
            a.district_name.localeCompare(b.district_name);
        case "stunting":
        default:
          return (b.stunting_pct ?? -Infinity) - (a.stunting_pct ?? -Infinity) ||
            a.district_name.localeCompare(b.district_name);
      }
    });

    return sorted;
  }, [search, selectedState, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const activePage = Math.min(currentPage, totalPages);
  const paginatedRows = filteredRows.slice(
    (activePage - 1) * pageSize,
    activePage * pageSize
  );

  const activeRow =
    filteredRows.find(
      (row) => row.district_id.toString() === selectedDistrictId
    ) ?? filteredRows[0];

  const rowCount = rows.length;
  const stateCount = stateOptions.length;
  const tableCount = db.metadata.tables.length;
  const sourceCount = db.metadata.sources.length;
  const analyzedCount = rows.filter((row) => row.usable_for_eda === 1).length;
  const avgStunting = average(rows, "stunting_pct");
  const avgSanitation = average(rows, "improved_sanitation_pct");
  const avgSchooling = average(rows, "women_10plus_schooling_pct");

  function resetFilters() {
    setSearch("");
    setSelectedState("all");
    setSortBy("stunting");
    setCurrentPage(1);
  }

  function gotoPage(nextPage: number) {
    setCurrentPage(Math.min(totalPages, Math.max(1, nextPage)));
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:py-12">
      <div className="space-y-6">
        <Card className="overflow-hidden">
          <div className="grid xl:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.75fr)]">
            <CardContent className="space-y-5 p-6 lg:p-8">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="gap-1.5">
                  <Database />
                  Database explorer
                </Badge>
                <Badge variant="outline" className="gap-1.5">
                  <Layers3 />
                  District-level merge
                </Badge>
                <Badge variant="outline" className="gap-1.5">
                  <Table2 />
                  7 tables
                </Badge>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                  Browse the merged district database
                </h1>
                <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Search the harmonized district table, inspect source fields,
                  and jump between schema and provenance without leaving the
                  page.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border bg-background/70 p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Records
                  </p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight">
                    {formatNumber(rowCount)}
                  </p>
                </div>
                <div className="rounded-xl border bg-background/70 p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    States
                  </p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight">
                    {formatNumber(stateCount)}
                  </p>
                </div>
                <div className="rounded-xl border bg-background/70 p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Sources
                  </p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight">
                    {formatNumber(sourceCount)}
                  </p>
                </div>
              </div>
            </CardContent>

            <div className="border-t bg-muted/30 p-6 lg:border-t-0 lg:border-l lg:p-8">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border bg-background p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Usable rows
                  </p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight">
                    {formatNumber(analyzedCount)}
                  </p>
                </div>
                <div className="rounded-xl border bg-background p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Tables
                  </p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight">
                    {formatNumber(tableCount)}
                  </p>
                </div>
                <div className="rounded-xl border bg-background p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Mean stunting
                  </p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight">
                    {formatPercent(avgStunting)}
                  </p>
                </div>
                <div className="rounded-xl border bg-background p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Mean sanitation
                  </p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight">
                    {formatPercent(avgSanitation)}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                The merged table is normalized at district level. Use the
                records tab to inspect the live rows, then switch to schema or
                sources for the data map.
              </p>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="records" className="space-y-5">
          <TabsList variant="line" className="w-full justify-start">
            <TabsTrigger value="records">Records</TabsTrigger>
            <TabsTrigger value="schema">Schema</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
          </TabsList>

          <TabsContent value="records" className="space-y-5">
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.85fr)]">
              <Card className="h-fit">
                <CardHeader className="border-b">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <Rows3 className="size-4 text-muted-foreground" />
                        Analysis dataset
                      </CardTitle>
                      <CardDescription>
                        Search by district or state, then sort and page through
                        the harmonized rows.
                      </CardDescription>
                    </div>
                    <Badge variant="outline">
                      {formatNumber(filteredRows.length)} visible rows
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-4">
                  <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="search"
                        value={search}
                        onChange={(event) => {
                          setSearch(event.target.value);
                          setCurrentPage(1);
                        }}
                        placeholder="Search district or state"
                        className="pl-9"
                      />
                    </div>

                    <Select
                      value={selectedState}
                      onValueChange={(value) => {
                        setSelectedState(value ?? "all");
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue>All states</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All states</SelectItem>
                        {stateOptions.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={sortBy}
                      onValueChange={(value) => {
                        setSortBy((value ?? "stunting") as SortKey);
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue>Sort rows</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="gap-1.5">
                      <Filter />
                      {selectedState === "all" ? "All states" : selectedState}
                    </Badge>
                    <Badge variant="secondary" className="gap-1.5">
                      <ArrowUpDown />
                      {sortOptions.find((option) => option.value === sortBy)?.label}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={resetFilters}>
                      Reset filters
                    </Button>
                  </div>

                  <div className="rounded-xl border bg-background">
                    <Table>
                      <TableHeader className="bg-muted/60 [&_tr]:border-b">
                        <TableRow>
                          <TableHead className="w-[220px]">District</TableHead>
                          <TableHead>State</TableHead>
                          <TableHead className="text-right">Stunting</TableHead>
                          <TableHead className="text-right">Sanitation</TableHead>
                          <TableHead className="text-right">Schooling</TableHead>
                          <TableHead className="text-right">Births</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedRows.map((row) => {
                          const isActive =
                            row.district_id.toString() ===
                            activeRow?.district_id.toString();

                          return (
                            <TableRow
                              key={row.district_id}
                              data-state={isActive ? "selected" : undefined}
                              className="cursor-pointer"
                              onClick={() =>
                                setSelectedDistrictId(row.district_id.toString())
                              }
                              tabIndex={0}
                              role="button"
                              onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                  event.preventDefault();
                                  setSelectedDistrictId(
                                    row.district_id.toString()
                                  );
                                }
                              }}
                            >
                              <TableCell className="font-medium">
                                {row.district_name}
                              </TableCell>
                              <TableCell>{row.state_name}</TableCell>
                              <TableCell className="text-right tabular-nums">
                                {formatPercent(row.stunting_pct)}
                              </TableCell>
                              <TableCell className="text-right tabular-nums">
                                {formatPercent(row.improved_sanitation_pct)}
                              </TableCell>
                              <TableCell className="text-right tabular-nums">
                                {formatPercent(row.women_10plus_schooling_pct)}
                              </TableCell>
                              <TableCell className="text-right tabular-nums">
                                {formatPercent(row.institutional_births_pct)}
                              </TableCell>
                            </TableRow>
                          );
                        })}

                        {paginatedRows.length === 0 && (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="h-28 text-center text-sm text-muted-foreground"
                            >
                              No matching districts. Try widening the search or
                              clearing the filters.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-muted-foreground">
                      Showing {paginatedRows.length} of {formatNumber(filteredRows.length)} rows
                      {filteredRows.length ? `, page ${activePage} of ${totalPages}` : ""}.
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={activePage === 1}
                        onClick={() => gotoPage(activePage - 1)}
                      >
                        <ChevronLeft data-icon="inline-start" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={activePage === totalPages}
                        onClick={() => gotoPage(activePage + 1)}
                      >
                        Next
                        <ChevronRight data-icon="inline-end" />
                      </Button>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex-col items-start gap-2 bg-muted/40">
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Rows are harmonized at district level with normalized state
                    and district keys. The explorer is tuned for inspection, not
                    raw editing.
                  </p>
                </CardFooter>
              </Card>

              <div className="space-y-5">
                <Card className="h-fit">
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                      <MapPinned className="size-4 text-muted-foreground" />
                      Selected district
                    </CardTitle>
                    <CardDescription>
                      Click any row to load the record snapshot here.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-2xl font-semibold tracking-tight">
                          {activeRow?.district_name ?? "No district selected"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {activeRow?.state_name ?? "Select a row to continue"}
                        </p>
                      </div>
                      {activeRow && (
                        <Badge variant="secondary">
                          ID {activeRow.district_id}
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border bg-background p-3">
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                          Stunting
                        </p>
                        <p className="mt-2 text-lg font-semibold tabular-nums">
                          {formatPercent(activeRow?.stunting_pct)}
                        </p>
                      </div>
                      <div className="rounded-xl border bg-background p-3">
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                          Wasting
                        </p>
                        <p className="mt-2 text-lg font-semibold tabular-nums">
                          {formatPercent(activeRow?.wasting_pct)}
                        </p>
                      </div>
                      <div className="rounded-xl border bg-background p-3">
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                          Underweight
                        </p>
                        <p className="mt-2 text-lg font-semibold tabular-nums">
                          {formatPercent(activeRow?.underweight_pct)}
                        </p>
                      </div>
                      <div className="rounded-xl border bg-background p-3">
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                          Sanitation
                        </p>
                        <p className="mt-2 text-lg font-semibold tabular-nums">
                          {formatPercent(activeRow?.improved_sanitation_pct)}
                        </p>
                      </div>
                      <div className="rounded-xl border bg-background p-3">
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                          Schooling
                        </p>
                        <p className="mt-2 text-lg font-semibold tabular-nums">
                          {formatPercent(activeRow?.women_10plus_schooling_pct)}
                        </p>
                      </div>
                      <div className="rounded-xl border bg-background p-3">
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                          Institutional births
                        </p>
                        <p className="mt-2 text-lg font-semibold tabular-nums">
                          {formatPercent(activeRow?.institutional_births_pct)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                      <FileStack className="size-4 text-muted-foreground" />
                      Dataset snapshot
                    </CardTitle>
                    <CardDescription>
                      What the merged table exposes at a glance.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div className="grid gap-2 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">Average schooling</span>
                        <span className="font-medium tabular-nums">
                          {formatPercent(avgSchooling)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">Average sanitation</span>
                        <span className="font-medium tabular-nums">
                          {formatPercent(avgSanitation)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">Average stunting</span>
                        <span className="font-medium tabular-nums">
                          {formatPercent(avgStunting)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">Analysis rows</span>
                        <span className="font-medium tabular-nums">
                          {formatNumber(rowCount)}
                        </span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2 text-xs leading-relaxed text-muted-foreground">
                      <p>
                        The merged analysis table joins geography, nutrition,
                        water, education, and agriculture features into one
                        district-level surface.
                      </p>
                      <p>
                        Use the schema tab to inspect the underlying tables and
                        the sources tab to open the external datasets.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schema" className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {db.metadata.tables.map((table, index) => (
                <Card key={table.name}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <CardTitle className="text-base">{table.name}</CardTitle>
                        <CardDescription>
                          {index === db.metadata.tables.length - 1
                            ? "Merged analysis table"
                            : "Reference table"}
                        </CardDescription>
                      </div>
                      <Badge variant={index === db.metadata.tables.length - 1 ? "default" : "secondary"}>
                        {index + 1}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {table.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardContent className="space-y-4 pt-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="gap-1.5">
                    <Database />
                    District key joins
                  </Badge>
                  <Badge variant="outline" className="gap-1.5">
                    <Layers3 />
                    Normalized geography
                  </Badge>
                  <Badge variant="outline" className="gap-1.5">
                    <Rows3 />
                    Analysis-ready output
                  </Badge>
                </div>
                <Separator />
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Tables are designed to merge on standardized district and
                  state keys, so the explorer can move between raw reference
                  tables and the analysis table without losing provenance.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sources" className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              {db.metadata.sources.map((source) => (
                <Card key={source.name}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{source.name}</CardTitle>
                    <CardDescription>{source.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ExternalLink className="size-4" />
                      <span className="break-all">{source.url}</span>
                    </div>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                      Open source
                      <ExternalLink className="size-4" />
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardContent className="space-y-3 pt-5">
                <Badge variant="secondary">Provenance</Badge>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  These sources feed the district merge that powers the analysis
                  dataset, keeping the explorer tied to the upstream NDAP,
                  NFHS, HMIS, JJM, and agriculture references.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="size-4 text-muted-foreground" />
              Source index
            </CardTitle>
            <CardDescription>
              Direct links to the upstream datasets used in the merged database.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ol className="divide-y rounded-xl border bg-background">
              {db.metadata.sources.map((source, index) => (
                <li
                  key={source.name}
                  className="flex flex-col gap-3 p-4 md:flex-row md:items-start md:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <Badge variant="secondary" className="mt-0.5 shrink-0">
                      {index + 1}
                    </Badge>
                    <div className="space-y-1">
                      <p className="font-medium leading-tight">{source.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {source.description}
                      </p>
                      <p className="break-all text-xs text-muted-foreground">
                        {source.url}
                      </p>
                    </div>
                  </div>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    Open dataset
                    <ExternalLink className="size-4" />
                  </a>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
