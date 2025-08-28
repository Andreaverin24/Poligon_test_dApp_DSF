// reactSvg.ts

import type { FC, SVGProps } from 'react';

export function toReactComponent(svg: unknown): FC<SVGProps<SVGSVGElement>> {
  return svg as FC<SVGProps<SVGSVGElement>>;
}