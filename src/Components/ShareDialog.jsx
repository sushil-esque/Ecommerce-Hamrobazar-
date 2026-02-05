import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { useState } from "react";
import { FaFacebook, FaFacebookMessenger, FaWhatsapp } from "react-icons/fa";
import { FaClipboardCheck, FaRegClipboard } from "react-icons/fa6";

function ShareDialog({ product, children }) {
  const [copied, setCopied] = useState(false);

  const url = `${window.location.origin}/product/${product?._id}`;
  const text = `Check out this product: ${product?.name}`;
  const shareLinks = {
    whatsapp: `https://wa.me/?text=${text}%20${url}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}&hashtag=%23ShopNow`,
    messenger: `https://www.facebook.com/dialog/send?link=${url}&app_id=YOUR_FB_APP_ID&redirect_uri=${url}`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild className="cursor-pointer">
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share this product</DialogTitle>
          <DialogDescription>
            <div className="flex w-full flex-col items-center justify-center bg-gray-50 my-4 p-6 rounded-xl shadow-sm">
              <div className="flex gap-6 mb-6">
                <a
                  href={shareLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] p-3 rounded-full text-white hover:scale-110 transition-transform shadow-md"
                  title="Share on WhatsApp"
                >
                  <FaWhatsapp size={28} />
                </a>
                <a
                  href={shareLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#1877F2] p-3 rounded-full text-white hover:scale-110 transition-transform shadow-md"
                  title="Share on Facebook"
                >
                  <FaFacebook size={28} />
                </a>
                <a
                  href={shareLinks.messenger}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0084FF] p-3 rounded-full text-white hover:scale-110 transition-transform shadow-md"
                  title="Share on Messenger"
                >
                  <FaFacebookMessenger size={28} />
                </a>
              </div>
              <div className="flex w-full items-center gap-2 bg-white p-2 border rounded-lg">
                <Input
                  value={url}
                  readOnly
                  className="flex-1 bg-transparent border-none focus-visible:ring-0 text-sm overflow-hidden text-ellipsis whitespace-nowrap"
                />
                <button
                  onClick={handleCopy}
                  className={`flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    copied
                      ? "bg-green-500 text-white"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {copied ? (
                    <>
                      <FaClipboardCheck className="mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <FaRegClipboard className="mr-2" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default ShareDialog;
