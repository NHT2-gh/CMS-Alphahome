import * as htmlToImage from "html-to-image";

type CopyResult = {
  success: boolean;
  method: "clipboard" | "download" | "none";
  error?: unknown;
};

export const useCopyImage = () => {
  const isMobile = () => {
    if (typeof navigator === "undefined") return false;
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  };

  const canUseClipboard = () => {
    return !!(navigator?.clipboard && (window as any).ClipboardItem);
  };

  const downloadImage = (blob: Blob) => {
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "image.png";
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  };

  const copyImage = async (node: HTMLElement | null): Promise<CopyResult> => {
    if (!node) {
      return { success: false, method: "none", error: "Node not found" };
    }

    try {
      const blob = await htmlToImage.toBlob(node, {
        pixelRatio: 2,
        backgroundColor: "#fff",
      });

      if (!blob) {
        return {
          success: false,
          method: "none",
          error: "Failed to generate image",
        };
      }

      // 👉 Ưu tiên thử clipboard trước
      if (canUseClipboard()) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              "image/png": blob,
            }),
          ]);

          return { success: true, method: "clipboard" };
        } catch (err) {
          // fallback nếu bị chặn (iOS Safari, permission, etc.)
          downloadImage(blob);
          return {
            success: true,
            method: "download",
            error: err,
          };
        }
      }

      // 👉 Không support clipboard → download luôn
      downloadImage(blob);
      return { success: true, method: "download" };
    } catch (err) {
      return { success: false, method: "none", error: err };
    }
  };

  return {
    copyImage,
    isMobile: isMobile(),
  };
};
