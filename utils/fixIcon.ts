import React from 'react';
export const fixIcon= <T, >(Icon: T) =>
    Icon as unknown as React.FC<React.SVGProps<SVGSVGElement>>;