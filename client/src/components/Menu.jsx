import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext.jsx";
import { useTranslation } from "react-i18next";

// --- 🌿 GREEN MENU (VEGAN) ---
const veganItems = [
  {
    id: 1,
    category: "Appetizers",
    tKey: "artichoke",
    name: "Roasted Artichoke",
    price: 14,
    calories: 220,
    ingredients: ["Artichoke", "Garlic", "Lemon"],
    image: "/Roasted.jpg",
    desc: "Slow-roasted globe artichokes with citrus olive oil.",
  },
  {
    id: 2,
    category: "Appetizers",
    tKey: "bruschetta",
    name: "Heirloom Bruschetta",
    price: 12,
    calories: 310,
    ingredients: ["Sourdough", "Tomatoes", "Balsamic"],
    image: "/bruschetta.jpg",
    desc: "Toasted sourdough topped with garden-fresh tomatoes.",
  },
  {
    id: 3,
    category: "Appetizers",
    tKey: "mushroom_pate",
    name: "Wild Mushroom Pâté",
    price: 15,
    calories: 180,
    ingredients: ["Shiitake", "Cashew Cream", "Thyme"],
    image: "/mushroom.webp",
    desc: "Velvety forest mushroom blend with seed crackers.",
  },
  {
    id: 4,
    category: "Appetizers",
    tKey: "dolma",
    name: "Stuffed Vine Leaves",
    price: 13,
    calories: 150,
    ingredients: ["Rice", "Mint", "Pine Nuts"],
    image: "/dolma.jpg",
    desc: "Traditional Dolma stuffed with herb-infused rice.",
  },
  {
    id: 5,
    category: "Appetizers",
    tKey: "wings",
    name: "Cauliflower Wings",
    price: 11,
    calories: 240,
    ingredients: ["Cauliflower", "Spices", "Vegan Ranch"],
    image: "/wings.jpg",
    desc: "Crispy organic cauliflower with a smoky glaze.",
  },
  {
    id: 6,
    category: "Main Dish",
    tKey: "earth_bowl",
    name: "Earth Bowl",
    price: 20,
    calories: 450,
    ingredients: ["Quinoa", "Sweet Potato", "Kale"],
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800",
    desc: "Nutrient-dense seasonal roasted roots and grains.",
  },
  {
    id: 7,
    category: "Main Dish",
    tKey: "risotto",
    name: "Forest Risotto",
    price: 26,
    calories: 590,
    ingredients: ["Arborio Rice", "Porcini", "Asparagus"],
    image:
      "https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=800",
    desc: "Creamy Italian rice with deep forest mushrooms.",
  },
  {
    id: 8,
    category: "Main Dish",
    tKey: "lasagna",
    name: "Eggplant Lasagna",
    price: 22,
    calories: 520,
    ingredients: ["Eggplant", "Almond Ricotta", "Tomato"],
    image: "/lazania.jpg",
    desc: "Layers of thin eggplant and slow-simmered sugo.",
  },
  {
    id: 9,
    category: "Main Dish",
    tKey: "fettuccine",
    name: "Truffle Fettuccine",
    price: 24,
    calories: 680,
    ingredients: ["Pasta", "Truffle", "Cashew Cream"],
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=800",
    desc: "Handmade pasta in a rich black truffle cream.",
  },
  {
    id: 10,
    category: "Main Dish",
    tKey: "wellington",
    name: "Lentil Wellington",
    price: 25,
    calories: 480,
    ingredients: ["Lentils", "Walnuts", "Puff Pastry"],
    image: "/lentil.jpeg",
    desc: "Savory lentil loaf wrapped in golden flaky pastry.",
  },
  {
    id: 11,
    category: "Beverage",
    tKey: "kombucha",
    name: "Hibiscus Kombucha",
    price: 9,
    calories: 45,
    ingredients: ["Hibiscus", "Fermented Tea"],
    image: "/kombucha.jpg",
    desc: "Effervescent house-fermented floral tea.",
  },
  {
    id: 12,
    category: "Beverage",
    tKey: "green_juice",
    name: "Organic Green Juice",
    price: 8,
    calories: 90,
    ingredients: ["Kale", "Cucumber", "Ginger"],
    image: "/juice.webp",
    desc: "Cold-pressed daily with local organic greens.",
  },
  {
    id: 13,
    category: "Beverage",
    tKey: "botanical_tea",
    name: "Botanical Tea",
    price: 6,
    calories: 10,
    ingredients: ["Mint", "Lavender", "Honey"],
    image: "/tea.jpeg",
    desc: "Soothing infusion of hand-picked mountain herbs.",
  },
  {
    id: 14,
    category: "Beverage",
    tKey: "charcoal_lemonade",
    name: "Charcoal Lemonade",
    price: 7,
    calories: 60,
    ingredients: ["Lemon", "Charcoal", "Agave"],
    image: "/lemonade.webp",
    desc: "Detoxifying activated charcoal and fresh citrus.",
  },
  {
    id: 15,
    category: "Beverage",
    tKey: "matcha_latte",
    name: "Matcha Latte",
    price: 7,
    calories: 120,
    ingredients: ["Matcha", "Oat Milk"],
    image: "/matcha.jpg",
    desc: "Stone-ground matcha whisked with creamy oat milk.",
  },
];

