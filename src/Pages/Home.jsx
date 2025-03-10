import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/products";
import { TbCategory2, TbCurrencyRupeeNepalese } from "react-icons/tb";
import { getAllCategory } from "../api/allCategory";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import useAuthStore from "../store/useAuthStore";
import Loader from "@/Components/Loader";
import { useNavigate } from "react-router-dom";

function Home() {
  const{count, inc, setCount} = useAuthStore();
  const [selectedCategory, setSelectedCategory] = useState("all");
  // const { data, error, isLoading, isError } = useQuery({
  //   queryKey: ["products"],
  //   queryFn: getProducts,
  //   retry: 2,
  // });
  // console.log(data?.data);

    const[toggle, setToggle] = useState(false);
    const navigate = useNavigate();
    const handleToggle = () => {
        setToggle(!toggle);
    }
console.log(toggle);
  const {
    data: categoryData,
    error: categoryError,
    isLoading: categoryLoading,
    isError: categoryIsError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategory,
    retry: 2,
  });
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["products", selectedCategory],
    queryFn: () =>
      getProducts(selectedCategory === "all" ? "" :`/category/${selectedCategory}`),
    retry: 2,
  });
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  console.log(categoryData);
  if (isLoading || categoryLoading) {
    return (
      <Loader/>
    )
  }
  if (isError) {
    return <div>error....</div>;
  }
  const categories = categoryData?.map((category, index) => (
    <li key={index} onClick={() => handleCategoryClick(category)} className="border-b-2">
      <a
        href="#"
        className="block rounded-lg px-4 py-2 text-lg font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
      >
        {category}
      </a>
    </li>
  ));
  const products = data?.map((product, index) => (
    <div
      key={product.id}
      className="md:w-[600px] h-fit mx-0 border-b-2  flex"
    >
      <div className="border-2 border-transparent rounded-2xl hover:bg-slate-100 hover:border-2 hover:border-blue-300 p-2 flex">
      <div className="relative w-[8.125rem] shrink-0">
        <img
          className="h-[7.625rem] object-contain w-[8rem] bg-inherit"
          src={product.image}
          alt="Product Image"
        />
        <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 m-2 rounded-md text-sm font-medium">
          SALE
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium mb-2">{product.title}</h3>
        <p className="text-gray-600 text-sm mb-4">
          {product.description.length > 200
            ? `${product.description.slice(0, 200)}...`
            : product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-lg">$ {product.price}</span>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" onClick={()=> navigate(`/product/${product.id}`)}>
            Buy Now
          </button>
        </div>
      </div>
      </div>
     
    </div>
  ));
const sidebar =  (
  <div className="flex h-screen flex-col justify-between border-e bg-white fixed top-0 left-0  w-[60%] shadow-md z-50"
    >
  <div className="px-4 py-6 ">
    <div className="flex items-center gap-2 border-b-2  -mx-4 px-3 justify-between ">
      <div className=" text-3xl">
        <TbCategory2 />
      </div>
      <div className="grid h-10 place-content-center rounded-lg text-lg font-semibold text-black">
        Category
      </div>
      <div>
        <button onClick={handleToggle} className="text-3xl">
          <IoClose/>
        </button>
      </div>
    </div>

    <ul className="mt-6 space-y-1">
    <li onClick={() => handleCategoryClick("all")} className="border-b-2">
      <a
        href="#"
        className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
      >
        All
      </a>
    </li>
      {categories}


    </ul>
  </div>
</div>

)
  return (
    <div className="flex lg:mx-24 md:mx-4 sm:mx-4 box-border">
          {/* <div>
      <span>{count}</span>
      <button onClick={() => setCount("apple")}>set count</button>
      <button onClick={inc}>one up</button>
    </div> */}
      {categoryData && <div className="sm:flex h-screen flex-col justify-between border-e bg-white   sticky top-20 hidden w-[28%] ">
        <div className="px-4 py-6 ">
          <div className="flex items-center gap-2 border-b-2  -mx-4 px-3">
            <div className=" text-3xl">
              <TbCategory2 />
            </div>
            <div className="grid h-10 place-content-center rounded-lg text-lg font-semibold text-black">
              Category
            </div>
          </div>

          <ul className="mt-6 space-y-1">
          <li onClick={() => handleCategoryClick("all")} className="border-b-2">
            <a
              href="#"
              className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              All
            </a>
          </li>
            {categories}

  
          </ul>
        </div>
      </div> }
      
{toggle? sidebar : null}

{data&&   <div className="flex flex-col gap-5 border-r-2 p-4">
        <div className="md:w-[600px] h-fit mx-0  border-b-2 flex p-4 text-l items-center gap-3 sticky top-[64px] z-10 bg-white"> <TbCategory2 className="text-2xl block sm:hidden" onClick={()=>handleToggle()}/> Category: {selectedCategory}</div>
        {products}</div>
    }
     </div>
  );
}

export default Home;
