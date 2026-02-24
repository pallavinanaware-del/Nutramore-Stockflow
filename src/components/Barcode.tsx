import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

interface BarcodeProps {
  value: string;
  className?: string;
}

export const Barcode: React.FC<BarcodeProps> = ({ value, className }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      try {
        JsBarcode(svgRef.current, value, {
          format: "CODE128",
          width: 1.5,
          height: 40,
          displayValue: true,
          fontSize: 12,
          background: "transparent",
        });
      } catch (e) {
        console.error("Barcode generation failed", e);
      }
    }
  }, [value]);

  return <svg ref={svgRef} className={className}></svg>;
};
