'use client';
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Button } from '../ui/button';


const RatingBar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const hasRated = localStorage.getItem('hasRated');
    if (hasRated === 'true') {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  }, []);

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const handleSubmit = () => {
    if (rating === 0) return;

    localStorage.setItem('hasRated', 'true');
    localStorage.setItem('rating', String(rating));
    setIsSubmitted(true);
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('hasRated', 'true');
  };

  return (
    isVisible && (
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white border rounded-lg shadow-lg p-4 w-11/12 max-w-lg z-50">
        {!isSubmitted ? (
          <div>
            <h2 className="text-lg font-semibold mb-2">Ocena strony</h2>
            <div className="flex space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 cursor-pointer ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                  onClick={() => handleRatingClick(star)}
                />
              ))}
            </div>
            <Button onClick={handleSubmit} className="w-full bg-blue-500 text-white">
              Zatwierdź ocenę
            </Button>
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold">Dziękujemy za ocenę!</h2>
            <p className="text-sm">Twoja opinia jest dla nas bardzo ważna.</p>
            <Button onClick={handleClose} className="w-full mt-4 bg-green-500 text-white">
              Zamknij
            </Button>
          </div>
        )}
      </div>
    )
  );
};

export default RatingBar;
