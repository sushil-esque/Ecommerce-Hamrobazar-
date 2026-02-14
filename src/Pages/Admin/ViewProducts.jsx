"use client";

import { deleteProduct, getAllProducts } from "@/api/products";
import { DataTable } from "@/Components/data-table";
import Loader from "@/Components/Loader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";
import { Button } from "@/Components/ui/button";
import { Spinner } from "@/Components/ui/spinner";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Package } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export default function ViewProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get("page")) || 1;
  const [deletingId, setDeletingId] = useState();
  const [page, setPage] = useState(initialPage);

  const navigate = useNavigate();

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSearchParams({ page: newPage });
  };
  const { data, isLoading, isFetching, isPlaceholderData } = useQuery({
    queryKey: ["products", page],
    queryFn: () => getAllProducts({ pageParam: page }),
    placeholderData: keepPreviousData,
  });
  const queryClient = useQueryClient();

  const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted Successfully");
    },
    onError: (error) => {
      console.error("Error deleting product:", error);
      toast.error(error.error || "Something went wrong");
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("price"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);

        return <div>{formatted}</div>;
      },
    },
    {
      accessorKey: "stock",
      header: "Stock",
    },
    {
      accessorKey: "category.name",
      header: "Category",
    },
    {
      accessorKey: "image.url",
      header: "Image",
      cell: (info) => {
        const imageUrl = info.getValue();
        return imageUrl ? (
          <img
            src={imageUrl}
            alt="Product"
            className="w-10 h-10 object-cover"
          />
        ) : (
          <span>No image</span>
        );
      },
    },
    {
      accessorKey: "images",
      header: "Images",
      cell: (info) => {
        const images = info.getValue();
        return images && images.length > 0 ? (
          <div className="flex space-x-2">
            {images.map((img, index) => (
              <img
                key={index}
                src={img.url}
                alt={`Product ${index + 1}`}
                className="w-10 h-10 object-cover"
              />
            ))}
          </div>
        ) : (
          <span>No images</span>
        );
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: (info) => {
        const productId = info.row.original._id;
        return (
          <div className="flex gap-2 w-[100px]">
            <Button
              size="sm"
              className=""
              variant="outline"
              onClick={() =>
                navigate(`/AdminDashboard/editProduct/${productId}`)
              }
            >
              <CiEdit />
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger>
                <Button
                  disabled={isDeleting && deletingId === productId}
                  size="sm"
                  variant="outline"
                  className="group hover:bg-red-500 "
                >
                  {isDeleting && deletingId === productId ? (
                    <span className="flex gap-2">
                      <Spinner /> deleting
                    </span>
                  ) : (
                    <RiDeleteBin5Line className="text-red-500 group-hover:text-white" />
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the product.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      deleteMutate(productId);
                      setDeletingId(productId);
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="p-6 space-y-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <Package className="text-primary h-8 w-8" />
          Product Catalog
        </h1>
        <p className="text-slate-500 font-medium">
          Manage and view all your products in one place.
        </p>
      </div>

      <DataTable columns={columns} data={data?.data ?? []} />
      <div className="flex items-center justify-end space-x-2 py-4">
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
      </div>
    </div>
  );
}
