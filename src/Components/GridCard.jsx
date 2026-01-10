import { Separator } from "@radix-ui/react-select"
import { CiBookmarkPlus } from "react-icons/ci"
import { GoShareAndroid } from "react-icons/go"

function GridCard({product}) {
  return (
   <div  className="">
         <div className=" h-fit mx-0   flex">
           <div className="border-2 w-full border-transparent rounded-2xl hover:bg-slate-100 hover:border-2 hover:border-blue-300 p-2 flex flex-col gap-2">
             <div className="shrink-0 flex justify-center">
               <img
                 className=" object-cover h-32 w-full bg-inherit rounded-md"
                 src={product.image.url}
                 alt="Product Image"
               />
             </div>
   
             <div className="w-full">
               <div className="flex items-center justify-between">
                 <h3 className=" text-[0.813rem] font-[600] mb-2 underline decoration-gray-400 underline-offset-4">
                   {product.name}
                 </h3>
                 <GoShareAndroid />
               </div>
   
               <p className="text-gray-600 text-xs font-medium mb-4">
                 {product.category.name}
               </p>
               <div className="flex items-center justify-between w-full">
                 <div className="flex h-4 items-center gap-2">
                   <span className="text-[0.813rem] font-[600] ">
                     रू {product.price}
                   </span>
                   <Separator className=" bg-black" orientation="vertical" />
                 </div>
                 <div className="">
                   <CiBookmarkPlus className="text-xl font-bold" />
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>
  )
}

export default GridCard