// --- 🥩 CLASSIC MENU ---
const classicItems = [
  {
    id: 101,
    category: "Appetizers",
    tKey: "prosciutto_figs",
    name: "Prosciutto Figs",
    price: 16,
    calories: 340,
    ingredients: ["Figs", "Prosciutto", "Goat Cheese"],
    image: "/fig.webp",
    desc: "Figs wrapped in prosciutto with a cheese center.",
  },
  {
    id: 102,
    category: "Appetizers",
    tKey: "salmon_tartare",
    name: "Salmon Tartare",
    price: 19,
    calories: 280,
    ingredients: ["Wild Salmon", "Capers", "Lemon"],
    image: "/salmon.webp",
    desc: "Fresh wild salmon with zesty aromatics.",
  },
  {
    id: 103,
    category: "Appetizers",
    tKey: "truffle_burrata",
    name: "Truffle Burrata",
    price: 18,
    calories: 420,
    ingredients: ["Burrata", "Truffle Oil", "Honey"],
    image: "/truffle.webp",
    desc: "Creamy burrata heart with honeyed truffle.",
  },
  {
    id: 104,
    category: "Appetizers",
    tKey: "beef_carpaccio",
    name: "Beef Carpaccio",
    price: 21,
    calories: 210,
    ingredients: ["Beef", "Parmesan", "Arugula"],
    image: "/beef.webp",
    desc: "Paper-thin raw beef with lemon and parmesan.",
  },
  {
    id: 105,
    category: "Appetizers",
    tKey: "scallops",
    name: "Seared Scallops",
    price: 22,
    calories: 190,
    ingredients: ["Scallops", "Butter", "Pea Purée"],
    image: "/scallops.webp",
    desc: "Diver scallops seared in herb-infused butter.",
  },
  {
    id: 106,
    category: "Main Dish",
    tKey: "ribeye",
    name: "Grass-Fed Ribeye",
    price: 34,
    calories: 720,
    ingredients: ["Ribeye", "Herb Butter", "Rosemary"],
    image:
      "https://images.unsplash.com/photo-1546964124-0cce460f38ef?q=80&w=800",
    desc: "Seared grass-fed ribeye with roasted potatoes.",
  },
  {
    id: 107,
    category: "Main Dish",
    tKey: "seabass",
    name: "Pan-Seared Seabass",
    price: 32,
    calories: 410,
    ingredients: ["Seabass", "Asparagus", "White Wine"],
    image:
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800",
    desc: "Wild-caught seabass over a bed of seasonal greens.",
  },
  {
    id: 108,
    category: "Main Dish",
    tKey: "duck_breast",
    name: "Roasted Duck Breast",
    price: 29,
    calories: 630,
    ingredients: ["Duck", "Cherry Glaze", "Parsnips"],
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800",
    desc: "Crispy skin duck breast with a tart cherry reduction.",
  },
  {
    id: 109,
    category: "Main Dish",
    tKey: "lamb_chops",
    name: "Lamb Chops",
    price: 36,
    calories: 580,
    ingredients: ["Lamb", "Mint Crust", "Polenta"],
    image: "/lamb.jpg",
    desc: "Herb-crusted lamb chops with creamy polenta.",
  },
  {
    id: 999,
    category: "Main Dish",
    tKey: "vip_burger",
    name: "VIP Flaming Cheeseburger",
    price: 38,
    calories: 940,
    image: "/burger.jpg",
    desc: "A towering masterpiece featuring A5 Wagyu beef, habaneros, and aged cheddar.",
    customizableIngredients: [
      "Red Onion",
      "Habanero Peppers",
      "Cheddar Cheese",
      "Tomatoes",
      "Lettuce",
    ],
    supplements: [
      "Bacon",
      "Egg",
      "Avocado",
      "Extra Cheese",
      "Butter",
      "Garlic",
      "Pepper",
    ],
    sauces: [
      "Barbecue",
      "Mayonnaise",
      "Secret Sauce",
      "Atomic",
      "Samurai",
      "Pepper Sauce",
    ],
  },
  {
    id: 111,
    category: "Beverage",
    tKey: "bourbon_sour",
    name: "Honey Bourbon Sour",
    price: 14,
    calories: 180,
    ingredients: ["Bourbon", "Honey", "Lemon"],
    image:
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800",
    desc: "Smooth classic cocktail with a honey finish.",
  },
  {
    id: 113,
    category: "Beverage",
    tKey: "espresso_martini",
    name: "Espresso Martini",
    price: 15,
    calories: 160,
    ingredients: ["Vodka", "Espresso", "Kahlua"],
    image: "/martini.jpg",
    desc: "The perfect post-dinner caffeine boost.",
  },
  {
    id: 114,
    category: "Beverage",
    tKey: "old_fashioned",
    name: "Smoked Old Fashioned",
    price: 16,
    calories: 150,
    ingredients: ["Rye", "Bitters", "Orange Peel"],
    image: "/smoked",
    desc: "Classic rye cocktail with a hint of wood smoke.",
  },
  {
    id: 115,
    category: "Beverage",
    tKey: "aperol_spritz",
    name: "Aperol Spritz",
    price: 13,
    calories: 140,
    ingredients: ["Aperol", "Prosecco", "Soda"],
    image: "/aperol.jpg",
    desc: "A refreshing bittersweet Italian favorite.",
  },
];

