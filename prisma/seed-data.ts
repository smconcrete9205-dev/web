import type { ProductInput } from "../src/lib/products";

/**
 * Initial product catalog, loaded into the database by prisma/seed.ts.
 * After the first seed, edit products through /admin/products instead of
 * this file — it only runs again if you reset the database.
 */
export const seedProducts: ProductInput[] = [
  {
    slug: "rcc-manhole-cover",
    name: "RCC Manhole Cover",
    shortDescription:
      "Heavy-duty precast RCC manhole covers engineered for municipal, industrial, and residential drainage networks.",
    description: [
      "Our RCC Manhole Covers are precast using high-strength reinforced cement concrete to provide long-lasting, load-bearing access covers for underground drainage, sewage, and utility chambers. Each cover is manufactured under controlled factory conditions to ensure consistent density, dimensional accuracy, and strength.",
      "Available in multiple load classes to suit pedestrian pathways, residential driveways, and heavy-traffic municipal roads, our manhole covers are a cost-effective and durable alternative to cast iron covers, resistant to theft (no scrap value) and corrosion.",
      "[Placeholder content — replace with your own product copy, manufacturing process details, and quality certifications.]",
    ],
    specs: [
      { label: "Shape", value: "Round / Square (as per requirement)" },
      { label: "Standard Sizes", value: "450mm, 500mm, 560mm, 600mm dia. (customizable)" },
      { label: "Load Rating", value: "Light Duty (LD) / Medium Duty (MD) / Heavy Duty (HD)" },
      { label: "IS Code Reference", value: "IS 12592 (Placeholder — verify applicable IS code)" },
      { label: "Concrete Grade", value: "M30 / M35 (placeholder)" },
      { label: "Reinforcement", value: "Fabricated steel reinforcement cage (placeholder spec)" },
      { label: "Finish", value: "Trowel-finished top surface" },
      { label: "Curing", value: "Water-cured minimum 14 days (placeholder)" },
    ],
    features: [
      "High compressive strength for heavy vehicular loads",
      "No scrap/resale value — theft resistant unlike metal covers",
      "Corrosion and weather resistant",
      "Anti-skid surface finish available",
      "Custom sizes and load ratings on request",
    ],
    applications: [
      "Municipal sewage and drainage networks",
      "Residential and commercial complexes",
      "Highways and road infrastructure projects",
      "Industrial and factory premises",
    ],
    images: [
      { src: "/images/products/rcc-manhole-cover-1.jpg", alt: "Precast concrete manhole covers (sample image)" },
      { src: "/images/products/rcc-manhole-cover-2.jpg", alt: "Precast concrete elements on display at a manufacturing yard (sample image)" },
      { src: "/images/products/rcc-manhole-cover-3.jpg", alt: "Interior view of a concrete manhole invert (sample image)" },
    ],
    seo: {
      title: "RCC Manhole Cover Manufacturer | SM Concrete Products",
      description:
        "Buy heavy-duty RCC manhole covers from SM Concrete Products. Precast, IS-code compliant, available in multiple sizes and load ratings. Request a bulk quote today.",
      keywords: [
        "RCC manhole cover",
        "precast manhole cover manufacturer",
        "concrete manhole cover price",
        "heavy duty manhole cover",
      ],
    },
  },
  {
    slug: "rcc-manhole-cover-frame",
    name: "RCC Manhole Cover Frame",
    shortDescription:
      "Precast RCC frames engineered to pair with our manhole covers for a secure, level, load-distributing seat.",
    description: [
      "RCC Manhole Cover Frames provide the structural seating that holds the manhole cover flush with the road or pavement surface, distributing traffic load evenly onto the surrounding chamber structure and preventing rocking or displacement of the cover.",
      "Manufactured to match the exact dimensions and load class of our RCC Manhole Covers, our frames ensure a precise, gap-free fit that reduces noise, dust ingress, and wear over time.",
      "[Placeholder content — replace with your own product copy, manufacturing process details, and quality certifications.]",
    ],
    specs: [
      { label: "Shape", value: "Round / Square (matched to cover)" },
      { label: "Standard Sizes", value: "450mm, 500mm, 560mm, 600mm dia. (customizable)" },
      { label: "Load Rating", value: "Light Duty (LD) / Medium Duty (MD) / Heavy Duty (HD)" },
      { label: "IS Code Reference", value: "IS 12592 (Placeholder — verify applicable IS code)" },
      { label: "Concrete Grade", value: "M30 / M35 (placeholder)" },
      { label: "Frame Height", value: "75mm - 100mm (placeholder, customizable)" },
      { label: "Finish", value: "Machine-cast smooth seating surface" },
    ],
    features: [
      "Precision-matched fit with corresponding manhole cover",
      "Even load distribution to prevent cracking of chamber",
      "Reduces cover rocking, noise, and dust/water ingress",
      "Durable against repeated vehicular traffic",
      "Custom sizing available on request",
    ],
    applications: [
      "Municipal sewage and drainage chambers",
      "Water supply and utility access chambers",
      "Road and highway infrastructure",
      "Residential and commercial complexes",
    ],
    images: [
      { src: "/images/products/rcc-manhole-cover-frame-1.jpg", alt: "Precast concrete elements on display at a manufacturing yard (sample image)" },
      { src: "/images/products/rcc-manhole-cover-frame-2.jpg", alt: "Sanitary manhole component parts (sample image)" },
      { src: "/images/products/rcc-manhole-cover-frame-3.jpg", alt: "Precast concrete product base component (sample image)" },
    ],
    seo: {
      title: "RCC Manhole Cover Frame Manufacturer | SM Concrete Products",
      description:
        "Precast RCC manhole cover frames matched to standard load classes and sizes. Durable, precision-fit, IS-code referenced. Request a quote for bulk orders.",
      keywords: [
        "RCC manhole cover frame",
        "precast manhole frame manufacturer",
        "concrete manhole frame price",
      ],
    },
  },
  {
    slug: "rcc-spun-pipe",
    name: "RCC Spun Pipe",
    shortDescription:
      "Centrifugally spun RCC pipes for drainage, sewerage, and culvert applications with high strength-to-weight ratio.",
    description: [
      "RCC Spun Pipes are manufactured using the centrifugal spinning process, which compacts concrete uniformly against the mould wall to produce a dense, high-strength pipe with a smooth interior bore for optimal hydraulic flow.",
      "Our spun pipes are widely used for gravity drainage, sewerage lines, and road/rail culverts, offering excellent crushing strength, low water absorption, and long service life compared to conventionally cast pipes.",
      "[Placeholder content — replace with your own product copy, manufacturing process details, and quality certifications.]",
    ],
    specs: [
      { label: "Diameter Range", value: "150mm to 1800mm (placeholder — specify your range)" },
      { label: "Standard Length", value: "2.5m / 3m per section (placeholder)" },
      { label: "Class", value: "NP2 / NP3 / NP4 (Non-Pressure classes, placeholder)" },
      { label: "IS Code Reference", value: "IS 458 (Placeholder — verify applicable IS code)" },
      { label: "Jointing Type", value: "Rubber ring / Collar joint (placeholder)" },
      { label: "Concrete Grade", value: "M30 and above (placeholder)" },
      { label: "Manufacturing Process", value: "Centrifugal spinning (Roller Suspension Process)" },
    ],
    features: [
      "High density and low permeability due to spinning process",
      "Smooth internal bore for efficient hydraulic flow",
      "High crushing and load-bearing strength",
      "Available in multiple classes (NP2/NP3/NP4)",
      "Long design service life with minimal maintenance",
    ],
    applications: [
      "Storm water drainage systems",
      "Municipal sewerage networks",
      "Road and railway culverts",
      "Irrigation and canal cross-drainage works",
    ],
    images: [
      { src: "/images/products/rcc-spun-pipe-1.jpg", alt: "Centrifugal casting of concrete pipes at a production facility (sample image)" },
      { src: "/images/products/rcc-spun-pipe-2.jpg", alt: "Concrete spun pipe manufacturing process (sample image)" },
      { src: "/images/products/rcc-spun-pipe-3.jpg", alt: "Concrete spun pipe manufacturing process (sample image)" },
    ],
    seo: {
      title: "RCC Spun Pipe Manufacturer | SM Concrete Products",
      description:
        "High-strength RCC spun pipes (NP2/NP3/NP4) for drainage, sewerage, and culvert projects. Multiple diameters available. Request a quote for bulk supply.",
      keywords: [
        "RCC spun pipe manufacturer",
        "concrete spun pipe price",
        "RCC hume pipe",
        "NP3 NP4 spun pipe",
      ],
    },
  },
  {
    slug: "rcc-slab",
    name: "RCC Slab",
    shortDescription:
      "Precast RCC slabs for drain covers, walkways, and structural flooring applications.",
    description: [
      "Our precast RCC Slabs are manufactured to precise dimensions and reinforcement specifications for use as drain covers, trench covers, walkway panels, and light structural flooring elements.",
      "Precasting under factory-controlled conditions ensures consistent strength and finish quality, reducing on-site construction time compared to cast-in-situ slabs.",
      "[Placeholder content — replace with your own product copy, manufacturing process details, and quality certifications.]",
    ],
    specs: [
      { label: "Standard Sizes", value: "600x600mm, 1000x500mm (customizable, placeholder)" },
      { label: "Thickness", value: "50mm to 150mm (placeholder — specify your range)" },
      { label: "Load Rating", value: "Light Duty / Medium Duty / Heavy Duty" },
      { label: "IS Code Reference", value: "IS 456 (Placeholder — verify applicable IS code)" },
      { label: "Concrete Grade", value: "M25 / M30 (placeholder)" },
      { label: "Reinforcement", value: "Welded mesh / rebar cage (placeholder spec)" },
    ],
    features: [
      "Precast for consistent quality and faster installation",
      "Available in multiple thicknesses and load ratings",
      "Smooth or anti-skid surface finish options",
      "Custom sizes for site-specific requirements",
    ],
    applications: [
      "Drain and trench covers",
      "Walkways and pedestrian paths",
      "Cable/utility duct covers",
      "Light-duty flooring panels",
    ],
    images: [
      { src: "/images/products/rcc-slab-1.jpg", alt: "Precast concrete slab (sample image)" },
      { src: "/images/products/rcc-slab-2.jpg", alt: "Hollow-core precast concrete slab (sample image)" },
      { src: "/images/products/rcc-slab-3.jpg", alt: "Prefabricated concrete slab element (sample image)" },
    ],
    seo: {
      title: "RCC Slab Manufacturer | SM Concrete Products",
      description:
        "Precast RCC slabs for drain covers, walkways, and flooring. Custom sizes and thicknesses available. Request a bulk quote from SM Concrete Products.",
      keywords: [
        "RCC slab manufacturer",
        "precast concrete slab price",
        "RCC drain cover slab",
      ],
    },
  },
  {
    slug: "rcc-route-marker",
    name: "RCC Route Marker",
    shortDescription:
      "Durable RCC route/kilometre markers and utility indicator posts for highways, pipelines, and cable routes.",
    description: [
      "RCC Route Markers are precast concrete posts used to indicate the alignment of underground pipelines, cables, and utility routes, as well as distance/direction markers along highways and project sites.",
      "Cast in durable RCC with embossed or painted lettering, our route markers withstand outdoor exposure, vandalism, and weathering far better than plastic or wooden alternatives.",
      "[Placeholder content — replace with your own product copy, manufacturing process details, and quality certifications.]",
    ],
    specs: [
      { label: "Standard Height", value: "600mm / 750mm / 900mm above ground (placeholder)" },
      { label: "Cross-Section", value: "150mm x 150mm (placeholder, customizable)" },
      { label: "IS Code Reference", value: "As per client/project specification (placeholder)" },
      { label: "Concrete Grade", value: "M25 (placeholder)" },
      { label: "Marking", value: "Embossed lettering / painted text (customizable)" },
      { label: "Color", value: "As per project standard (e.g., yellow/white bands)" },
    ],
    features: [
      "Weather and vandalism resistant",
      "Custom embossed text (pipeline ID, chainage, warnings)",
      "Long outdoor service life vs. plastic/wooden markers",
      "Bulk manufacturing for pipeline/cable route projects",
    ],
    applications: [
      "Cross-country pipeline route marking",
      "Underground cable route indicators",
      "Highway distance/direction markers",
      "Survey and boundary markers",
    ],
    images: [
      { src: "/images/products/rcc-route-marker-1.jpg", alt: "Concrete marker post along a route (sample image)" },
      { src: "/images/products/rcc-route-marker-2.jpg", alt: "Gas pipeline marker post (sample image)" },
      { src: "/images/products/rcc-route-marker-3.jpg", alt: "Pipeline marker post in a field (sample image)" },
    ],
    seo: {
      title: "RCC Route Marker Manufacturer | SM Concrete Products",
      description:
        "Precast RCC route markers for pipeline, cable, and highway route indication. Custom text and sizes available. Get a bulk order quote today.",
      keywords: [
        "RCC route marker manufacturer",
        "concrete pipeline marker",
        "cable route marker post",
      ],
    },
  },
  {
    slug: "interlocking-tiles",
    name: "Interlocking Tiles",
    shortDescription:
      "Precast concrete interlocking paver tiles for driveways, footpaths, and outdoor flooring — durable and low-maintenance.",
    description: [
      "Our Interlocking Tiles (concrete pavers) are precast in a variety of shapes and thicknesses to provide a strong, slip-resistant, and aesthetically finished paving solution for outdoor areas.",
      "Designed to interlock tightly without mortar joints, these tiles distribute load evenly, resist cracking under vehicular and pedestrian traffic, and allow easy replacement of individual damaged tiles.",
      "[Placeholder content — replace with your own product copy, manufacturing process details, and quality certifications.]",
    ],
    specs: [
      { label: "Standard Shapes", value: "Zig-Zag, I-Shape, Square, Rectangle (placeholder)" },
      { label: "Thickness", value: "50mm / 60mm / 80mm (placeholder)" },
      { label: "IS Code Reference", value: "IS 15658 (Placeholder — verify applicable IS code)" },
      { label: "Compressive Strength", value: "M30 - M40 grade equivalent (placeholder)" },
      { label: "Finish", value: "Plain / colored top layer (customizable)" },
      { label: "Water Absorption", value: "< 6% (placeholder — verify per batch testing)" },
    ],
    features: [
      "High compressive and abrasion resistance",
      "Slip-resistant surface finish",
      "Easy individual tile replacement without full resurfacing",
      "Available in multiple shapes, thicknesses, and colors",
      "No mortar joints required — fast installation",
    ],
    applications: [
      "Driveways and parking areas",
      "Footpaths and pedestrian plazas",
      "Petrol pumps and industrial yards",
      "Garden and landscape paving",
    ],
    images: [
      { src: "/images/products/interlocking-tiles-1.jpg", alt: "Paving stone driveway with interlocking tiles (sample image)" },
      { src: "/images/products/interlocking-tiles-2.jpg", alt: "Interlocking concrete paver pattern (sample image)" },
      { src: "/images/products/interlocking-tiles-3.jpg", alt: "Interlocking concrete floor pavers (sample image)" },
    ],
    seo: {
      title: "Interlocking Tiles Manufacturer | SM Concrete Products",
      description:
        "Durable concrete interlocking paver tiles for driveways, footpaths, and yards. Multiple shapes and thicknesses. Request a bulk quote from SM Concrete Products.",
      keywords: [
        "interlocking tiles manufacturer",
        "concrete paver blocks price",
        "interlocking pavers supplier",
      ],
    },
  },
  {
    slug: "kerb-stones",
    name: "Kerb Stones",
    shortDescription:
      "Precast RCC kerb stones for road edges, footpath boundaries, and landscaping — built for durability and precision.",
    description: [
      "Kerb Stones (curb stones) mark and protect the edges of roads, footpaths, and medians, channeling surface water drainage while providing a clean structural boundary between carriageway and pedestrian areas.",
      "Precast in high-strength RCC, our kerb stones are dimensionally consistent for straight, clean installation lines and are available in standard straight and curved (radius) sections.",
      "[Placeholder content — replace with your own product copy, manufacturing process details, and quality certifications.]",
    ],
    specs: [
      { label: "Standard Sizes", value: "150x300x600mm, 200x300x600mm (placeholder)" },
      { label: "Types", value: "Straight / Curved (radius) / Precast channel kerb" },
      { label: "IS Code Reference", value: "IS 12592 (Placeholder — verify applicable IS code)" },
      { label: "Concrete Grade", value: "M25 / M30 (placeholder)" },
      { label: "Finish", value: "Trowel-finished with chamfered edges" },
    ],
    features: [
      "Dimensionally precise for clean, straight installation",
      "High compressive strength for vehicular edge loading",
      "Straight and curved sections available",
      "Weather and abrasion resistant",
    ],
    applications: [
      "Road and highway edges",
      "Footpath and median boundaries",
      "Parking lot demarcation",
      "Landscaping and garden edging",
    ],
    images: [
      { src: "/images/products/kerb-stones-1.jpg", alt: "Manufactured concrete kerb stones (sample image)" },
      { src: "/images/products/kerb-stones-2.jpg", alt: "Concrete kerb installed along a road edge (sample image)" },
      { src: "/images/products/kerb-stones-3.jpg", alt: "Manufactured concrete kerb stones (sample image)" },
    ],
    seo: {
      title: "Kerb Stones Manufacturer | SM Concrete Products",
      description:
        "Precast RCC kerb stones (straight & curved) for roads, footpaths, and landscaping. Durable, IS-code referenced. Request a bulk supply quote today.",
      keywords: [
        "kerb stone manufacturer",
        "RCC curb stone price",
        "precast kerb stone supplier",
      ],
    },
  },
];
