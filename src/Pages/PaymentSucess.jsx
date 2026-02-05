import { esewaVerify } from "@/api/order";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

function PaymentSucess() {
  const [params] = useSearchParams();
  const processedRef = useRef(false);
  const resData = atob(params.get("data"));
  const resObject = JSON.parse(resData);
  console.log(resObject);
  const verifyEsewaMutation = useMutation({
    mutationFn: esewaVerify,
    onSuccess: () => {
      toast.success("Payment verified sucessfully");
    },
    onError: (error) => {
      toast.error(error.error);
    },
  });
  useEffect(() => {
    if (params.get("data") && !processedRef.current) {
      verifyEsewaMutation.mutate(resObject);
      processedRef.current = true;
    }
  }, []);

  return <div>...verifying</div>;
}

export default PaymentSucess;
