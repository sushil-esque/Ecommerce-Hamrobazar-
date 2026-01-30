import useAddToCart from "@/hooks/useAddToCart";
import { formatPrice } from "@/utils/formatPrice";
import { Separator } from "@radix-ui/react-select";
import { CiBookmarkPlus } from "react-icons/ci";
import { GoShareAndroid } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { Spinner } from "./ui/spinner";

function GridCard({ product }) {
  const navigate = useNavigate();

  const { handleAddToCart, addingtoCart } = useAddToCart();

  return (
    <div className="h-full">
      <div className="h-full mx-0">
        <div className="h-full border-2 w-full border-transparent rounded-2xl hover:bg-slate-100 hover:border-2 hover:border-blue-300 p-2 flex flex-col gap-2">
          <div className="shrink-0 flex justify-center">
            <img
              className="object-contain cursor-pointer h-32 w-full bg-inherit rounded-md"
              src={product.image.url}
              onClick={() => navigate(`/product/${product?._id}`)}
              alt="Product Image"
            />
          </div>

          <div className="w-full flex-grow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-1">
                <h3
                  className="text-[0.813rem] cursor-pointer font-[600] mb-2 underline decoration-gray-400 underline-offset-4 line-clamp-2"
                  onClick={() => navigate(`/product/${product?._id}`)}
                >
                  {product.name}
                </h3>
                <GoShareAndroid className="shrink-0" />
              </div>

              <p className="text-gray-600 text-xs font-medium mb-4">
                {product.category.name}
              </p>
            </div>

            <div className="flex items-center justify-between w-full mt-auto">
              <div className="flex h-4 items-center gap-2">
                <span className="text-[0.813rem] font-[600]">
                  रू {formatPrice(product.price)}
                </span>
                <Separator className="bg-black" orientation="vertical" />
              </div>
              <button
                className="cursor-pointer h-[20px] w-[20px] flex justify-center items-center"
                onClick={() => handleAddToCart(product)}
                disabled={addingtoCart}
              >
                {addingtoCart ? <Spinner /> : <CiBookmarkPlus className="text-xl font-bold" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GridCard;
