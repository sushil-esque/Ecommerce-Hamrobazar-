import { getProducts } from "@/api/products";
import Loader from "@/Components/Loader";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { CiShoppingCart } from "react-icons/ci";
import { TbCurrencyRupeeNepalese } from "react-icons/tb";
import { GoShareAndroid } from "react-icons/go";

function SingleProduct() {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["singleProduct", id],
    queryFn: () => getProducts(`/${id}`),
    retry: 2,
  });
  if (isLoading) {
    return <Loader />;
  }
  if (isError) {
    return <div>Something went wrong</div>;
  }
  console.log(data);
  return (
    <div className="lg:mx-24 md:mx-4 sm:mx-4 mb-24">
      <div className="flex gap-5 flex-wrap">
        <div className="w-[340px] h-full p-5 flex flex-col">
          <img
            src={data.image}
            alt="image"
            className="w-[331px] h-[270px] object-contain rounded-md "
          />
          <div className="border-t-2 mt-3 flex items-center justify-center gap-6 p-2">
            <div className="flex items-center gap-1 justify-center cursor-pointer">
              <CiShoppingCart className="text-2xl" />
              <div className="text-gray-400">Add to cart</div>
            </div>
            <div className="w-px h-4 bg-gray-300 mx-2"></div> {/* Gray line */}
            <div className="flex items-center gap-1 justify-center">
              <TbCurrencyRupeeNepalese />
              <div className=" font-bold">{data.price}</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5 border-x-2 p-5 w-[615px] py-16">
          <div>
            <div className="text-xl font-bold ">{data.title}</div>
            <div className="text-gray-500 italic">{data.category}</div>
          </div>
          <div >
            <div className="text-lg border-y-2 flex justify-between items-center py-2">
              <div>Description</div>
              <div>
                <GoShareAndroid />
              </div>
            </div>

            <div className="text-gray-700">{data.description}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleProduct;
