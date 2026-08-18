import re

with open("src/components/ProductOverview/ProductOverview.tsx", "r") as f:
    content = f.read()

replacement = """const ImageViewer = ({ images }: any) => {
  const [selectedImage, setSelectedImage] = useState(images?.[0]);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.clientWidth;
    const index = Math.round(scrollLeft / width);
    setActiveIndex(index);
  };

  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex w-full gap-2">
        {/* Desktop Thumbnails */}
        <div className="hidden lg:flex flex-col pt-2 items-center gap-2 max-h-[475px] overflow-auto w-[20%]">
          {images?.map((image: string, index: number) => (
            <img
              key={index}
              src={getMediaUrl(image)}
              alt={`Thumbnail ${index}`}
              onClick={() => setSelectedImage(image)}
              className={`cursor-pointer w-20 h-20 aspect-square object-contain mix-blend-multiply ${
                image === selectedImage ? "ring-1 ring-black" : ""
              }`}
            />
          ))}
        </div>

        {/* Desktop Main Image */}
        <div className="hidden lg:block w-[80%] max-h-[475px] pointer-events-none relative">
          <img
            src={getMediaUrl(selectedImage)}
            alt="Selected"
            className="w-full h-[475px] object-contain mix-blend-multiply"
          />
        </div>

        {/* Mobile Scrollable Images (Hide on Desktop) */}
        <div 
          onScroll={handleScroll}
          className="lg:hidden flex w-full overflow-x-auto snap-x snap-mandatory gap-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {images?.map((image: string, index: number) => (
            <div key={index} className="w-full flex-none snap-center">
              <img
                src={getMediaUrl(image)}
                alt={`Product Image ${index + 1}`}
                className="w-full h-[350px] object-contain mix-blend-multiply pointer-events-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Dot Indicators */}
      {images?.length > 1 && (
        <div className="lg:hidden flex justify-center gap-2 py-2">
          {images.map((_: any, index: number) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === index ? "w-6 bg-red-600" : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};"""

new_content = re.sub(
    r"const ImageViewer = \(\{ images \}: any\) => \{[\s\S]*?\};\n", 
    replacement + "\n", 
    content,
    count=1
)

with open("src/components/ProductOverview/ProductOverview.tsx", "w") as f:
    f.write(new_content)
