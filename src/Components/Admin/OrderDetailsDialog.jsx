import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Eye, Package, MapPin, User, CreditCard, Calendar } from "lucide-react";

export function OrderDetailsDialog({ order }) {
  const paymentStatusStyles = {
    paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    failed: "bg-rose-50 text-rose-700 border-rose-200",
    refunded: "bg-sky-50 text-sky-700 border-sky-200",
  };

  const orderStatusStyles = {
    placed: "bg-slate-50 text-slate-700 border-slate-200",
    confirmed: "bg-blue-50 text-blue-700 border-blue-200",
    shipped: "bg-violet-50 text-violet-700 border-violet-200",
    delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Eye className="h-4 w-4" />
          <span className="sr-only">View Details</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Order Details #{order._id.slice(-6).toUpperCase()}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Customer & Shipping Info */}
          <div className="space-y-6">
            <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <User size={14} /> Customer Information
              </h3>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-700">
                  {order.shippingAddress.fullName}
                </p>
                <p className="text-sm text-slate-500">{order.user.email}</p>
                <p className="text-sm text-slate-500">
                  {order.shippingAddress.phone}
                </p>
              </div>
            </div>

            <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <MapPin size={14} /> Shipping Address
              </h3>
              <div className="space-y-1">
                <p className="text-sm text-slate-700 font-medium">
                  {order.shippingAddress.address}
                </p>
                <p className="text-sm text-slate-500">
                  {order.shippingAddress.city}
                </p>
              </div>
            </div>
          </div>

          {/* Status & Payment Info */}
          <div className="space-y-6">
            <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Calendar size={14} /> Order Status
              </h3>
              <div className="flex flex-wrap gap-3">
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">
                    Status
                  </p>
                  <Badge
                    className={`${orderStatusStyles[order.orderStatus]} hover:bg-inherit  capitalize shadow-none border px-2 py-0.5`}
                  >
                    {order.orderStatus}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">
                    Ordered At
                  </p>
                  <p className="text-sm font-semibold text-slate-700">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <CreditCard size={14} /> Payment Information
              </h3>
              <div className="flex flex-wrap gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">
                    Method
                  </p>
                  <p className="text-sm font-bold text-slate-700 uppercase tracking-tighter">
                    {order.paymentMethod}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">
                    Status
                  </p>
                  <Badge
                    className={`${paymentStatusStyles[order.paymentStatus]} hover:bg-inherit capitalize shadow-none border px-2 py-0.5`}
                  >
                    {order.paymentStatus}
                  </Badge>
                </div>
                {order.isPaid && (
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-tight">
                      Paid At
                    </p>
                    <p className="text-sm font-semibold text-slate-700">
                      {new Date(order.paidAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-2" />

        {/* Order Items */}
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
            Order Items
          </h3>
          <div className="rounded-xl border border-slate-100 overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-12 w-12 rounded-lg object-cover border border-slate-100 shadow-sm"
                        onError={(e) => {
                          e.target.src =
                            "https://placehold.co/100x100?text=Product";
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <p className="font-bold text-slate-800 text-sm line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        ID: {item.product.slice(-6)}
                      </p>
                    </TableCell>
                    <TableCell className="text-center font-bold text-slate-600">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-slate-600">
                      Rs {item.price.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-bold text-primary">
                      Rs {(item.price * item.quantity).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="flex justify-end mt-6">
          <div className="w-full md:w-64 space-y-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-medium">Subtotal</span>
              <span className="font-bold text-slate-700">
                Rs {order.itemsPrice.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-medium">Shipping Fee</span>
              <span className="font-bold text-slate-700">
                Rs {order.shippingPrice.toLocaleString()}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center pt-1">
              <span className="text-base font-black text-slate-900 uppercase tracking-tighter">
                Total Price
              </span>
              <span className="text-xl font-black text-primary">
                Rs {order.totalPrice.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
