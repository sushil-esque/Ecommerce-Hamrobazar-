import { esewaVerify } from "@/api/order";
import Loader from "@/Components/Loader";
import { useCartStore } from "@/store/useCartStore";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

function PaymentSucess() {
  const [params] = useSearchParams();
  const processedRef = useRef(false);
  const resData = atob(params.get("data"));
  const resObject = JSON.parse(resData);
  const navigate = useNavigate();
  console.log(resObject);
  const verifyEsewaMutation = useMutation({
    mutationFn: esewaVerify,
    onSuccess: () => {
      useCartStore.getState().clearCart();
      toast.success("Order placed sucessfully");
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.error || "Verification failed");
      navigate("/paymentfailure", {
        state: { error: error.error || "Verification failed" },
      });
    },
  });
  useEffect(() => {
    if (params.get("data") && !processedRef.current) {
      verifyEsewaMutation.mutate(resObject);
      processedRef.current = true;
    }
  }, [params, resObject, verifyEsewaMutation]);

  return (
    <Loader loadingText={"verifying product please dont closee this tab"} />
  );
}

export default PaymentSucess;
