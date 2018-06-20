import React from 'react';

const fullStarSVG = 'M 971.5 379.5 c 9 28 2 50 -20 67 L 725.4 618.6 l 87 280.1 c' +
      '11 39 -18 75 -54 75 c -12 0 -23 -4 -33 -12 l -226.1 -172 l -226.1 172.1' +
      'c -25 17 -59 12 -78 -12 c -12 -16 -15 -33 -8 -51 l 86' +
      '-278.1 L 46.1 446.5 c -21 -17 -28 -39 -19 -67 c 8 -24 29 -40 52' +
      '-40 h 280.1 l 87 -278.1 c 7 -23 28 -39 52 -39 c 25 0 47 17 54 41' +
      'l 87 276.1 h 280.1 c 23.2 0 44.2 16 52.2 40 Z';
const halfStarSVG = 'M 510.2 23.3 l 1 767.3 l -226.1 172.2 c -25 17 -59 12 -78' +
      '-12 c -12 -16 -15 -33 -8 -51 l 86 -278.1 L 58 447.5 c -21 -17 -28 ' +
      '-39 -19 -67 c 8 -24 29 -40 52 -40 h 280.1 l 87 -278.1 c 7.1 -23.1 ' +
      '28.1 -39.1 52.1 -39.1 Z';


const Star = () => (
  <svg viewBox="0 0 1000 1000" role="presentation" className="icon-star">
    <path d={fullStarSVG} />
  </svg>
);

const StarEmpty = () => (
  <svg viewBox="0 0 1000 1000" role="presentation" className="icon-star-empty">
    <path d={fullStarSVG} />
  </svg>
);

const StarHalf = () => (
  <svg viewBox="0 0 1000 1000" role="presentation" className="icon-star">
    <path d={halfStarSVG} />
  </svg>
);

const IconStar = () => (
  <span className="icon-star-container">
    <Star />
  </span>
);

const IconStarEmpty = () => (
  <span className="icon-star-container">
    <StarEmpty />
  </span>
);

const IconStarHalf = () => (
  <span className="icon-star-container-half">
    <span className="icon-star-half-grey">
      <Star />
    </span>
    <span className="icon-start-half-green">
      <StarHalf />
    </span>
  </span>
);

const renderRatingArr = (rating) => {
  const ratingArr = [];
  for (let i = 0; i < 5; i += 1) {
    if (rating - i < 1 && rating - i > 0) {
      ratingArr.push('half');
    } else if (i >= rating || rating === 0) {
      ratingArr.push('empty');
    } else {
      ratingArr.push('full');
    }
  }
  return ratingArr;
};

const renderStars = (rating, i) => {
  if (rating === 'full') {
    return <IconStar key={i} />;
  } else if (rating === 'half') {
    return <IconStarHalf key={i} />;
  }
  return <IconStarEmpty key={i} />;
};

const StarRating = ({ starRating, reviewCount }) => (
  <div>
    <button type="button" className="header-reviews-button">
      <span>
        <span role="img">
          {
            renderRatingArr(starRating).map((rating, i) => renderStars(rating, i))
          }
        </span>
        {' '}
        <span className="rating-total-text">
          {reviewCount}
        </span>
      </span>
    </button>
  </div>
);

export default StarRating;
