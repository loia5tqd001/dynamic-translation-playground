// Learn from https://github.com/vercel/next.js/blob/canary/examples/with-portals/components/ClientOnlyPortal.js
import React from 'react';
import { createPortal } from 'react-dom';

export const ClientOnlyPortal = ({
  children,
  selector,
}: {
  children: React.ReactNode;
  selector: (() => HTMLElement) | HTMLElement;
}) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return mounted
    ? createPortal(
        children,
        typeof selector === 'function' ? selector() : selector
      )
    : null;
};
