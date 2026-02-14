import { getAllOrders, updateStatus } from "@/api/order";
import { DataTable } from "@/Components/data-table";
import Loader from "@/Components/Loader";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { toast } from "sonner";
import { ShoppingBag } from "lucide-react";
import { OrderDetailsDialog } from "@/Components/Admin/OrderDetailsDialog";

function Orders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [alignItemWithTrigger, setAlignItemWithTrigger] = useState(true);
  const initialPage = parseInt(searchParams.get("page")) || 1;
  const [page, setPage] = useState(initialPage);
  const queryClient = useQueryClient();
  const [processingId, setProcessingId] = useState(null);

  const { data, isLoading } = useQuery({
    queryFn: () => getAllOrders({ page, limit: 10 }),
    queryKey: ["Orders", page],
    placeholderData: keepPreviousData,
  });

  const { mutate: statusMutate, isPending: statusPending } = useMutation({
    mutationFn: ({ id, data }) => updateStatus(id, data),
    onSuccess: () => {
      toast.success("Successfully updated order status");
      queryClient.invalidateQueries({ queryKey: ["Orders"] });
    },
    onError: (err) => {
      toast.error(err || "Error updating order status");
    },
    onSettled: () => {
      setProcessingId(null);
    },
  });

  const handleStatusChange = (id, status) => {
    setProcessingId(id);
    statusMutate({ id, data: { status } });
  };
  const paymentStatusStyles = {
    paid: "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm hover:bg-emerald-50 hover:text-emerald-700",
    pending:
      "bg-amber-50 text-amber-700 border border-amber-200 shadow-sm hover:bg-amber-50 hover:text-amber-700",
    failed:
      "bg-rose-50 text-rose-700 border border-rose-200 shadow-sm hover:bg-rose-50 hover:text-rose-700",
    refunded:
      "bg-sky-50 text-sky-700 border border-sky-200 shadow-sm hover:bg-sky-50 hover:text-sky-700",
  };

 
  const ORDER_STATUSES = [
    "placed",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled",
  ];
  const columns = [
    {
      accessorKey: "_id",
      header: "Order ID",
      cell: ({ row }) => row.original._id.slice(-6), // last 6 chars
    },
    {
      accessorKey: "user.email",
      header: "Customer",
    },
    {
      header: "Items",
      cell: ({ row }) => row.original.items.length,
    },
    {
      accessorKey: "totalPrice",
      header: "Total (Rs)",
      cell: ({ row }) => `Rs ${row.original.totalPrice}`,
    },
    {
      accessorKey: "paymentMethod",
      header: "Payment",
    },
    {
      accessorKey: "paymentStatus",
      header: "Payment Status",
      cell: ({ row }) => (
        <Badge
          className={`${paymentStatusStyles[row.original.paymentStatus]} capitalize`}
        >
          {row.original.paymentStatus}
        </Badge>
      ),
    },
    {
      accessorKey: "orderStatus",
      header: "Order Status",
      cell: ({ row }) => (
        <Select
          defaultValue={row.original.orderStatus}
          onValueChange={(value) => handleStatusChange(row.original._id, value)}
          disabled={statusPending && processingId === row.original._id}
        >
          <SelectTrigger
            className="w-[120px]"
            disabled={statusPending && processingId === row.original._id}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            position={alignItemWithTrigger ? "item-aligned" : "popper"}
          >
            <SelectGroup>
              {ORDER_STATUSES.map((item, i) => (
                <SelectItem key={i} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        // <Badge
        //   className={`${orderStatusStyles[row.original.orderStatus]} capitalize`}
        // >
        //   {row.original.orderStatus}
        // </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Ordered At",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <OrderDetailsDialog order={row.original} />,
    },
  ];

  const handlePageChange = (page) => {
    setPage(page);
    setSearchParams({ page });
  };
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="p-6 space-y-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <ShoppingBag className="text-primary h-8 w-8" />
          Order Management
        </h1>
        <p className="text-slate-500 font-medium">
          Monitor and manage customer orders and fulfillment.
        </p>
      </div>

      <DataTable columns={columns} data={data?.data ?? []} />
      {/* <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => handlePageChange(Math.max(page - 1, 1))}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={isPlaceholderData || !data?.nextPage}
          onClick={() => handlePageChange(page + 1)}
        >
          Next
        </Button>
      </div> */}
      <div className="flex mt-4 justify-end items-center gap-1.5">
        {[...Array(data.pages)].map((_, i) => {
          const pageNum = i + 1;
          // Show current page, first, last, and one around current
          if (
            pageNum === 1 ||
            pageNum === data.pages ||
            (pageNum >= page - 1 && pageNum <= page + 1)
          ) {
            return (
              <Button
                key={pageNum}
                variant={page === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(pageNum)}
                className={`h-11 w-11 rounded-2xl font-bold shadow-sm ${page !== pageNum ? "border-slate-200 hover:bg-white" : ""}`}
              >
                {pageNum}
              </Button>
            );
          }
          // Show ellipsis for gaps
          if (pageNum === page - 2 || pageNum === page + 2) {
            return (
              <span key={pageNum} className="px-1 text-slate-400 font-bold">
                ...
              </span>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

export default Orders;
