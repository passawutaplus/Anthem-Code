import { useEffect, useState } from "react";
import { demoImageUrl } from "@/lib/demoImages";

type SafeDemoImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  index?: number;
};

const SafeDemoImage = ({ src, index = 0, alt = "", ...props }: SafeDemoImageProps) => {
  const fallback = demoImageUrl(index);
  const [current, setCurrent] = useState(src || fallback);

  useEffect(() => {
    setCurrent(src || fallback);
  }, [src, fallback]);

  return (
    <img
      {...props}
      src={current}
      alt={alt}
      onError={() => {
        if (current !== fallback) setCurrent(fallback);
      }}
    />
  );
};

export default SafeDemoImage;
