import type { Review } from "@/lib/db";

/** Seeded from Tripzo Holidays Google Maps listing (4.8 ★) */
export const googleReviewsSeed: Omit<Review, "id" | "createdAt" | "status">[] = [
  {
    name: "Ross Atkinson",
    country: "Google review",
    rating: 5,
    comment:
      "Well Sri Lanka is simply one of the best countries we have visited. Our tour guide Chathura just made our trip even better and went above and beyond. He stopped where we wanted, nothing was ever an issue, and was such a nice guy. He was also a top wingman for my proposal. I genuinely wouldn’t use anyone else if I came back.",
    tourTitle: "Island tour with Chathura",
  },
  {
    name: "Athena Wiberg",
    country: "Google review",
    rating: 5,
    comment:
      "Chathura is the warmest, sweetest, friendliest, most helpful and best guide/driver we had in Sri Lanka. Super flexible, honest with the price, and drove safely. He gave recommendations, took us to a delicious restaurant, and told us about the places we drove past. I would recommend him to anyone.",
    tourTitle: "Multi-day chauffeur tour",
  },
  {
    name: "Dani C",
    country: "Google review",
    rating: 5,
    comment:
      "Chathura was the best driver we could have asked for. Originally we only planned to hire him for a trip to Sigiriya, but he was so friendly, welcoming, helpful, and knowledgeable that we ended up relying on him throughout our entire stay.",
    tourTitle: "Sigiriya & island travel",
  },
  {
    name: "Tim Sharp",
    country: "Google review",
    rating: 4,
    comment:
      "Supplied us a twenty-seater bus to ferry our family party of 11 and all our luggage. It was a safe little bubble on the chaotic Sri Lankan roads. Chathura our captain is a very competent and capable driver who tackled amazing terrain so we could experience wonderful wilderness.",
    tourTitle: "Group coach hire",
  },
  {
    name: "sahaja b",
    country: "Google review",
    rating: 5,
    comment:
      "Highly recommend! Chatur is an excellent driver, always cheerful and has lots of patience. Our entire bus journey was safe and memorable because of him. Pro tip: he is an excellent photographer too.",
    tourTitle: "Group travel",
  },
  {
    name: "Vijetha Reddy",
    country: "Google review",
    rating: 5,
    comment:
      "Awesome experience. Chatur had been an awesome driver. It felt like more of a family trip and one of our family members driving us. He has lots of patience and treated us like his family. Thank you for giving us an awesome Sri Lanka experience.",
    tourTitle: "Family tour",
  },
  {
    name: "Kevin W Chan",
    country: "Google review",
    rating: 5,
    comment:
      "Very responsive and responsible driver in Sri Lanka. Friendly. Young. Good driving skills and safe driver.",
    tourTitle: "Private driver",
  },
  {
    name: "Shayani Weerasekara",
    country: "Google review",
    rating: 5,
    comment:
      "I am very happy with the good service and careful travel arrangements made by Mr. Chathura and the comfortable service he provided for our office trip. Thank you for your kindness and unforgettable joyful support.",
    tourTitle: "Office / group trip",
  },
  {
    name: "Philipp Hüsler",
    country: "Google review",
    rating: 5,
    comment: "Safe, fast, friendly and on time!",
    tourTitle: "Transfer service",
  },
  {
    name: "Deepa Haran",
    country: "Google review",
    rating: 5,
    comment:
      "Had a good time with the driver and his friend — they gave us much information about the places and made us feel safe. Thank you.",
    tourTitle: "Day touring",
  },
  {
    name: "Kiran Reddy",
    country: "Google review",
    rating: 5,
    comment: "Best tour driver till date.",
    tourTitle: "Tour driver",
  },
  {
    name: "Cristobal Ibañez Smith",
    country: "Google review",
    rating: 5,
    comment: "Best driver.",
    tourTitle: "Private hire",
  },
];
