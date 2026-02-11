import { getUserOrders } from "@/api/order";
import { addReview } from "@/api/review";
import Loader from "@/Components/Loader";
import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  CreditCard,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  LucideStar,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/Components/ui/dialog";
import {  useForm } from "react-hook-form";
import { Textarea } from "@/Components/ui/textarea";
import { toast } from "sonner";
import { Spinner } from "@/Components/ui/spinner";

const getOrderStatusInfo = (status) => {
  switch (status?.toLowerCase()) {
    case "placed":
      return {
        label: "Placed",
        color: "bg-blue-50 text-blue-700 border-blue-200",
        icon: <Clock size={14} className="mr-1" />,
      };
    case "confirmed":
      return {
        label: "Confirmed",
        color: "bg-indigo-50 text-indigo-700 border-indigo-200",
        icon: <Package size={14} className="mr-1" />,
      };
    case "shipped":
      return {
        label: "Shipped",
        color: "bg-amber-50 text-amber-700 border-amber-200",
        icon: <Truck size={14} className="mr-1" />,
      };
    case "delivered":
      return {
        label: "Delivered",
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: <CheckCircle2 size={14} className="mr-1" />,
      };
    case "cancelled":
      return {
        label: "Cancelled",
        color: "bg-rose-50 text-rose-700 border-rose-200",
        icon: <XCircle size={14} className="mr-1" />,
      };
    default:
      return {
        label: status || "Processing",
        color: "bg-slate-50 text-slate-700 border-slate-200",
        icon: <Clock size={14} className="mr-1" />,
      };
  }
};

const getPaymentStatusInfo = (status) => {
  switch (status?.toLowerCase()) {
    case "paid":
      return {
        label: "Paid",
        color: "bg-emerald-500 text-white border-transparent",
      };
    case "failed":
      return {
        label: "Failed",
        color: "bg-rose-50 text-rose-700 border-rose-200",
      };
    default:
      return {
        label: "Pending",
        color: "bg-amber-50 text-amber-700 border-amber-200",
      };
  }
};

