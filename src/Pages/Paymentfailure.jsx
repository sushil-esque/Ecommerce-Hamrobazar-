import { Button } from "@/Components/ui/button";
import { XCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { updateFailedStatus } from "@/api/order";
import { useEffect, useRef } from "react";

function Paymentfailure() {
  const navigate = useNavigate();
  const location = useLocation();
  const errorMsg = location.state?.error;
  const processedRef = useRef(false);

  const updateStatusMutation = useMutation({
    mutationFn: updateFailedStatus,
    onError: (error) => {
      console.error("Failed to update order status:", error);
    },
  });

  useEffect(() => {
    if (!processedRef.current) {
      updateStatusMutation.mutate();
      processedRef.current = true;
    }
  }, [updateStatusMutation]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="bg-red-50 p-6 rounded-full mb-6">
        <XCircle className="w-16 h-16 text-red-500" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        {errorMsg ||
          "Something went wrong with your transaction. Your payment was not processed, or the verification failed."}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-md justify-center">
        <Button
          variant="outline"
          className="w-full sm:w-auto px-8"
          onClick={() => navigate("/")}
        >
          Back to Home
        </Button>
        <Button
          className="w-full sm:w-auto px-8"
          onClick={() => navigate("/checkout")}
        >
          Try Again
        </Button>
      </div>

      <p className="mt-8 text-sm text-gray-400">
        If you believe this is an error, please contact our support team.
      </p>
    </div>
  );
}

export default Paymentfailure;
