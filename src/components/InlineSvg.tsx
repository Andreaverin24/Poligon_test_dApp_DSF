// components/InlineSvg.tsx

import React, { useMemo } from 'react';

type InlineSvgProps = {
  svg: string;
  className?: string;
  mode?: 'icon' | 'raw'; // 'icon' = optimized for square icons, 'raw' = untouched, undefined = leave SVG unchanged
};

export const InlineSvg: React.FC<InlineSvgProps> = ({ svg, className, mode }) => {
  const processedSvg = useMemo(() => {
    let result = svg;

    // If mode is 'icon', apply cleaning and scaling styles
    if (mode === 'icon') {
      // Remove fixed width and height
      result = result
        .replace(/width="[^"]*"/g, '')
        .replace(/height="[^"]*"/g, '');

      // Add viewBox if missing
      const hasViewBox = /viewBox="[^"]*"/.test(result);
      if (!hasViewBox) {
        console.warn('⚠️ SVG is missing viewBox — adding default "0 0 100 100"');
        result = result.replace(/<svg/, '<svg viewBox="0 0 100 100"');
      }

      // Inject responsive styles
      result = result.replace(
        /<svg /,
        '<svg style="width:100%; height:100%; display:block; vertical-align: middle;" preserveAspectRatio="xMidYMid meet" '
      );
    } else {
      // Even in 'raw' or undefined mode — ensure display:block and vertical-align:middle
      result = result.replace(
        /<svg(?![^>]*style=)/,
        '<svg style="display:block; vertical-align:middle;" '
      );
    }

    return result;
  }, [svg, mode]);

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: processedSvg }}
      aria-hidden="true"
    />
  );
};
