"use client";

import React from "react";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  ArrowUpRight,
  Download,
  Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { getReviews, deleteReview, type ReviewItem } from "@/services/reviews";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function ReviewTable() {
  const [reviews, setReviews] = React.useState<ReviewItem[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  const fetchReviews = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await getReviews({ search: searchTerm || undefined });
      setReviews(Array.isArray(data) ? data : []);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  React.useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDelete = async (id: string) => {
    try {
      await deleteReview(id);
      toast.success("Review deleted");
      fetchReviews();
    } catch {
      toast.error("Failed to delete review");
    }
  };

  const handleView = (id: string) => {
    router.push(`/workspace?review=${id}`);
  };

  return (
    <div className="space-y-4">
      {/* Table Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search by file or repository..." 
            className="pl-10 bg-card/50 border-border/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Table Content */}
      <div className="rounded-xl border border-border bg-card/30 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground hidden xl:table-cell">Review ID</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">File & Repository</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Language</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">AI Score</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Date</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {reviews.map((review, i) => (
              <motion.tr 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={review.id} 
                className="hover:bg-white/5 transition-colors group"
              >
                <td className="px-6 py-4 text-sm font-mono text-primary/80 hidden xl:table-cell">{review.id.slice(0, 8)}</td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium">{review.title}</p>
                    <p className="text-xs text-muted-foreground">{review.language}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm hidden sm:table-cell">
                  <Badge variant="outline">{review.language}</Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-12 bg-white/5 rounded-full h-1.5 hidden sm:block">
                      <div 
                        className={`h-full rounded-full ${
                          (review.overall_score ?? 0) > 90 ? "bg-green-500" : (review.overall_score ?? 0) > 75 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                        style={{ width: `${review.overall_score ?? 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold">{review.overall_score ?? "—"}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground hidden md:table-cell">{new Date(review.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <Badge variant={review.status === "critical" ? "destructive" : review.status === "warning" ? "secondary" : "neon"}>
                    {review.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleView(review.id)}>
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass-dark border-border/50">
                        <DropdownMenuItem onClick={() => handleView(review.id)}>View Full Report</DropdownMenuItem>
                        <DropdownMenuItem>Share Review</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(review.id)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        )}

        {/* Empty State */}
        {!loading && reviews.length === 0 && (
          <div className="p-12 text-center space-y-3">
            <Search className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
            <p className="text-lg font-medium">No reviews found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search terms or filters.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <p className="text-xs text-muted-foreground">Showing {reviews.length} of {reviews.length} reviews</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </div>
  );
}
