import React, { useRef, useState } from 'react';

interface Props {
  children: React.ReactNode;
  onRefresh: () => void;
  maxDistance: number;
}

const App: React.FC<Props> = ({ children, onRefresh, maxDistance }) => {
  const spinnerRef = useRef<HTMLDivElement | null>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);

  const resetToInitial = () => {
    if (spinnerRef.current) {
      spinnerRef.current.style.height = '0';
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const moveY = e.touches[0].clientY;
    const pulledDistance = moveY - startY;

    if (spinnerRef.current) {
      spinnerRef.current.style.height = `${Math.min(pulledDistance, maxDistance)}px`;
    }

    if (pulledDistance >= maxDistance) {
      setIsRefreshing(true);
    } else {
      setIsRefreshing(false);
    }
  };

  const onTouchEnd = () => {
    if (isRefreshing) {
      onRefresh();
    } else {
      resetToInitial();
    }
  };

  return (
    <div>
      <div ref={spinnerRef}>
        <div>hello</div>
      </div>
      <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
        {children}
      </div>
    </div>
  );
};

export default App;
