declare module '*.tsx' {
  import React from 'react';
  const Component: React.ComponentType<Record<string, unknown>>;
  export default Component;
}

declare module '*.ts' {
  const content: Record<string, unknown>;
  export default content;
}