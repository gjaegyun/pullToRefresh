import { useRef } from 'react';

interface Props {
  handleRefresh: () => void;
}

const PullToRefresh: React.FC<Props> = ({ handleRefresh }) => {
  const div = useRef<HTMLDivElement | null>(null);
  const loading = useRef<HTMLDivElement | null>(null);
  const touchStartY = useRef(0);
  const loadingHeight = useRef(0);

  const MAX_HEIGHT = 60;

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (div.current && div.current.scrollTop !== 0) return;
    touchStartY.current = e.changedTouches[0].screenY;
    const el = document.createElement('div');
    el.classList.add('loading-element');
    div.current?.prepend(el);
    loading.current = el;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (loading.current) {
      const screenY = e.changedTouches[0].screenY;
      const height = Math.floor((screenY - touchStartY.current) * 0.3);
      if (height >= 0) {
        loading.current.style.height = `${height}px`;
        loadingHeight.current = height;
      }
    }
  };

  const handleTouchEnd = () => {
    if (loading.current && loadingHeight.current >= MAX_HEIGHT) {
      handleRefresh();
      if (div.current && loading.current) {
        div.current.removeChild(loading.current);
      }
      loading.current = null;
      loadingHeight.current = 0;
      touchStartY.current = 0;
    }
  };

  return (
    <div
      ref={div}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ overflowY: 'scroll', height: '100vh' }}
    >
      hello
    </div>
  );
};

export default PullToRefresh;
