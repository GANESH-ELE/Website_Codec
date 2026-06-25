/**
 * Generates sample/products.xlsx for testing the admin import feature.
 * Run: node scripts/generate-sample.mjs
 */
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// Dynamic import for CJS xlsx package
const { utils, write } = await import('xlsx');

const rows = [
  /* Electricals */
  { item_name: 'Havells 8-Module Switch Board', brand: 'Havells', category: 'Electricals', description: 'Premium modular switch board, dust-proof polycarbonate body.', images: '', video_url: '', stock_status: 'In Stock' },
  { item_name: 'Philips LED Bulb 9W Cool Day Light', brand: 'Philips', category: 'Electricals', description: 'Energy-efficient 9W LED, 6500K, B22 base, 800 lumens.', images: '', video_url: '', stock_status: 'In Stock' },
  { item_name: 'Finolex 1.5mm FR Cable 90m', brand: 'Finolex', category: 'Electricals', description: 'ISI-certified FR-grade copper wire for household wiring.', images: '', video_url: '', stock_status: 'In Stock' },
  { item_name: 'Schneider iC60 32A MCB', brand: 'Schneider', category: 'Electricals', description: 'Single-pole 32A MCB, C-curve, IEC 60898 compliant.', images: '', video_url: '', stock_status: 'In Stock' },
  { item_name: 'Kirloskar Star 1HP Water Pump', brand: 'Kirloskar', category: 'Electricals', description: 'Self-priming 1HP pump, max head 35m, 2400 LPH discharge.', images: '', video_url: '', stock_status: 'Out of Stock' },
  { item_name: 'Anchor Roma 6A 3-Pin Socket', brand: 'Anchor', category: 'Electricals', description: 'Modular 6A socket with shutter, child-safe design.', images: '', video_url: '', stock_status: 'In Stock' },

  /* Plumbing */
  { item_name: 'Astral CPVC Pipe 1" 3m', brand: 'Astral', category: 'Plumbing', description: 'Hot & cold water CPVC pipe, ISI marked, 3m length.', images: '', video_url: '', stock_status: 'In Stock' },
  { item_name: 'Jaguar Single Lever Basin Mixer', brand: 'Jaguar', category: 'Plumbing', description: 'Chrome-finish basin mixer, 1/4-turn ceramic disc cartridge.', images: '', video_url: '', stock_status: 'In Stock' },
  { item_name: 'Essex PVC Ball Valve 1"', brand: 'Essex', category: 'Plumbing', description: 'Heavy-duty PVC ball valve, SS ball, 10 bar rating.', images: '', video_url: '', stock_status: 'In Stock' },
  { item_name: 'Supreme UPVC Column Pipe 63mm 6m', brand: 'Supreme', category: 'Plumbing', description: 'UPVC column pipe for submersible pumps, ISI marked.', images: '', video_url: '', stock_status: 'In Stock' },
  { item_name: 'Vectus 500L Overhead Water Tank', brand: 'Vectus', category: 'Plumbing', description: '4-layer UV-stabilised polyethylene overhead tank.', images: '', video_url: '', stock_status: 'In Stock' },
  { item_name: 'Parryware Agate Wall-Hung WC', brand: 'Parryware', category: 'Plumbing', description: 'Wall-hung ceramic WC, soft-close seat, dual flush 3/6L.', images: '', video_url: '', stock_status: 'Out of Stock' },

  /* Paints */
  { item_name: 'Berger WeatherCoat Premium Exterior 10L', brand: 'Berger', category: 'Paints', description: '100% acrylic exterior emulsion, anti-algae & anti-fungal.', images: '', video_url: '', stock_status: 'In Stock' },
  { item_name: 'Berger Silk Luxury Interior Emulsion 4L', brand: 'Berger', category: 'Paints', description: 'Premium sheen interior emulsion, washable, low-VOC.', images: '', video_url: '', stock_status: 'In Stock' },
  { item_name: 'Berger Easy Clean Matt Interior 4L', brand: 'Berger', category: 'Paints', description: 'Stain-resistant matt interior, wipe-clean, anti-bacterial.', images: '', video_url: '', stock_status: 'In Stock' },
  { item_name: 'Berger Rangoli Total Care Exterior 4L', brand: 'Berger', category: 'Paints', description: 'Economy exterior emulsion with rainshield protection.', images: '', video_url: '', stock_status: 'In Stock' },
  { item_name: 'Berger Bison Acrylic Distemper 5kg', brand: 'Berger', category: 'Paints', description: 'Ready-to-use interior distemper, smooth finish.', images: '', video_url: '', stock_status: 'Out of Stock' },
  { item_name: 'Berger WallFlex Interior Primer 20L', brand: 'Berger', category: 'Paints', description: 'Alkali-resistant interior primer for new plaster.', images: '', video_url: '', stock_status: 'In Stock' },
];

const ws = utils.json_to_sheet(rows);

// Set column widths
ws['!cols'] = [
  { wch: 40 }, // item_name
  { wch: 14 }, // brand
  { wch: 14 }, // category
  { wch: 55 }, // description
  { wch: 30 }, // images
  { wch: 30 }, // video_url
  { wch: 14 }, // stock_status
];

const wb = utils.book_new();
utils.book_append_sheet(wb, ws, 'Products');

const outDir = join(ROOT, 'sample');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const outPath = join(outDir, 'products.xlsx');
writeFileSync(outPath, write(wb, { type: 'buffer', bookType: 'xlsx' }));
console.log(`✅  Sample file written → ${outPath}`);
