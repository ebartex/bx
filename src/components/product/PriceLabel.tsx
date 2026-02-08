// components/product/PriceLabel.js
import React from 'react';

interface PriceLabelProps {
  price: string;
  unit: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge'; // Dodany prop size
}

const PriceLabel = ({ price, unit, size = 'medium' }: PriceLabelProps) => {
  // Rozdzielamy cenę na złotówki i grosze
 


    const [zlote, grosze] = price.split('.');

  // Określamy klasy czcionki na podstawie prop size
  let fontSizeClass = 'text-2xl'; // Domyślny rozmiar
  let alignSize = ''; // Klasa dla elementu sup (poprawiona zmienna)
  let tracking = '';
  if (size === 'small') {
    fontSizeClass = 'text-md';
    alignSize = 'baseline'; // Dla małego rozmiaru czcionki
  } else if (size === 'medium') {
    fontSizeClass = 'text-xl';
    alignSize = '[2px]'; // Dla dużych rozmiarów czcionki
  } else if (size === 'large') {
    fontSizeClass = 'text-2xl';
    tracking = 'tracking-[1.3px]'
    alignSize = '[2px]'; // Dla dużych rozmiarów czcionki
  } else if (size === 'xlarge') {
    fontSizeClass = 'text-4xl';
    alignSize = '[6px]'; // Dla dużych rozmiarów czcionki    
  } else if (size === 'xxlarge') {
    fontSizeClass = 'text-5xl';
  }

  return (
    <div className="text-lg mb-2 mt-2 text-primary">
      <span className={`${tracking ? tracking : ''} font-semibold ${fontSizeClass}`}>
        {zlote}
        <sup className={`${tracking ? tracking : ''} text-sm ${alignSize ? `align-${alignSize}` : ''}`}>
          ,{grosze} zł/{unit}
        </sup>
      </span>
    </div>
  );
};

export default PriceLabel;
