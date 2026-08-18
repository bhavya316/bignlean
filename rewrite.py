import re

with open("src/components/ProductOverview/ProductOverview.tsx", "r") as f:
    content = f.read()

replacement = """  return (
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
        className="lg:hidden flex w-full overflow-x-auto snap-x snap-mandatory gap-4 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
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
  );"""

# Replace the specific return block
new_content = re.sub(
    r"  return \([\s\S]*?    </div>\n  \);", 
    replacement, 
    content,
    count=1
)

with open("src/components/ProductOverview/ProductOverview.tsx", "w") as f:
    f.write(new_content)
