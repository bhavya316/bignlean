import os
import re

directory = "src/components/Home"

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith(".tsx"):
            path = os.path.join(root, file)
            with open(path, "r") as f:
                content = f.read()
            
            # Make sure we don't double replace
            if "mt-8 lg:mt-[60px]" not in content:
                content = content.replace("mt-[60px]", "mt-8 lg:mt-[60px]")
            if "gap-6 lg:gap-[40px]" not in content:
                content = content.replace("gap-[40px]", "gap-6 lg:gap-[40px]")
                
            content = content.replace(" md:mt-[40px]", "")
            content = content.replace(" sm:mt-[30px]", "")
            content = content.replace(" md:gap-[30px]", "")
            content = content.replace(" sm:gap-[20px]", "")
            content = content.replace("sm:px-4", "px-4 lg:px-0")

            with open(path, "w") as f:
                f.write(content)

