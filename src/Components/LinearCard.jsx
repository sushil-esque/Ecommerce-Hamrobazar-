import { addtoCart } from "@/api/cart";
import useAuthStore from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { Separator } from "@radix-ui/react-select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CiBookmarkPlus } from "react-icons/ci";
import { GoShareAndroid } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function LinearCard({ product }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const addToLocalCart = useCartStore((state) => state.addToLocalCart);
  const { mutate: cartMutate, isPending: addingtoCart } = useMutation({
    mutationFn: addtoCart,
    onSuccess: () => {
      toast.success("Product added to cart");
      queryClient.invalidateQueries({ queryKey: ["cart"]});
    },
    onError: (err) => {
      toast.error(err.error || "Failed to add to cart");
    },
  });
  const handleAddToCart = (product) => {
    if (!user) {
      addToLocalCart(product);
      toast.success("Product added to cart");
    } else {
      const items = [
        {
          product: product._id,
          quantity: 1,
        },
      ];
      cartMutate(items);
    }
  };

  return (
    <div className="">
      <div className=" h-fit mx-0   flex">
        <div className="border-2 w-full border-transparent rounded-2xl hover:bg-slate-100 hover:border-2 hover:border-blue-300 p-2 flex gap-2">
          <div className="relative w-[8.125rem] shrink-0">
            <div className="">
              <img
                className="h-[7.625rem] object-cover w-[8rem] bg-inherit rounded-md"
                src={product.image.url}
                onClick={() => navigate(`/product/${product?._id}`)}
                alt="Product Image"
              />
              <div className="mt-2 flex w-full justify-center gap-3 items-center">
                {product.images &&
                  product.images.length > 0 &&
                  product.images.map((img, idx) => (
                    <img
                      key={idx}
                      className="h-5 w-5 object-cover rounded-[2px]   "
                      src={img.url}
                      alt={`Additional Image ${idx + 1}`}
                    />
                  ))}
              </div>
            </div>
          </div>
          <div className="w-full">
            <div className="flex items-center justify-between">
              <h3 className=" text-[0.813rem] font-[600] mb-2 underline decoration-gray-400 underline-offset-4">
                {product.name}
              </h3>
              <GoShareAndroid />
            </div>

            <p className="text-gray-600 text-xs font-medium mb-4">
              {product.description.length > 200
                ? `${product.description.slice(0, 200)}...`
                : product.description}
            </p>
            <div className="flex items-center justify-between w-full">
              <div className="flex h-4 items-center gap-2">
                <span className="text-[0.813rem] font-[600]  whitespace-nowrap ">
                  रू {product.price}
                </span>
                <Separator className=" bg-black" orientation="vertical" />
                <span className="text-xs whitespace-nowrap ">
                  {" "}
                  {product.category.name}
                </span>
              </div>
              <div className="">
                <CiBookmarkPlus
                  onClick={() => handleAddToCart(product)}
                  className="text-xl font-bold cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Separator className="w-full h-px bg-gray-300 mt-4" />{" "}
    </div>
  );
}

export default LinearCard;
