export type Product = {
  slug: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  colors: string[];
  badges: ("new" | "bestseller" | "limited" | "sale" | "customizable")[];
  image: string;
  hoverImage: string;
};

const unsplash = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

export const newArrivals: Product[] = [
  {
    slug: "anaya-bridal-lehenga",
    name: "Anaya Bridal Lehenga",
    category: "Bridal Lehenga",
    price: 38500,
    colors: ["#8a2432", "#c9a24b"],
    badges: ["new", "customizable"],
    image: unsplash("photo-1503160865267-af4660ce7bf2"),
    hoverImage: unsplash("photo-1610047614256-023d7c028d0b"),
  },
  {
    slug: "meherunisa-silk-saree",
    name: "Meherunisa Silk Saree",
    category: "Silk Saree",
    price: 24500,
    colors: ["#7a1f2b", "#2c3e2d"],
    badges: ["bestseller", "customizable"],
    image: unsplash("photo-1617627143750-d86bc21e42bb"),
    hoverImage: unsplash("photo-1646979200020-941e1deb2670"),
  },
  {
    slug: "ivory-rose-reception-gown",
    name: "Ivory Rose Reception Gown",
    category: "Reception Gown",
    price: 32000,
    originalPrice: 38000,
    colors: ["#f3ece2", "#c9a24b"],
    badges: ["sale"],
    image: unsplash("photo-1717350917430-e9eea6474594"),
    hoverImage: unsplash("photo-1735052711950-c31c729c2a4e"),
  },
  {
    slug: "zaira-embroidered-anarkali",
    name: "Zaira Embroidered Anarkali",
    category: "Anarkali",
    price: 21500,
    colors: ["#4a5240", "#8a2432"],
    badges: ["new", "customizable"],
    image: unsplash("photo-1630267693092-2ea1f7dcc9a5"),
    hoverImage: unsplash("photo-1660669996485-f4713e9c8f01"),
  },
  {
    slug: "noor-sharara-set",
    name: "Noor Sharara Set",
    category: "Sharara Set",
    price: 19800,
    colors: ["#c9a24b", "#f3ece2"],
    badges: ["limited"],
    image: unsplash("photo-1668371459824-094a960a227d"),
    hoverImage: unsplash("photo-1707576618343-26a1b377ca7a"),
  },
  {
    slug: "kiran-reception-saree",
    name: "Kiran Reception Saree",
    category: "Designer Saree",
    price: 27500,
    colors: ["#2c3e2d", "#8a2432"],
    badges: ["bestseller", "customizable"],
    image: unsplash("photo-1677691257363-eebd2abeafec"),
    hoverImage: unsplash("photo-1570212773364-e30cd076539e"),
  },
];

export const categories = [
  {
    name: "Bridal Lehengas",
    href: "/collections/bridal-lehengas",
    image: unsplash("photo-1629118477133-b8b1499f2b8a"),
  },
  {
    name: "Sarees",
    href: "/collections/sarees",
    image: unsplash("photo-1610047520958-b42ebcd2f6cb"),
  },
  {
    name: "Reception Gowns",
    href: "/collections/reception-gowns",
    image: unsplash("photo-1622207691293-5cd80466dab3"),
  },
  {
    name: "Bridal Blouses",
    href: "/collections/bridal-blouses",
    image: unsplash("photo-1614940685083-c5409b57da6e"),
  },
];

export const testimonials = [
  {
    name: "Ritika M.",
    location: "Bengaluru",
    product: "Anaya Bridal Lehenga, custom fit",
    rating: 5,
    quote:
      "I sent my measurements not knowing what to expect, and the lehenga fit better than anything I'd tried on in a store. The embroidery detail in person is even finer than the photos.",
    avatar: unsplash("photo-1636153279424-cb5d1e00f5a2", 200),
  },
  {
    name: "Farah S.",
    location: "Hyderabad",
    product: "Meherunisa Silk Saree",
    rating: 5,
    quote:
      "Ordered this for my reception and the team walked me through draping, blouse length, everything over a video call. Felt like a real consultation, not just a checkout page.",
    avatar: unsplash("photo-1608912215571-61b7d5914b35", 200),
  },
  {
    name: "Priya K.",
    location: "Chennai",
    product: "Zaira Embroidered Anarkali, custom design",
    rating: 5,
    quote:
      "I uploaded a reference image of sleeves I loved and they recreated it almost exactly, with better fabric than I asked for. Worth every rupee for how it made me feel.",
    avatar: unsplash("photo-1601117830731-1a36c879f666", 200),
  },
];

export const instagramFeed = [
  unsplash("photo-1503160865267-af4660ce7bf2", 600),
  unsplash("photo-1610047614256-023d7c028d0b", 600),
  unsplash("photo-1717350917430-e9eea6474594", 600),
  unsplash("photo-1630267693092-2ea1f7dcc9a5", 600),
  unsplash("photo-1668371459824-094a960a227d", 600),
  unsplash("photo-1677691257363-eebd2abeafec", 600),
];