function UserOrders() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get("page")) || 1;
  const [page, setPage] = useState(initialPage);
  const [rating, setRating] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["UserOrders", page],
    queryFn: () => getUserOrders({ page }),
  });

  const { mutate: reviewMutate, isPending } = useMutation({
    mutationFn: addReview,
    onSuccess: () => {
      toast.success("Review submitted successfully!");
      setOpenDialogId(null);
      form.reset();
      setRating(null);
    },
    onError: (error) => {
      toast.error(error.error || "Failed to submit review");
    },
  });
  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSearchParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const form = useForm({
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const [openDialogId, setOpenDialogId] = useState(null);

  const onRatingSubmit = async (values, productId, orderId) => {
    if (values.rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    const payload = {
      rating: values.rating,
      orderId,
    };
    console.log(payload);
    if (values.comment?.trim()) {
      payload.comment = values.comment.trim();
    }
    reviewMutate({ id: productId, data: payload });
  };

  if (isLoading) return <Loader />;

  if (isError)
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <div className="bg-rose-50 p-4 rounded-full mb-4">
          <AlertCircle size={40} className="text-rose-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          Failed to load orders
        </h2>
        <p className="text-slate-500 mt-2 max-w-md mx-auto">
          There was an error fetching your order history. This might be due to a
          connection issue or a server error.
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="mt-8 rounded-full px-8"
        >
          Try Again
        </Button>
      </div>
    );

  const orders = data?.data || [];

  return (
    <div className="min-h-screen  pb-20">
      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Purchase History
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Keep track of your orders and their delivery status
            </p>
          </div>
          <div className="bg-white border shadow-sm px-4 py-2 rounded-xl text-sm font-semibold text-slate-700">
            Total Orders:{" "}
            <span className="text-primary ml-1">{data?.total || 0}</span>
          </div>
        </div>

        {orders.length === 0 ? (
          <Card className="border-dashed border-2 bg-white/50 py-16">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <div className="bg-slate-100 p-6 rounded-full mb-6">
                <Package size={48} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                No orders yet
              </h3>
              <p className="text-slate-500 mt-2 max-w-xs">
                Looks like you haven&apos;t placed any orders. Discover amazing
                products and start shopping!
              </p>
              <Button
                className="mt-8 rounded-full px-8"
                onClick={() => (window.location.href = "/")}
              >
                Explore Store
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => {
              const orderStatus = getOrderStatusInfo(order.orderStatus);
              const paymentStatus = getPaymentStatusInfo(order.paymentStatus);

              return (
                <Card
                  key={order._id}
                  className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white"
                >
                  <CardHeader className="bg-slate-50/80 pb-6 border-b border-slate-100 px-6 sm:px-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 grow">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1.5 font-mono">
                            Order Placed
                          </p>
                          <div className="flex items-center text-sm font-bold text-slate-700">
                            <Calendar
                              size={14}
                              className="mr-2 text-slate-400"
                            />
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1.5 font-mono">
                            Total Amount
                          </p>
                          <p className="text-sm font-black text-slate-900">
                            Rs. {order.totalPrice.toLocaleString()}
                          </p>
                        </div>
                        <div className="hidden sm:block">
                          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1.5 font-mono">
                            Ship To
                          </p>
                          <div className="flex items-center text-sm font-bold text-slate-700 truncate max-w-[150px]">
                            <MapPin size={14} className="mr-2 text-slate-400" />
                            {order.shippingAddress.fullName}
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1.5 font-mono">
                            Order Id
                          </p>
                          <p className="text-sm font-mono font-bold text-primary italic">
                            {order._id.slice(-6)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          className={`${orderStatus.color} hover:bg-inherit font-bold px-3 py-1.5 rounded-lg flex items-center shadow-none border-2`}
                        >
                          {orderStatus.icon}
                          <span className="uppercase text-[10px] tracking-wider">
                            {orderStatus.label}
                          </span>
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 sm:p-8">
                    <div className="space-y-8">
                      {order.items.map((item) => (
                        <div
                          key={item._id}
                          className="flex flex-col sm:flex-row gap-6 group"
                        >
                          <div className="relative h-24 w-24 sm:h-28 sm:w-28 flex-shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-inner group-hover:scale-105 transition-transform duration-300">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.src =
                                  "https://placehold.co/200x200?text=Product";
                              }}
                            />
                            <div className="absolute top-1 right-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-lg text-[10px] font-black shadow-sm border border-slate-100">
                              x{item.quantity}
                            </div>
                          </div>
                          <div className="flex grow flex-col justify-between py-1">
                            <div>
                              <h4 className="font-extrabold text-lg text-slate-800 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                {item.name}
                              </h4>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-tighter">
                                  SKU: {item.product.slice(-6).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="mt-4 sm:mt-0 flex items-center flex-wrap gap-2 justify-between">
                              <div className="sm:hidden text-xs text-slate-500 font-bold">
                                Qty: {item.quantity}
                              </div>
                              <div className="flex gap-4 items-center">
                                <p className="font-black text-xl text-primary">
                                  Rs. {item.price.toLocaleString()}
                                </p>
                                {order.orderStatus === "delivered" && (
                                  <Dialog
                                    open={openDialogId === item._id}
                                    onOpenChange={(open) => {
                                      if (open) {
                                        setOpenDialogId(item._id);
                                        form.reset({ rating: 0, comment: "" });
                                        setRating(null);
                                      } else {
                                        setOpenDialogId(null);
                                      }
                                    }}
                                  >
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-xl font-bold"
                                      >
                                        Rate Product
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md rounded-3xl">
                                      <DialogHeader>
                                        <DialogTitle className="text-xl font-black">
                                          Share your feedback
                                        </DialogTitle>
                                        <DialogDescription className="font-medium text-slate-500">
                                          How would you rate{" "}
                                          <span className="text-primary font-bold">
                                            {item.name}
                                          </span>
                                          ?
                                        </DialogDescription>
                                      </DialogHeader>

                                      <div className="py-6 flex flex-col items-center gap-6">
                                        <div className="flex gap-2">
                                          {Array.from({ length: 5 }).map(
                                            (_, i) => {
                                              const starValue = i + 1;
                                              return (
                                                <button
                                                  key={i}
                                                  type="button"
                                                  onClick={() => {
                                                    setRating(starValue);
                                                    form.setValue(
                                                      "rating",
                                                      starValue,
                                                    );
                                                  }}
                                                  className="transition-transform active:scale-95 focus:outline-none group"
                                                >
                                                  <LucideStar
                                                    size={36}
                                                    className={`transition-all duration-200 ${
                                                      starValue <= (rating || 0)
                                                        ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]"
                                                        : "text-slate-200 group-hover:text-slate-300"
                                                    }`}
                                                  />
                                                </button>
                                              );
                                            },
                                          )}
                                        </div>

                                        <div className="w-full space-y-4">
                                          <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
                                              Review Details (Optional)
                                            </label>
                                            <Textarea
                                              placeholder="What did you like or dislike? How's the quality?"
                                              className="min-h-[120px] rounded-2xl border-slate-200 focus:ring-primary/20 focus:border-primary resize-none p-4"
                                              {...form.register("comment")}
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      <DialogFooter className="sm:justify-end gap-3">
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          onClick={() => setOpenDialogId(null)}
                                          className="font-bold rounded-xl"
                                        >
                                          Cancel
                                        </Button>
                                        <Button
                                          type="button"
                                          disabled={isPending}
                                          onClick={form.handleSubmit((values) =>
                                            onRatingSubmit(
                                              values,
                                              item.product,
                                              order._id,
                                            ),
                                          )}
                                          className="rounded-xl px-8 font-bold shadow-lg shadow-primary/20"
                                        >
                                          {isPending ? (
                                            <Spinner className="w-4 h-4 mr-2" />
                                          ) : null}
                                          Submit Review
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  <div className="px-6 sm:px-8">
                    <Separator className="bg-slate-100" />
                  </div>

                  <CardFooter className="py-6 px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6 text-xs w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                      <div className="flex items-center bg-slate-100/50 px-3 py-1.5 rounded-full whitespace-nowrap">
                        <CreditCard size={14} className="mr-2 text-slate-400" />
                        <span className="font-bold text-slate-600">
                          {order.paymentMethod}
                        </span>
                      </div>
                      <div className="flex items-center whitespace-nowrap">
                        <span className="text-slate-300 mr-4">|</span>
                        <Badge
                          variant="outline"
                          className={`${paymentStatus.color} text-[9px] px-2.5 py-1 rounded-full uppercase tracking-widest font-black shadow-none border-2`}
                        >
                          {paymentStatus.label}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-10 rounded-xl px-6 font-bold text-xs grow sm:grow-0 border-slate-200 hover:bg-slate-50"
                      >
                        View Details
                      </Button>
                      {order.orderStatus !== "delivered" ? (
                        <Button
                          size="sm"
                          className="h-10 rounded-xl px-6 font-bold text-xs grow sm:grow-0 shadow-lg shadow-primary/20"
                        >
                          Track Delivery
                        </Button>
                      ) : null}
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {data?.pages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="icon"
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
              className="h-11 w-11 rounded-2xl shadow-sm border-slate-200"
            >
              <ChevronLeft size={20} />
            </Button>

            <div className="flex items-center gap-1.5">
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
                    <span
                      key={pageNum}
                      className="px-1 text-slate-400 font-bold"
                    >
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <Button
              variant="outline"
              size="icon"
              disabled={!data?.nextPage}
              onClick={() => handlePageChange(page + 1)}
              className="h-11 w-11 rounded-2xl shadow-sm border-slate-200"
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserOrders;
