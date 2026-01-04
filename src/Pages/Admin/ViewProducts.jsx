"use client";

import { getAllProducts } from "@/api/products";
import { DataTable } from "@/Components/data-table";
import Loader from "@/Components/Loader";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export default function ViewProducts() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
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
          <div className="flex gap-2">
            <button
              className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => navigate(`/AdminDashboard/editProduct/${productId}`)}
            >
              Edit
            </button>
            <button className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
              Delete
            </button>
          </div>
        );
      },
    },
  ];
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className=" mt-20 mx-10 py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
