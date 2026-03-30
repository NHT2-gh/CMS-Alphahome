import * as htmlToImage from "html-to-image";

export const useCopyImage = () => {
  const copyImage = async (node: HTMLElement | null) => {
    if (!node) throw new Error("Node not found");

    const blob = await htmlToImage.toBlob(node, {
      pixelRatio: 2, // nét hơn
      backgroundColor: "#fff", // tránh nền trong suốt
    });

    if (!blob) throw new Error("Failed to generate image");

    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": blob,
      }),
    ]);
  };

  return { copyImage };
};
