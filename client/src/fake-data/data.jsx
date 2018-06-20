const defaultProps = {
  listing: {
    id: 2,
    owner_id: 2,
    maxGuests: 1,
    price: 106,
    minStay: 5,
    cleaningFee: 10,
    areaTax: 12,
  },
  owner: {
    id: 2,
    ownerName: 'Millie',
  },
  reviews: {
    totalReviews: 168,
    starSum: 456,
  },
  bookings: [
    {
      id: 44,
      listing_id: 2,
      user_id: 54,
      startDate: '2018-06-07T07:00:00.000Z',
      endDate: '2018-06-17T07:00:00.000Z',
    },
    {
      id: 45,
      listing_id: 2,
      user_id: 418,
      startDate: '2018-06-18T07:00:00.000Z',
      endDate: '2018-06-28T07:00:00.000Z',
    },
    {
      id: 46,
      listing_id: 2,
      user_id: 586,
      startDate: '2018-06-30T07:00:00.000Z',
      endDate: '2018-07-09T07:00:00.000Z',
    },
    {
      id: 47,
      listing_id: 2,
      user_id: 201,
      startDate: '2018-07-09T07:00:00.000Z',
      endDate: '2018-07-18T07:00:00.000Z',
    },
  ],
};
