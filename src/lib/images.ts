/**
 * Editorial + placeholder product photography (Unsplash licence).
 * Replace with Thanh Van Viet's own photography when shoots are ready —
 * every image on the site is referenced through this map.
 */
const u = (id: string) => `https://images.unsplash.com/${id}`;

export const IMG = {
  // Women — áo dài
  heroRed: u("photo-1675388135186-4ab6fb74abbd"),
  blackHat: u("photo-1675389017197-9ae63c2b2fe8"),
  purpleBoat: u("photo-1609952917837-2394b5a4d2fb"),
  lotusField: u("photo-1621526839624-619d47817292"),
  whiteBlossom: u("photo-1722111008436-d2901ba1237d"),
  pinkBamboo: u("photo-1633058851668-8b5b96d09736"),
  whiteBicycle: u("photo-1616047236147-ca51525e1ffd"),
  pinkHatWide: u("photo-1633058851689-e8440956ff21"),
  pinkStrawBag: u("photo-1705049316538-e73eb3f33b04"),
  bridgeFlower: u("photo-1722111627062-57cd2cda63df"),
  kneelBouquet: u("photo-1700721154874-78695c314eed"),
  whiteSeated: u("photo-1702617112944-61a5811ab7c0"),
  whiteSteps: u("photo-1722111008496-8c8cdbd51d82"),
  redCafe: u("photo-1674401770404-7d05485deb6a"),
  redBouquet: u("photo-1674401587549-52c6b7792545"),
  twoFriends: u("photo-1674402501933-3238831bb877"),
  pinkArch: u("photo-1765021562721-105ddb58ace4"),
  redBlossomSmile: u("photo-1670167872868-445c60d2a15b"),
  redPeachBlossom: u("photo-1670167873068-7cf4004c1e7f"),
  redFlowerMarket: u("photo-1670167872812-c4f4de6db44f"),
  pinkLilies: u("photo-1765021561374-291ef9918ea2"),
  whiteBraid: u("photo-1711468964388-bf87076f6846"),
  blueStoneWall: u("photo-1707741015015-e25a5796c20a"),
  blueLake: u("photo-1707741015118-4060b50308ff"),
  greenTree: u("photo-1672039316587-0acb7676f754"),
  silkHeadscarf: u("photo-1763906803192-0842ce94e448"),
  whiteLiliesPark: u("photo-1787588647846-16c054fa2bdc"),
  whiteHatLilies: u("photo-1787588647731-e47792a468e8"),
  orangeLantern: u("photo-1643646805530-56f9a7ce2344"),
  orangePillar: u("photo-1643647198828-a27ac98dbe1d"),
  orangeGladioli: u("photo-1643647129731-db12a2059219"),
  orangePorch: u("photo-1643647158941-322c5be8a8d4"),
  // Kids
  girlRedLake: u("photo-1643946675906-1a56b73c74c0"),
  // Family
  familySeated: u("photo-1767604455862-ef31888f68fa"),
  familySeatedTall: u("photo-1767604455930-b51fd5381b2c"),
  familyWalking: u("photo-1767603752798-f898044464bd"),
  familyCanal: u("photo-1767603308062-07ac70a9c689"),
  familyBridge: u("photo-1767603087790-5face2cb056f"),
  familyLanterns: u("photo-1767604014109-f9a12085bd66"),
  coupleAlley: u("photo-1767603753231-0a93a5608e31"),
  familyBridgeWide: u("photo-1767603086371-3f478318eab3"),
  familyStreet: u("photo-1767603753251-74f480378f40"),
  // Textures & atmosphere
  silkIvory: u("photo-1619043518800-7f14be467dca"),
  silkCream: u("photo-1606259457945-67dc66271ee6"),
  silkRed: u("photo-1518893063132-36e46dbe2428"),
  silkTeal: u("photo-1612744192242-35cd7a7d35e6"),
  silkShop: u("photo-1778749024276-fc094db62e8b"),
  lotusPinkDark: u("photo-1538998073820-4dfa76300194"),
  lotusLeaves: u("photo-1474557157379-8aa74a6ef541"),
  lotusWhite: u("photo-1593047833652-2ae65f74b22f"),
  lotusPinkBlue: u("photo-1534162802244-d6f69e9048da"),
  lanternRed: u("photo-1613625695262-98bceeda4bc0"),
  lanternNight: u("photo-1506430806163-511b73d549b8"),
  lanternStreet: u("photo-1569271532956-3fb81a207115"),
  lanternHoiAn: u("photo-1560699380-276159e957e0"),
  nonLaRiver: u("photo-1532904852347-f4e5e1d80751"),
  // Accessories
  slippersRed: u("photo-1736607617956-094732a9265e"),
  sandalsEmbroidered: u("photo-1744184795380-7817a9b29014"),
  bagPleatedCream: u("photo-1761646238176-b480909e6ba6"),
  bagPleatedPlum: u("photo-1761646238287-3a278ecc0c86"),
  clutchBeaded: u("photo-1783700549620-a6699881dc45"),
  clutchQuilted: u("photo-1783700475749-6e6521a503fa"),
  pearlStrand: u("photo-1595345705177-ffe090eb0784"),
  pearlBlush: u("photo-1654699991494-892326ee8171"),
  pearlSet: u("photo-1704957205327-9fbd44d683b7"),
  pearlBrooch: u("photo-1676496220343-1585b0cdcc3f"),
  giftBox: u("photo-1603567364858-8e3362d9f040"),
} as const;

export type ImgKey = keyof typeof IMG;
