import { useEffect } from 'react';
import { proxy, useSnapshot } from 'valtio';

// Tailwind CSS breakpoints for reference:
// sm  40rem (640px)   @media (width >= 40rem) { ... }
// md  48rem (768px)   @media (width >= 48rem) { ... }
// lg  64rem (1024px)  @media (width >= 64rem) { ... }
// xl  80rem (1280px)  @media (width >= 80rem) { ... }
// 2xl 96rem (1536px)  @media (width >= 96rem) { ... }

const viewState = proxy({
  isMobile: window.innerWidth < 640,
});

export const useViewState = () => {
  return useSnapshot(viewState);
};
export const setViewState = (isMobile: boolean) => {
  viewState.isMobile = isMobile;
};

export const useResizeListener = () => {
  useEffect(() => {
    const handleResize = () => {
      viewState.isMobile = window.innerWidth < 640;
    };

    // Gọi 1 lần khi mount
    handleResize();

    // Thêm listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
};