const Menu = () => {
  const { t } = useTranslation();
  const { addToCart } = useContext(CartContext);
  const [isVegan, setIsVegan] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [removed, setRemoved] = useState([]);
  const [addedSupps, setAddedSupps] = useState([]);
  const [sauce, setSauce] = useState("Secret Sauce");
  const [specialRequest, setSpecialRequest] = useState("");

  const currentItems = isVegan ? veganItems : classicItems;

  const handleToggle = (list, setList, val) => {
    setList((prev) =>
      prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val],
    );
  };

  const renderCategory = (categoryTitle, categoryKey) => (
    <div className="mb-24" key={categoryKey}>
      <h2 className="text-3xl md:text-4xl text-earth-dark italic mb-10 border-b border-sand pb-4 uppercase tracking-widest">
        {t(categoryKey)}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
        {currentItems
          .filter((item) => item.category === categoryKey)
          .map((item) => (
            <div
              key={item.id}
              className={`group bg-white/60 backdrop-blur-sm border border-sand/30 overflow-hidden flex flex-col hover:shadow-xl transition-all cursor-pointer ${item.id === 999 ? "ring-1 ring-earth-dark ring-offset-2" : ""}`}
              onClick={() => {
                setSelectedItem(item);
                setRemoved([]);
                setAddedSupps([]);
                setSauce("Secret Sauce");
                setSpecialRequest("");
              }}
            >
              <div className="h-32 md:h-40 overflow-hidden relative">
                <img
                  src={item.image}
                  alt={t(item.tKey)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all"
                />
              </div>
              <div className="p-3 md:p-4 flex-grow flex flex-col">
                <h3 className="text-sm md:text-lg text-earth-dark hover:italic mb-1 leading-tight">
                  {t(item.tKey)}
                </h3>
                <p className="text-[9px] md:text-[10px] text-gray-500 italic mb-3 flex-grow line-clamp-2">
                  {t(`${item.tKey}_desc`)}
                </p>
                <div className="flex justify-between items-center mt-auto">
                  <span className="font-sans font-bold text-earth-medium text-xs md:text-sm">
                    ${item.price}
                  </span>
                  <span className="text-[7px] md:text-[8px] uppercase font-bold text-earth-dark underline">
                    {t("customize")}
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen pt-32 md:pt-40 pb-20 px-4 md:px-6 font-serif"
      style={{
        background: `radial-gradient(circle at top, rgba(255, 255, 255, 0.15) 0%, rgba(0, 0, 0, 0) 50%), 
                     linear-gradient(to bottom, #3D4828, #FDFCF0)`,
      }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-8xl text-cream italic drop-shadow-lg">
            {t("menu_title")}
          </h1>
          <p className="text-sand uppercase tracking-[0.3em] text-[9px] md:text-[10px] mt-4 mb-10 text-center">
            {t("pure_organic")}
          </p>

          <div className="flex justify-center items-center gap-4 md:gap-8 mb-16">
            <span
              className={`text-[10px] md:text-xs uppercase font-bold tracking-widest transition-all duration-500 ${!isVegan ? "text-cream scale-110 opacity-100" : "text-cream/50 opacity-60 scale-100"}`}
            >
              {t("classic_menu")}
            </span>
            <button
              onClick={() => setIsVegan(!isVegan)}
              className="w-14 h-7 md:w-16 md:h-8 rounded-full bg-sand relative flex items-center px-1 cursor-pointer transition-colors"
              style={{ backgroundColor: isVegan ? "#8F9E71" : "#D4D3AC" }}
            >
              <div
                className={`w-5 h-5 md:w-6 md:h-6 rounded-full bg-white shadow-md transition-all transform ${isVegan ? "translate-x-7 md:translate-x-8" : "translate-x-0"}`}
              ></div>
            </button>
            <span
              className={`text-[10px] md:text-xs uppercase font-bold tracking-widest transition-all duration-500 ${isVegan ? "text-cream scale-110 opacity-100" : "text-cream/50 opacity-60 scale-100"}`}
            >
              {t("green_menu")}
            </span>
          </div>
        </div>

        {renderCategory(t("Appetizers"), "Appetizers")}
        {renderCategory(t("Main Dish"), "Main Dish")}
        {renderCategory(t("Beverage"), "Beverage")}

        {selectedItem && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-2 md:p-4">
            <div
              className="absolute inset-0 bg-[#3D4828]/40 backdrop-blur-md"
              onClick={() => setSelectedItem(null)}
            ></div>
            <div className="relative bg-[#FDFCF0] w-full max-w-6xl h-[90vh] md:h-auto md:max-h-[95vh] overflow-hidden shadow-2xl flex flex-col md:flex-row z-[1000] rounded-sm">
              <div className="h-48 md:h-auto md:w-1/2 bg-sand/10 relative border-b md:border-b-0 md:border-r border-sand/30 overflow-hidden">
                <img
                  src={
                    selectedItem.id === 999 ? "/burger.jpg" : selectedItem.image
                  }
                  alt="Product"
                  className="w-full h-full object-cover opacity-95"
                />
              </div>

              <div className="flex-1 p-6 md:p-12 overflow-y-auto bg-cream/50 backdrop-blur-md flex flex-col">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-6 text-3xl font-light text-earth-dark z-10"
                >
                  ×
                </button>
                <h2 className="text-2xl md:text-4xl italic text-earth-dark uppercase font-bold leading-tight">
                  {t(selectedItem.tKey)}
                </h2>
                <p className="text-[10px] md:text-xs font-bold text-earth-medium mt-1 mb-6">
                  {selectedItem.calories} kcal • ${selectedItem.price}
                </p>

                <div className="space-y-8 pb-4">
                  {selectedItem.id === 999 ? (
                    <>
                      <div>
                        <h4 className="text-[9px] md:text-[10px] uppercase font-black border-b border-sand pb-2 mb-4 tracking-widest text-earth-dark">
                          {t("remove_ingredients")}
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedItem.customizableIngredients.map((ing) => (
                            <button
                              key={ing}
                              onClick={() =>
                                handleToggle(removed, setRemoved, ing)
                              }
                              className={`p-2 md:p-3 border text-[9px] md:text-[10px] uppercase flex justify-between transition-all cursor-pointer ${removed.includes(ing) ? "text-red-400 border-red-100 bg-red-50/10" : "text-earth-dark border-sand bg-transparent"}`}
                            >
                              {t(`ingredients_list.${ing}`)}{" "}
                              <span>{removed.includes(ing) ? "+" : "×"}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[9px] md:text-[10px] uppercase font-black border-b border-sand pb-2 mb-4 tracking-widest text-earth-dark">
                          {t("add_supplements")}
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedItem.supplements.map((supp) => (
                            <button
                              key={supp}
                              onClick={() =>
                                handleToggle(addedSupps, setAddedSupps, supp)
                              }
                              className={`p-2 md:p-3 border text-[9px] md:text-[10px] uppercase transition-all cursor-pointer ${addedSupps.includes(supp) ? "bg-earth-dark text-white border-earth-dark" : "text-earth-dark border-sand bg-transparent"}`}
                            >
                              ➕ {t(`ingredients_list.${supp}`)}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[9px] md:text-[10px] uppercase font-black border-b border-sand pb-2 mb-4 tracking-widest text-earth-dark">
                          {t("exclusive_sauces")}
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {selectedItem.sauces.map((s) => (
                            <button
                              key={s}
                              onClick={() => setSauce(s)}
                              className={`p-2 md:p-3 border text-[8px] md:text-[9px] uppercase transition-all cursor-pointer ${sauce === s ? "bg-earth-medium text-white border-earth-medium" : "text-earth-dark border-sand bg-transparent"}`}
                            >
                              {t(`ingredients_list.${s}`)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div>
                      <h4 className="text-[9px] md:text-[10px] uppercase font-bold border-b border-sand pb-2 mb-4 tracking-widest text-earth-dark">
                        {t("core_ingredients")}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.ingredients?.map((ing) => (
                          <span
                            key={ing}
                            className="px-3 py-1 border border-sand/50 text-[9px] text-earth-dark uppercase italic"
                          >
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-[9px] md:text-[10px] uppercase font-black border-b border-sand pb-2 mb-4 tracking-widest text-earth-dark">
                      {selectedItem.id === 999
                        ? t("special_requests_vip")
                        : t("allergies_requests")}
                    </h4>
                    <textarea
                      value={specialRequest}
                      onChange={(e) => setSpecialRequest(e.target.value)}
                      placeholder={t("placeholder_req")}
                      className="w-full h-24 p-3 bg-white/50 border border-sand italic text-xs text-earth-dark focus:outline-none resize-none"
                    ></textarea>
                  </div>
                </div>

                <button
                  onClick={() => {
                    addToCart({
                      ...selectedItem,
                      finalPrice: selectedItem.price + addedSupps.length * 2,
                      custom: {
                        removed,
                        addedSupps,
                        sauce: selectedItem.id === 999 ? sauce : "Standard",
                        specialRequest,
                      },
                    });
                    setSelectedItem(null);
                  }}
                  className="mt-6 w-full py-4 md:py-5 bg-earth-dark text-white uppercase tracking-widest text-[10px] md:text-[11px] font-bold shadow-xl hover:bg-earth-medium transition-all cursor-pointer border-none flex-shrink-0"
                >
                  {t("add_to_plate")} — $
                  {selectedItem.price + addedSupps.length * 2}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
