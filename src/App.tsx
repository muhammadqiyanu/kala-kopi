import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Coffee,
  ShoppingBag,
  Search,
  Plus,
  Minus,
  X,
  Check,
  CheckCircle2,
  Clock,
  QrCode,
  Banknote,
  Smartphone,
  Monitor,
  ChefHat,
  Bell,
  Receipt,
  Download,
  Printer,
  Edit3,
  Trash2,
  Store,
  TrendingUp,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Utensils,
  ChevronRight,
  Award,
  MapPin,
  PackageCheck,
  Copy,
  Upload,
  Layers,
  Info,
  ShieldCheck,
  Home,
  User,
  Lock,
  Unlock,
  Delete,
  KeyRound,
} from 'lucide-react';

// ============================================================================
// 1. TIPE DATA TYPESCRIPT & UTILITAS FORMATTER
// ============================================================================

interface MenuItem {
  id: string;
  name: string;
  category: string;
  type: 'drink' | 'food' | string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  bestSeller: boolean;
  available: boolean;
}

interface CartItem {
  cartId: string;
  menuId: string;
  name: string;
  image?: string;
  category?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  summary: string;
  note: string;
}

interface OrderItem {
  cartId: string;
  menuId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  summary: string;
  note: string;
}

interface Order {
  id: string;
  table: string;
  customerName: string;
  paymentMethod: 'QRIS' | 'CASH' | string;
  paymentStatus: 'paid' | 'unpaid' | string;
  status: 'waiting_payment' | 'preparing' | 'ready' | string;
  createdAt: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
}

const formatRupiah = (angka: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(angka || 0);
};

const padTableNumber = (num: number | string): string => String(num).padStart(2, '0');

const formatTime = (dateInput: string): string => {
  const d = new Date(dateInput);
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

// ============================================================================
// 2. DATA DUMMY KAFE & KONFIGURASI KUSTOMISASI
// ============================================================================

const CATEGORIES = [
  'Semua',
  'Kopi',
  'Non-Kopi',
  'Makanan Berat',
  'Camilan & Pastry',
  'Paket Promo',
];

const DRINK_CUSTOMIZATIONS = {
  temperatures: [
    { id: 'ice', label: 'Ice (Dingin)', price: 0 },
    { id: 'hot', label: 'Hot (Panas)', price: 0 },
  ],
  sizes: [
    { id: 'regular', label: 'Regular', price: 0 },
    { id: 'large', label: 'Large', price: 4000 },
  ],
  sugarLevels: [
    { id: 'normal', label: 'Normal Sugar' },
    { id: 'less', label: 'Less Sugar' },
    { id: 'no', label: 'No Sugar' },
  ],
  addons: [
    { id: 'espresso', label: 'Extra Espresso Shot', price: 6000 },
    { id: 'oatmilk', label: 'Ganti Oat Milk', price: 8000 },
    { id: 'caramel', label: 'Caramel Drizzle', price: 5000 },
    { id: 'jelly', label: 'Coffee Jelly', price: 5000 },
  ],
};

const FOOD_CUSTOMIZATIONS = {
  spiceLevels: [
    { id: 'none', label: 'Tidak Pedas' },
    { id: 'medium', label: 'Sedang' },
    { id: 'hot', label: 'Pedas' },
  ],
  addons: [
    { id: 'egg', label: 'Telur Mata Sapi', price: 6000 },
    { id: 'cheese', label: 'Extra Keju Parut', price: 6000 },
    { id: 'sambal', label: 'Extra Sambal Matah', price: 5000 },
  ],
};

const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'm-1',
    name: 'Kopi Susu Gula Aren Kala',
    category: 'Kopi',
    type: 'drink',
    price: 24000,
    description:
      'Espresso house-blend Arabika & Robusta berpadu susu segar creamy dan gula aren organik pilihan.',
    image:
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80',
    bestSeller: true,
    available: true,
  },
  {
    id: 'm-2',
    name: 'Iced Caramel Macchiato',
    category: 'Kopi',
    type: 'drink',
    price: 29000,
    description:
      'Susu segar dengan sirup vanila lembut, double shot espresso, dan saus karamel panggang di atasnya.',
    image:
      'https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=600&q=80',
    bestSeller: false,
    available: true,
  },
  {
    id: 'm-3',
    name: 'Kala Signature Americano',
    category: 'Kopi',
    type: 'drink',
    price: 21000,
    description:
      'Ekstraksi biji kopi single-origin Gayo dengan karakter citrus segar dan aftertaste cokelat hitam.',
    image:
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    bestSeller: false,
    available: true,
  },
  {
    id: 'm-4',
    name: 'Manual Brew V60 Single Origin',
    category: 'Kopi',
    type: 'drink',
    price: 32000,
    description:
      'Seduhan manual pour-over menggunakan biji pilihan Toraja atau Flores Bajawa dengan aroma floral.',
    image:
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80',
    bestSeller: false,
    available: false,
  },
  {
    id: 'm-5',
    name: 'Uji Matcha Latte',
    category: 'Non-Kopi',
    type: 'drink',
    price: 30000,
    description:
      'Bubuk matcha autentik asal Uji Kyoto dikocok dengan susu segar bertekstur lembut.',
    image:
      'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=600&q=80',
    bestSeller: true,
    available: true,
  },
  {
    id: 'm-6',
    name: 'Artisan Thai Tea',
    category: 'Non-Kopi',
    type: 'drink',
    price: 24000,
    description:
      'Seduhan daun teh hitam Thailand aromatik dengan campuran susu evaporasi gurih manis.',
    image:
      'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',
    bestSeller: false,
    available: true,
  },
  {
    id: 'm-7',
    name: 'Belgian Dark Chocolate',
    category: 'Non-Kopi',
    type: 'drink',
    price: 28000,
    description:
      'Cokelat hitam Belgia 70% yang pekat dan hangat berpadu dengan steamed milk lembut.',
    image:
      'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=600&q=80',
    bestSeller: false,
    available: true,
  },
  {
    id: 'm-8',
    name: 'Nasi Goreng Spesial Kala',
    category: 'Makanan Berat',
    type: 'food',
    price: 38000,
    description:
      'Nasi goreng bumbu rempah autentik dengan suwiran ayam panggang, acar segar, dan kerupuk udang.',
    image:
      'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80',
    bestSeller: true,
    available: true,
  },
  {
    id: 'm-9',
    name: 'Rice Bowl Ayam Sambal Matah',
    category: 'Makanan Berat',
    type: 'food',
    price: 36000,
    description:
      'Nasi hangat pulen dengan ayam fillet krispi disiram sambal matah kecombrang khas Bali.',
    image:
      'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80',
    bestSeller: true,
    available: true,
  },
  {
    id: 'm-10',
    name: 'Spaghetti Aglio Olio Smoked Beef',
    category: 'Makanan Berat',
    type: 'food',
    price: 42000,
    description:
      'Pasta al dente ditumis dengan minyak zaitun, bawang putih panggang, cabai kering, dan irisan daging asap.',
    image:
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
    bestSeller: false,
    available: true,
  },
  {
    id: 'm-11',
    name: 'French Butter Croissant',
    category: 'Camilan & Pastry',
    type: 'food',
    price: 26000,
    description:
      'Croissant berlapis renyah di luar dan lembut di dalam dengan aroma mentega Prancis.',
    image:
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
    bestSeller: true,
    available: true,
  },
  {
    id: 'm-12',
    name: 'Pisang Goreng Gula Aren',
    category: 'Camilan & Pastry',
    type: 'food',
    price: 23000,
    description:
      'Pisang kepok matang digoreng renyah dengan saus gula aren kental dan taburan keju parut.',
    image:
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=600&q=80',
    bestSeller: false,
    available: true,
  },
  {
    id: 'm-13',
    name: 'Morning Pairing: Kopi Susu Gula Aren + Butter Croissant',
    category: 'Paket Promo',
    type: 'drink',
    price: 44000,
    originalPrice: 52000,
    description:
      'Promo Hari Ini! Perpaduan 1 Kopi Susu Gula Aren Kala + 1 French Butter Croissant hangat dipanggang segar.',
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
    bestSeller: true,
    available: true,
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'CF-101',
    table: '02',
    customerName: 'Nadia Putri',
    paymentMethod: 'QRIS',
    paymentStatus: 'paid',
    status: 'preparing',
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    items: [
      {
        cartId: 'init-1',
        menuId: 'm-1',
        name: 'Kopi Susu Gula Aren Kala',
        quantity: 2,
        unitPrice: 24000,
        totalPrice: 48000,
        summary: 'Ice • Regular • Normal Sugar',
        note: 'Es batu sedang saja',
      },
      {
        cartId: 'init-2',
        menuId: 'm-11',
        name: 'French Butter Croissant',
        quantity: 1,
        unitPrice: 26000,
        totalPrice: 26000,
        summary: 'Tidak Pedas',
        note: 'Tolong dihangatkan',
      },
    ],
    subtotal: 74000,
    tax: 7400,
    total: 81400,
  },
  {
    id: 'CF-102',
    table: '07',
    customerName: 'Dimas Pratama',
    paymentMethod: 'CASH',
    paymentStatus: 'unpaid',
    status: 'waiting_payment',
    createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    items: [
      {
        cartId: 'init-3',
        menuId: 'm-9',
        name: 'Rice Bowl Ayam Sambal Matah',
        quantity: 1,
        unitPrice: 36000,
        totalPrice: 36000,
        summary: 'Pedas',
        note: '',
      },
      {
        cartId: 'init-4',
        menuId: 'm-6',
        name: 'Artisan Thai Tea',
        quantity: 1,
        unitPrice: 24000,
        totalPrice: 24000,
        summary: 'Ice • Regular • Less Sugar',
        note: '',
      },
    ],
    subtotal: 60000,
    tax: 6000,
    total: 66000,
  },
];

// ============================================================================
// 3. KOMPONEN VISUAL PENDUKUNG (QR SVG GENERATOR, SAFE IMAGE, RECEIPT)
// ============================================================================

/**
 * Generator Matriks QR Code SVG deterministik & tajam berdasarkan payload string
 */
const QRCodeSVG: React.FC<{
  value?: string;
  size?: number;
  showCenterBadge?: boolean;
}> = ({ value = 'https://kalakopi.id/menu?table=04', size = 160, showCenterBadge = true }) => {
  const matrix = useMemo(() => {
    const gridSize = 25;
    const grid: (number | null)[][] = Array.from({ length: gridSize }, () =>
      Array(gridSize).fill(null)
    );

    let seed = 2166136261;
    for (let i = 0; i < value.length; i++) {
      seed ^= value.charCodeAt(i);
      seed = Math.imul(seed, 16777619);
    }
    const nextRand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return (seed >>> 0) / 4294967296;
    };

    const placeFinder = (startR: number, startC: number) => {
      for (let r = -1; r <= 7; r++) {
        for (let c = -1; c <= 7; c++) {
          const rr = startR + r;
          const cc = startC + c;
          if (rr < 0 || rr >= gridSize || cc < 0 || cc >= gridSize) continue;
          if (r === -1 || r === 7 || c === -1 || c === 7) {
            grid[rr][cc] = 0;
          } else if (
            r === 0 ||
            r === 6 ||
            c === 0 ||
            c === 6 ||
            (r >= 2 && r <= 4 && c >= 2 && c <= 4)
          ) {
            grid[rr][cc] = 1;
          } else {
            grid[rr][cc] = 0;
          }
        }
      }
    };

    placeFinder(0, 0);
    placeFinder(0, gridSize - 7);
    placeFinder(gridSize - 7, 0);

    for (let r = 16; r <= 20; r++) {
      for (let c = 16; c <= 20; c++) {
        if (r === 16 || r === 20 || c === 16 || c === 20 || (r === 18 && c === 18)) {
          grid[r][c] = 1;
        } else {
          grid[r][c] = 0;
        }
      }
    }

    for (let i = 8; i < gridSize - 8; i++) {
      if (grid[6][i] === null) grid[6][i] = i % 2 === 0 ? 1 : 0;
      if (grid[i][6] === null) grid[i][6] = i % 2 === 0 ? 1 : 0;
    }

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (showCenterBadge && r >= 10 && r <= 14 && c >= 10 && c <= 14) {
          grid[r][c] = 0;
        } else if (grid[r][c] === null) {
          grid[r][c] = nextRand() > 0.48 ? 1 : 0;
        }
      }
    }

    return grid;
  }, [value, showCenterBadge]);

  const gridSize = 25;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${gridSize + 2} ${gridSize + 2}`}
      className="block rounded-xl bg-white p-1.5 shadow-inner border border-[#EAE2D6]"
      aria-label={`QR Code ${value}`}
    >
      <rect x="0" y="0" width={gridSize + 2} height={gridSize + 2} fill="#FFFFFF" />
      {matrix.map((row, r) =>
        row.map((cell, c) =>
          cell === 1 ? (
            <rect
              key={`${r}-${c}`}
              x={c + 1}
              y={r + 1}
              width="0.92"
              height="0.92"
              rx="0.18"
              fill="#1C1917"
            />
          ) : null
        )
      )}
      {showCenterBadge && (
        <g>
          <rect
            x="10.5"
            y="10.5"
            width="6"
            height="6"
            rx="1.2"
            fill="#4A2C2A"
            stroke="#FFFFFF"
            strokeWidth="0.6"
          />
          <circle cx="13.5" cy="13.5" r="1.4" fill="#FAF7F2" />
        </g>
      )}
    </svg>
  );
};

/**
 * Gambar menu dengan fallback ilustrasi gradient hangat jika URL gagal dimuat
 */
const SafeImage: React.FC<{
  src?: string;
  alt: string;
  category?: string;
  className?: string;
}> = ({ src, alt, category, className = '' }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!src || hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#EFE6D8] via-[#E4D5C1] to-[#D6C1A6] text-[#4A2C2A] ${className}`}
      >
        {category === 'Makanan Berat' || category === 'Camilan & Pastry' ? (
          <Utensils className="w-7 h-7 opacity-75" />
        ) : (
          <Coffee className="w-7 h-7 opacity-75" />
        )}
        <span className="text-[10px] font-medium mt-1 opacity-75 px-2 text-center line-clamp-1">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={className}
      loading="lazy"
    />
  );
};

/**
 * Modal Struk Digital (e-Receipt) yang dapat diunduh atau dicetak
 */
const ReceiptModal: React.FC<{
  order: Order | null;
  onClose: () => void;
  onDownloadToast?: (msg: string) => void;
}> = ({ order, onClose, onDownloadToast }) => {
  if (!order) return null;

  const handleDownloadReceipt = () => {
    const lines = [
      '========================================',
      '        KALA KOPI & ROASTERY            ',
      '  Jl. Senopati No. 48, Jakarta Selatan  ',
      '========================================',
      `No. Pesanan : #${order.id}`,
      `Nomor Meja  : Meja ${order.table}`,
      `Pemesan     : ${order.customerName || 'Pelanggan Meja ' + order.table}`,
      `Waktu       : ${new Date(order.createdAt).toLocaleString('id-ID')}`,
      `Metode Bayar: ${order.paymentMethod}`,
      `Status Bayar: ${order.paymentStatus === 'paid' ? 'LUNAS' : 'MENUNGGU PEMBAYARAN'}`,
      '----------------------------------------',
      ...order.items.map(
        (item) =>
          `${item.quantity}x ${item.name} (${formatRupiah(item.totalPrice)})\n   [${item.summary}]${
            item.note ? `\n   Catatan: ${item.note}` : ''
          }`
      ),
      '----------------------------------------',
      `Subtotal    : ${formatRupiah(order.subtotal)}`,
      `PB1 (10%)   : ${formatRupiah(order.tax)}`,
      `TOTAL BAYAR : ${formatRupiah(order.total)}`,
      '========================================',
      '  Terima kasih telah berkunjung!        ',
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Struk-KalaKopi-${order.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onDownloadToast?.(`Struk digital #${order.id} berhasil disimpan!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-sm rounded-3xl bg-[#FAF7F2] shadow-2xl border border-[#EAE2D6] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-[#1C1917] text-[#FAF7F2] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-[#C86D51]" />
            <span className="font-semibold text-sm tracking-wide">Struk Digital (e-Receipt)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 max-h-[72vh] overflow-y-auto">
          <div className="bg-white rounded-2xl p-5 shadow-xs border border-dashed border-[#D6C7B2] text-[#1C1917]">
            <div className="text-center border-b border-dashed border-[#EAE2D6] pb-4">
              <div className="w-10 h-10 rounded-full bg-[#4A2C2A] text-white flex items-center justify-center mx-auto mb-2">
                <Coffee className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base tracking-tight">KALA KOPI & ROASTERY</h3>
              <p className="text-xs text-[#7A6A60] mt-0.5">Jl. Senopati No. 48, Jakarta</p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF7F2] border border-[#EAE2D6]">
                <span>#{order.id}</span>
                <span>•</span>
                <span className="text-[#C86D51]">Meja {order.table}</span>
              </div>
            </div>

            <div className="py-3 border-b border-dashed border-[#EAE2D6] text-xs space-y-1.5 text-[#5C4D44]">
              <div className="flex justify-between">
                <span>Pemesan</span>
                <span className="font-semibold text-[#1C1917]">
                  {order.customerName || `Tamu Meja ${order.table}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Waktu Pesan</span>
                <span>{formatTime(order.createdAt)} WIB</span>
              </div>
              <div className="flex justify-between">
                <span>Metode Bayar</span>
                <span className="font-semibold text-[#1C1917]">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Status Pembayaran</span>
                {order.paymentStatus === 'paid' ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    LUNAS
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                    BELUM BAYAR
                  </span>
                )}
              </div>
            </div>

            <div className="py-3 border-b border-dashed border-[#EAE2D6] space-y-3">
              {order.items.map((item, idx) => (
                <div key={idx} className="text-xs">
                  <div className="flex justify-between font-semibold text-[#1C1917]">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span>{formatRupiah(item.totalPrice)}</span>
                  </div>
                  <p className="text-[11px] text-[#7A6A60] mt-0.5">{item.summary}</p>
                  {item.note && (
                    <p className="text-[11px] italic text-[#C86D51] mt-0.5">
                      Catatan: "{item.note}"
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-[#7A6A60]">
                <span>Subtotal</span>
                <span>{formatRupiah(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#7A6A60]">
                <span>Pajak Restoran (PB1 10%)</span>
                <span>{formatRupiah(order.tax)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#1C1917] pt-2 border-t border-[#EAE2D6]">
                <span>Total Bayar</span>
                <span className="text-[#4A2C2A]">{formatRupiah(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mt-4">
            <button
              onClick={handleDownloadReceipt}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#4A2C2A] hover:bg-[#38201E] text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Simpan Struk
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white hover:bg-[#F3ECE1] text-[#1C1917] border border-[#EAE2D6] text-xs font-semibold transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Cetak
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 4. PORTFOLIO SHOWCASE INTRO (LAYAR PEMBUKA DESKTOP / PORTOFOLIO)
// ============================================================================

const PortfolioIntroView: React.FC<{
  selectedTable: string;
  onStartCustomerDemo: () => void;
  onOpenAdminDashboard: () => void;
}> = ({ selectedTable, onStartCustomerDemo, onOpenAdminDashboard }) => {
  const highlights = [
    {
      icon: QrCode,
      title: 'Deteksi Meja Otomatis via QR',
      desc: 'Membaca parameter URL meja (?table=04) secara instan lengkap dengan generator kartu QR meja siap cetak.',
    },
    {
      icon: Layers,
      title: 'Kustomisasi Varian & Add-ons',
      desc: 'Bottom-sheet interaktif untuk memilih suhu Hot/Ice, ukuran, level gula, topping ekstra, dan catatan dapur.',
    },
    {
      icon: ShieldCheck,
      title: 'Pembayaran QRIS & Cash',
      desc: 'Mendukung gambar QRIS m-banking pribadi, timer hitung mundur 15 menit, salin nominal, hingga antrean tunai.',
    },
    {
      icon: Monitor,
      title: 'POS Kasir & Stok Real-Time',
      desc: 'Pesanan pelanggan langsung tersinkron ke antrean kasir, status dapur, e-Receipt digital, dan kontrol stok menu.',
    },
  ];

  const techStack = [
    'React 19',
    'TypeScript',
    'Tailwind CSS',
    'Lucide Icons',
    'QRIS & Cash Flow',
    'Mobile-First UX',
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <div className="bg-white rounded-[2.25rem] border border-[#EAE2D6] shadow-[0_20px_60px_-20px_rgba(28,25,23,0.12)] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Kolom Kiri: Narasi Proyek, Fitur Unggulan & CTA */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
            <div>
              {/* Badge Studi Kasus */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E5D9C7] text-[#4A2C2A] text-xs font-bold tracking-wide mb-5">
                <Sparkles className="w-3.5 h-3.5 text-[#C86D51]" />
                <span>Full-Stack UI/UX Case Study</span>
              </div>

              {/* Judul Proyek */}
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1C1917] tracking-tight leading-[1.15]">
                Kala Kopi & Roastery —{' '}
                <span className="text-[#4A2C2A]">Smart QR Table Ordering & POS System</span>
              </h1>

              {/* Nilai Bisnis */}
              <p className="mt-4 text-sm sm:text-base text-[#5C4D44] leading-relaxed">
                Solusi pemesanan mandiri berbasis pemindaian QR Code di meja kafe yang dirancang
                untuk memangkas antrean kasir, meminimalkan kesalahan pencatatan varian pesanan,
                serta menyinkronkan pembayaran <strong>QRIS</strong> maupun <strong>Cash</strong>{' '}
                secara langsung ke layar dapur dan kasir.
              </p>

              {/* 4 Kartu Fitur Unggulan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-7">
                {highlights.map((feat) => {
                  const IconComp = feat.icon;
                  return (
                    <div
                      key={feat.title}
                      className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D6] hover:border-[#C86D51]/50 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#4A2C2A] text-[#FAF7F2] flex items-center justify-center mb-2.5">
                        <IconComp className="w-4 h-4 text-[#F3D5C8]" />
                      </div>
                      <h3 className="font-bold text-xs sm:text-sm text-[#1C1917]">{feat.title}</h3>
                      <p className="text-[11px] sm:text-xs text-[#7A6A60] mt-1 leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Tech Stack Badges */}
              <div className="mt-7">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#8C7B70] mb-2.5">
                  Arsitektur & Teknologi
                </p>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-full bg-[#1C1917] text-[#FAF7F2] text-xs font-semibold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tombol CTA Utama & Sekunder */}
            <div className="mt-8 pt-6 border-t border-[#EAE2D6] flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={onStartCustomerDemo}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#4A2C2A] hover:bg-[#38201E] text-white font-bold text-sm shadow-lg transition-all cursor-pointer active:scale-[0.99]"
              >
                <Smartphone className="w-4 h-4 text-[#E8A994]" />
                <span>Mulai Demo Interaktif</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenAdminDashboard}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-[#FAF7F2] hover:bg-[#F1E8DA] text-[#1C1917] border border-[#D8CBB8] font-bold text-sm transition-all cursor-pointer"
              >
                <Monitor className="w-4 h-4 text-[#C86D51]" />
                <span>Buka Dashboard Kasir</span>
              </button>
            </div>
          </div>

          {/* Kolom Kanan: Visual Preview Suasana Kafe & Alur Sistem */}
          <div className="lg:col-span-5 relative bg-[#1C1917] text-[#FAF7F2] p-6 sm:p-10 flex flex-col justify-between overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=80"
              alt="Suasana Kala Kopi & Roastery"
              className="absolute inset-0 w-full h-full object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917] via-[#1C1917]/80 to-[#4A2C2A]/65" />

            {/* Kartu Simulasi QR Meja */}
            <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#C86D51] text-white flex items-center justify-center">
                    <Coffee className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">Kala Kopi & Roastery</p>
                    <p className="text-[11px] text-[#E6D7C3]">QR Table Ordering Flow</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold">
                  Live Prototype
                </span>
              </div>

              <div className="flex items-center gap-4 bg-[#FAF7F2] text-[#1C1917] p-3.5 rounded-2xl">
                <QRCodeSVG
                  value={`https://kalakopi.id/menu?table=${selectedTable}`}
                  size={84}
                  showCenterBadge={true}
                />
                <div className="min-w-0">
                  <span className="inline-block px-2 py-0.5 rounded-md bg-[#C86D51] text-white text-[10px] font-bold uppercase tracking-wider">
                    Meja {selectedTable} Terdeteksi
                  </span>
                  <p className="font-extrabold text-sm mt-1">Scan → Pesan → Bayar</p>
                  <p className="text-[11px] text-[#7A6A60] mt-0.5">
                    Uji alur penuh dari layar HP pelanggan hingga konfirmasi kasir dalam satu layar.
                  </p>
                </div>
              </div>
            </div>

            {/* Alur 3 Langkah Simulasi */}
            <div className="relative z-10 mt-8 space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#E8A994]">
                Skenario Pengujian Portofolio
              </p>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <span className="w-6 h-6 rounded-full bg-[#C86D51] text-white font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <p className="text-[#EDE4D7] leading-relaxed">
                    Masuk ke <strong>Tampilan Pelanggan</strong>, isi nama di Welcome Screen, dan
                    pilih menu atau paket promo.
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <span className="w-6 h-6 rounded-full bg-[#C86D51] text-white font-bold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <p className="text-[#EDE4D7] leading-relaxed">
                    Checkout menggunakan <strong>QRIS</strong> (siap gambar QRIS m-banking) atau{' '}
                    <strong>Cash</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <span className="w-6 h-6 rounded-full bg-[#C86D51] text-white font-bold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <p className="text-[#EDE4D7] leading-relaxed">
                    Buka <strong>Kasir & Admin</strong> untuk memproses pesanan, mengatur stok
                    habis, dan mencetak QR meja.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 5. TAMPILAN PELANGGAN (MOBILE-FIRST QR TABLE ORDERING FLOW)
// ============================================================================

const CustomerView: React.FC<{
  menuItems: MenuItem[];
  orders: Order[];
  selectedTable: string;
  onOpenTableModal: () => void;
  onCreateOrder: (payload: {
    table: string;
    customerName: string;
    paymentMethod: 'QRIS' | 'CASH';
    items: CartItem[];
    subtotal: number;
    tax: number;
    total: number;
  }) => Order;
  onConfirmQrisPayment: (orderId: string) => void;
  onJumpToAdminCashier: (orderId: string) => void;
  showToast: (msg: string) => void;
}> = ({
  menuItems,
  orders,
  selectedTable,
  onOpenTableModal,
  onCreateOrder,
  onConfirmQrisPayment,
  onJumpToAdminCashier,
  showToast,
}) => {
  // Layar aktif pelanggan: diawali dari 'welcome' (Welcome Splash Screen)
  const [screen, setScreen] = useState<
    'welcome' | 'menu' | 'cart' | 'payment_qris' | 'payment_cash' | 'tracking'
  >('welcome');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // State modal kustomisasi bottom-sheet
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [tempOption, setTempOption] = useState('ice');
  const [sizeOption, setSizeOption] = useState('regular');
  const [sugarOption, setSugarOption] = useState('normal');
  const [spiceOption, setSpiceOption] = useState('none');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [itemQty, setItemQty] = useState(1);
  const [itemNote, setItemNote] = useState('');

  // State keranjang belanja & nama pemesan (terhubung dari Welcome Screen ke Checkout)
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'QRIS' | 'CASH'>('QRIS');

  // State pesanan aktif & QRIS M-Banking pribadi
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [qrisSecondsLeft, setQrisSecondsLeft] = useState(900); // 15:00
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [qrisImgFailed, setQrisImgFailed] = useState(false);
  const [uploadedQrisPreview, setUploadedQrisPreview] = useState<string | null>(null);
  const qrisFileInputRef = useRef<HTMLInputElement | null>(null);

  const currentOrder = useMemo(
    () => orders.find((o) => o.id === currentOrderId) || null,
    [orders, currentOrderId]
  );

  // Item Paket Promo Morning Pairing (m-13) untuk tombol "Pesan Paket" di Hero Banner
  const morningPairingItem = useMemo(
    () => menuItems.find((m) => m.id === 'm-13') || menuItems[0],
    [menuItems]
  );

  // Timer hitung mundur QRIS 15 menit
  useEffect(() => {
    if (screen !== 'payment_qris') return;
    const timer = setInterval(() => {
      setQrisSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [screen]);

  // Filter menu berdasarkan pencarian & kategori
  const filteredMenu = useMemo(() => {
    return menuItems.filter((item) => {
      const matchCategory =
        selectedCategory === 'Semua' || item.category === selectedCategory;
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  // Buka bottom-sheet kustomisasi item
  const openCustomizeModal = (item: MenuItem) => {
    if (!item.available) return;
    setCustomizingItem(item);
    setTempOption('ice');
    setSizeOption('regular');
    setSugarOption('normal');
    setSpiceOption('none');
    setSelectedAddons([]);
    setItemQty(1);
    setItemNote('');
  };

  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  // Hitung harga satuan item di dalam modal kustomisasi
  const customizedUnitPrice = useMemo(() => {
    if (!customizingItem) return 0;
    let extra = 0;
    if (customizingItem.type === 'drink') {
      const sizeObj = DRINK_CUSTOMIZATIONS.sizes.find((s) => s.id === sizeOption);
      extra += sizeObj ? sizeObj.price : 0;
      selectedAddons.forEach((aId) => {
        const addonObj = DRINK_CUSTOMIZATIONS.addons.find((a) => a.id === aId);
        if (addonObj) extra += addonObj.price;
      });
    } else {
      selectedAddons.forEach((aId) => {
        const addonObj = FOOD_CUSTOMIZATIONS.addons.find((a) => a.id === aId);
        if (addonObj) extra += addonObj.price;
      });
    }
    return customizingItem.price + extra;
  }, [customizingItem, sizeOption, selectedAddons]);

  // Masukkan item ke keranjang
  const handleAddToCart = () => {
    if (!customizingItem) return;

    const summaryParts: string[] = [];
    if (customizingItem.type === 'drink') {
      const t = DRINK_CUSTOMIZATIONS.temperatures.find((x) => x.id === tempOption);
      const s = DRINK_CUSTOMIZATIONS.sizes.find((x) => x.id === sizeOption);
      const g = DRINK_CUSTOMIZATIONS.sugarLevels.find((x) => x.id === sugarOption);
      if (t) summaryParts.push(t.label.split(' ')[0]);
      if (s) summaryParts.push(s.label);
      if (g) summaryParts.push(g.label);
      selectedAddons.forEach((aId) => {
        const a = DRINK_CUSTOMIZATIONS.addons.find((x) => x.id === aId);
        if (a) summaryParts.push(`+${a.label}`);
      });
    } else {
      const sp = FOOD_CUSTOMIZATIONS.spiceLevels.find((x) => x.id === spiceOption);
      if (sp) summaryParts.push(sp.label);
      selectedAddons.forEach((aId) => {
        const a = FOOD_CUSTOMIZATIONS.addons.find((x) => x.id === aId);
        if (a) summaryParts.push(`+${a.label}`);
      });
    }

    const newCartItem: CartItem = {
      cartId: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      menuId: customizingItem.id,
      name: customizingItem.name,
      image: customizingItem.image,
      category: customizingItem.category,
      quantity: itemQty,
      unitPrice: customizedUnitPrice,
      totalPrice: customizedUnitPrice * itemQty,
      summary: summaryParts.join(' • '),
      note: itemNote.trim(),
    };

    setCart((prev) => [...prev, newCartItem]);
    showToast(`${itemQty}x ${customizingItem.name} ditambahkan ke keranjang`);
    setCustomizingItem(null);
  };

  // Ubah qty di keranjang
  const updateCartItemQty = (cartId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.cartId !== cartId) return item;
          const nextQty = item.quantity + delta;
          if (nextQty <= 0) return null;
          return {
            ...item,
            quantity: nextQty,
            totalPrice: item.unitPrice * nextQty,
          };
        })
        .filter((x): x is CartItem => x !== null)
    );
  };

  // Ringkasan kalkulasi keranjang
  const cartSummary = useMemo(() => {
    const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
    const tax = Math.round(subtotal * 0.1);
    const total = subtotal + tax;
    return { totalCount, subtotal, tax, total };
  }, [cart]);

  // Buat pesanan saat checkout
  const handleCheckout = () => {
    if (cart.length === 0) return;

    const newOrder = onCreateOrder({
      table: selectedTable,
      customerName: customerName.trim() || `Tamu Meja ${selectedTable}`,
      paymentMethod,
      items: cart,
      subtotal: cartSummary.subtotal,
      tax: cartSummary.tax,
      total: cartSummary.total,
    });

    setCurrentOrderId(newOrder.id);
    setCart([]);

    if (paymentMethod === 'QRIS') {
      setQrisSecondsLeft(900);
      setScreen('payment_qris');
    } else {
      setScreen('payment_cash');
    }
  };

  // Salin nominal total pembayaran QRIS
  const handleCopyNominal = () => {
    if (!currentOrder) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(String(currentOrder.total)).catch(() => {});
    }
    showToast(`Nominal ${formatRupiah(currentOrder.total)} berhasil disalin!`);
  };

  // Pratinjau gambar QRIS M-Banking lokal secara instan tanpa reload
  const handlePreviewQrisUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setUploadedQrisPreview(reader.result);
        setQrisImgFailed(false);
        showToast('Pratinjau gambar QRIS m-banking berhasil dimuat!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Unduh gambar kartu QRIS
  const handleSaveQrisImage = () => {
    if (!currentOrder) return;

    // Jika memakai gambar QRIS custom/upload, unduh langsung file gambarnya
    const activeCustomSrc = uploadedQrisPreview || (!qrisImgFailed ? '/qris-saya.png' : null);
    if (activeCustomSrc) {
      const a = document.createElement('a');
      a.href = activeCustomSrc;
      a.download = `QRIS-KalaKopi-${currentOrder.id}.png`;
      a.click();
      showToast('Gambar QRIS berhasil disimpan ke perangkat!');
      return;
    }

    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="440" viewBox="0 0 360 440">
      <rect width="360" height="440" rx="24" fill="#FAF7F2"/>
      <rect x="20" y="20" width="320" height="400" rx="20" fill="#FFFFFF" stroke="#EAE2D6" stroke-width="2"/>
      <text x="180" y="62" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="20" fill="#1C1917">QRIS PEMBAYARAN</text>
      <text x="180" y="86" text-anchor="middle" font-family="sans-serif" font-size="13" fill="#4A2C2A">KALA KOPI &amp; ROASTERY • MEJA ${currentOrder.table}</text>
      <rect x="85" y="108" width="190" height="190" rx="12" fill="#1C1917"/>
      <rect x="100" y="123" width="160" height="160" rx="8" fill="#FFFFFF"/>
      <text x="180" y="208" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="14" fill="#1C1917">QRIS #${currentOrder.id}</text>
      <text x="180" y="335" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#7A6A60">Total Pembayaran</text>
      <text x="180" y="365" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="24" fill="#C86D51">${formatRupiah(currentOrder.total)}</text>
      <text x="180" y="398" text-anchor="middle" font-family="sans-serif" font-size="11" fill="#7A6A60">NMID: ID1026008849201 • A01</text>
    </svg>`;
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `QRIS-KalaKopi-${currentOrder.id}.svg`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Gambar QRIS berhasil disimpan ke perangkat!');
  };

  const formatCountdown = (sec: number): string => {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="flex justify-center items-start py-0 md:py-6 px-0 md:px-4 min-h-[calc(100vh-56px)]">
      {/* Frame Smartphone Responsif */}
      <div className="relative w-full md:w-[416px] min-h-[calc(100vh-56px)] md:min-h-[820px] md:h-[820px] bg-[#FAF7F2] text-[#1C1917] md:rounded-[2.75rem] md:border-[10px] md:border-[#1C1917] md:shadow-[0_25px_70px_-15px_rgba(28,25,23,0.35)] flex flex-col overflow-hidden">
        {/* Notch Speaker dekoratif pada mode desktop */}
        <div
          className={`hidden md:flex items-center justify-center pt-2 pb-1 shrink-0 z-30 ${
            screen === 'welcome' ? 'bg-[#1C1917]' : 'bg-[#FAF7F2]'
          }`}
        >
          <div className="w-24 h-4 bg-[#110F0E] rounded-full flex items-center justify-end px-2 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-[#3A322E]" />
          </div>
        </div>

        {/* ================================================================ */}
        {/* LAYAR 0: WELCOME SPLASH SCREEN (LAYAR SAPAAN ESTETIK)            */}
        {/* ================================================================ */}
        {screen === 'welcome' && (
          <div className="relative flex-1 flex flex-col justify-between p-6 text-[#FAF7F2] bg-[#1C1917] overflow-y-auto">
            {/* Latar Foto Suasana Kafe + Overlay Gradasi Hangat */}
            <img
              src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=80"
              alt="Suasana Kala Kopi & Roastery"
              className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#1C1917]/80 via-[#1C1917]/65 to-[#1C1917]" />

            {/* Bagian Atas: Logo Kafe, Status Buka & Badge Meja */}
            <div className="relative z-10 flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#4A2C2A] border border-white/15 text-[#FAF7F2] flex items-center justify-center shadow-md">
                  <Coffee className="w-5 h-5 text-[#E8A994]" />
                </div>
                <div>
                  <p className="font-bold text-sm tracking-tight text-white">
                    Kala Kopi & Roastery
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#E6D7C3]">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Buka
                    </span>
                    <span>•</span>
                    <span>07.00 - 22.00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bagian Tengah: Badge Meja Aktif & Headline Sambutan */}
            <div className="relative z-10 my-auto py-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/12 backdrop-blur-md border border-white/20 mb-4">
                <QrCode className="w-4 h-4 text-[#E8A994]" />
                <span className="text-xs font-extrabold tracking-wide text-white">
                  Meja {selectedTable}
                </span>
                <button
                  type="button"
                  onClick={onOpenTableModal}
                  className="ml-1 px-2 py-0.5 rounded-lg bg-[#C86D51] hover:bg-[#B55E43] text-[10px] font-bold text-white transition-colors cursor-pointer"
                >
                  Ganti Meja
                </button>
              </div>

              <h1 className="text-2xl sm:text-[28px] font-extrabold text-white leading-[1.2] tracking-tight">
                Seduhan Hangat, Pesan Langsung dari Meja Anda
              </h1>
              <p className="text-xs sm:text-sm text-[#E6D7C3] mt-3 leading-relaxed">
                Nikmati racikan kopi spesialti dan hidangan hangat tanpa perlu antre di kasir.
                Pilih menu, atur takaran favoritmu, dan bayar praktis via QRIS atau Cash.
              </p>
            </div>

            {/* Bagian Bawah: Input Nama Pemesan (Opsional) & Tombol Mulai */}
            <div className="relative z-10 space-y-3 bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/15">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-[#FAF7F2] mb-1.5">
                  <User className="w-3.5 h-3.5 text-[#E8A994]" />
                  <span>Nama Pemesan</span>
                  <span className="text-[11px] font-normal text-[#D6C7B2]">(Opsional)</span>
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={`Contoh: Raka (Default: Tamu Meja ${selectedTable})`}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/95 text-[#1C1917] placeholder-[#8C7B70] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#C86D51]"
                />
              </div>

              <button
                type="button"
                onClick={() => setScreen('menu')}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#C86D51] hover:bg-[#B55E43] text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
              >
                <span>Mulai Pesan Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* LAYAR 1: HALAMAN MENU UTAMA & HERO PROMO BANNER                  */}
        {/* ================================================================ */}
        {screen === 'menu' && (
          <>
            {/* Header Kafe & Deteksi Meja */}
            <header className="bg-[#FAF7F2]/95 backdrop-blur-md px-4 pt-3 pb-2 border-b border-[#EAE2D6] shrink-0 z-20">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <button
                    onClick={() => setScreen('welcome')}
                    title="Kembali ke Layar Sambutan"
                    className="w-9 h-9 rounded-2xl bg-[#4A2C2A] hover:bg-[#38201E] text-[#FAF7F2] flex items-center justify-center shrink-0 shadow-xs transition-colors cursor-pointer"
                  >
                    <Coffee className="w-4 h-4 text-[#E8A994]" />
                  </button>
                  <div className="min-w-0">
                    <h1 className="font-bold text-sm text-[#1C1917] truncate">
                      Kala Kopi & Roastery
                    </h1>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#7A6A60]">
                      <span className="inline-flex items-center gap-1 px-1.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Buka
                      </span>
                      {customerName.trim() ? (
                        <span className="truncate font-medium text-[#4A2C2A]">
                          • Halo, {customerName.trim()}
                        </span>
                      ) : (
                        <span>• 07.00 - 22.00</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setScreen('welcome')}
                    title="Layar Sambutan"
                    className="p-2 rounded-xl bg-white hover:bg-[#F3ECE1] text-[#5C4D44] border border-[#EAE2D6] transition-colors cursor-pointer"
                  >
                    <Home className="w-3.5 h-3.5" />
                  </button>

                  {/* Badge Nomor Meja */}
                  <button
                    onClick={onOpenTableModal}
                    title="Klik untuk simulasi scan QR meja lain"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[#C86D51] hover:bg-[#B55E43] text-white shadow-xs transition-all cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold tracking-wide">Meja {selectedTable}</span>
                  </button>
                </div>
              </div>

              {/* Banner Melayang jika pelanggan memiliki pesanan aktif */}
              {currentOrder && (
                <button
                  onClick={() => {
                    if (
                      currentOrder.status === 'waiting_payment' &&
                      currentOrder.paymentMethod === 'QRIS'
                    ) {
                      setScreen('payment_qris');
                    } else if (
                      currentOrder.status === 'waiting_payment' &&
                      currentOrder.paymentMethod === 'CASH'
                    ) {
                      setScreen('payment_cash');
                    } else {
                      setScreen('tracking');
                    }
                  }}
                  className="mt-2.5 w-full flex items-center justify-between px-3.5 py-2 rounded-2xl bg-[#1C1917] text-[#FAF7F2] text-xs shadow-sm hover:bg-[#2E2926] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#C86D51] animate-ping" />
                    <span className="font-medium">
                      Pesanan Aktif <strong>#{currentOrder.id}</strong> •{' '}
                      <span className="text-[#E8A994]">
                        {currentOrder.status === 'waiting_payment'
                          ? 'Menunggu Pembayaran'
                          : currentOrder.status === 'preparing'
                          ? 'Diproses Dapur'
                          : 'Siap Diantar ke Meja!'}
                      </span>
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#E8A994]" />
                </button>
              )}

              {/* Kolom Pencarian Real-Time */}
              <div className="relative mt-2.5">
                <Search className="w-4 h-4 text-[#8C7B70] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari kopi, matcha, nasi goreng..."
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-[#EAE2D6] text-xs text-[#1C1917] placeholder-[#9C8C82] focus:outline-none focus:border-[#4A2C2A]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C7B70] hover:text-[#1C1917]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Filter Kategori Horizontal */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2.5 pb-1">
                {CATEGORIES.map((cat) => {
                  const active = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        active
                          ? 'bg-[#4A2C2A] text-white shadow-xs'
                          : 'bg-white text-[#5C4D44] border border-[#EAE2D6] hover:bg-[#F3ECE1]'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </header>

            {/* Daftar Kartu Menu + Hero Promo Banner */}
            <main className="flex-1 overflow-y-auto px-4 pt-3 pb-28 space-y-3">
              {/* HERO PROMO BANNER */}
              {!searchQuery &&
                (selectedCategory === 'Semua' || selectedCategory === 'Paket Promo') &&
                morningPairingItem && (
                  <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#4A2C2A] via-[#341E1D] to-[#1C1917] text-[#FAF7F2] p-4 shadow-md border border-[#5D3A37]">
                    <div className="flex items-center gap-3.5">
                      <div className="flex-1 min-w-0">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#C86D51] text-white text-[10px] font-bold tracking-wide">
                          <Sparkles className="w-2.5 h-2.5" />
                          Promo Hari Ini
                        </span>
                        <h3 className="font-extrabold text-sm text-white leading-snug mt-2">
                          Morning Pairing: Kopi Susu Gula Aren + Butter Croissant
                        </h3>
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-[11px] line-through text-[#C7B6A6]">
                            Rp 52.000
                          </span>
                          <span className="text-base font-extrabold text-[#F3D5C8]">
                            Rp 44.000
                          </span>
                        </div>
                        <button
                          type="button"
                          disabled={!morningPairingItem.available}
                          onClick={() => openCustomizeModal(morningPairingItem)}
                          className={`mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            morningPairingItem.available
                              ? 'bg-[#FAF7F2] hover:bg-white text-[#1C1917] shadow-xs'
                              : 'bg-white/20 text-white/60 cursor-not-allowed'
                          }`}
                        >
                          <span>
                            {morningPairingItem.available ? 'Pesan Paket' : 'Paket Habis'}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#C86D51]" />
                        </button>
                      </div>

                      <div className="w-24 h-28 rounded-2xl overflow-hidden shrink-0 border border-white/15 shadow-inner">
                        <SafeImage
                          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80"
                          alt="Morning Pairing Promo"
                          category="Paket Promo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                )}

              <div className="flex items-center justify-between pt-1">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#7A6A60]">
                  {selectedCategory === 'Semua' ? 'Semua Menu Pilihan' : selectedCategory} (
                  {filteredMenu.length})
                </h2>
                <span className="text-[11px] text-[#8C7B70]">Belum termasuk PB1 10%</span>
              </div>

              {filteredMenu.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-3xl border border-[#EAE2D6] p-6">
                  <Search className="w-8 h-8 text-[#B5A69B] mx-auto mb-2" />
                  <p className="text-sm font-semibold text-[#1C1917]">Menu tidak ditemukan</p>
                  <p className="text-xs text-[#7A6A60] mt-1">
                    Coba kata kunci lain atau pilih kategori Semua.
                  </p>
                </div>
              ) : (
                filteredMenu.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => openCustomizeModal(item)}
                    className={`group flex gap-3 p-3 rounded-2xl bg-white border border-[#EAE2D6] transition-all ${
                      item.available
                        ? 'hover:border-[#4A2C2A]/40 hover:shadow-md cursor-pointer active:scale-[0.99]'
                        : 'opacity-60 grayscale cursor-not-allowed bg-[#F5F1EB]'
                    }`}
                  >
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-[#EFE6D8]">
                      <SafeImage
                        src={item.image}
                        alt={item.name}
                        category={item.category}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {item.bestSeller && item.available && (
                        <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-[#C86D51] text-white text-[9px] font-bold tracking-wide shadow-xs flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5" />
                          Best Seller
                        </span>
                      )}
                      {!item.available && (
                        <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                          <span className="px-2.5 py-1 rounded-lg bg-[#1C1917] text-white text-[10px] font-bold uppercase tracking-wider">
                            Habis
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <span className="text-[10px] font-semibold text-[#8C7B70]">
                          {item.category}
                        </span>
                        <h3 className="font-bold text-sm text-[#1C1917] leading-snug line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-[11px] text-[#7A6A60] line-clamp-2 mt-0.5 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-bold text-sm text-[#4A2C2A]">
                            {formatRupiah(item.price)}
                          </span>
                          {item.originalPrice && (
                            <span className="text-[11px] line-through text-[#9C8C82]">
                              {formatRupiah(item.originalPrice)}
                            </span>
                          )}
                        </div>
                        {item.available ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openCustomizeModal(item);
                            }}
                            className="w-7 h-7 rounded-xl bg-[#4A2C2A] group-hover:bg-[#C86D51] text-white flex items-center justify-center transition-colors shadow-xs"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-[11px] font-semibold text-red-600">Stok Habis</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </main>

            {/* Sticky Floating Cart Bar */}
            {cartSummary.totalCount > 0 && (
              <div className="absolute bottom-4 left-4 right-4 z-30">
                <button
                  onClick={() => setScreen('cart')}
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl bg-[#1C1917] hover:bg-[#2E2926] text-white shadow-xl transition-all cursor-pointer active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-9 h-9 rounded-xl bg-[#C86D51] flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4 text-white" />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white text-[#1C1917] text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                        {cartSummary.totalCount}
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="text-[11px] text-[#D6C7B2]">
                        {cartSummary.totalCount} Item • Meja {selectedTable}
                      </p>
                      <p className="text-sm font-bold">{formatRupiah(cartSummary.subtotal)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-[#F3D5C8]">
                    <span>Keranjang</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              </div>
            )}
          </>
        )}

        {/* ================================================================ */}
        {/* LAYAR 2: KERANJANG BELANJA & CHECKOUT                            */}
        {/* ================================================================ */}
        {screen === 'cart' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="px-4 py-3.5 bg-white border-b border-[#EAE2D6] flex items-center justify-between shrink-0">
              <button
                onClick={() => setScreen('menu')}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#5C4D44] hover:text-[#1C1917] cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Tambah Menu
              </button>
              <span className="font-bold text-sm">Keranjang Meja {selectedTable}</span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FAF7F2] text-[#4A2C2A] border border-[#EAE2D6]">
                {cartSummary.totalCount} Item
              </span>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-[#EAE2D6] p-6">
                  <ShoppingBag className="w-10 h-10 text-[#B5A69B] mx-auto mb-2" />
                  <p className="font-bold text-sm">Keranjang masih kosong</p>
                  <p className="text-xs text-[#7A6A60] mt-1 mb-4">
                    Pilih menu kopi atau makanan favoritmu terlebih dahulu.
                  </p>
                  <button
                    onClick={() => setScreen('menu')}
                    className="px-5 py-2.5 rounded-xl bg-[#4A2C2A] text-white text-xs font-semibold cursor-pointer"
                  >
                    Lihat Daftar Menu
                  </button>
                </div>
              ) : (
                <>
                  {/* Daftar Item di Keranjang */}
                  <div className="space-y-2.5">
                    {cart.map((item) => (
                      <div
                        key={item.cartId}
                        className="p-3.5 rounded-2xl bg-white border border-[#EAE2D6] flex items-start justify-between gap-3"
                      >
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-xs text-[#1C1917]">{item.name}</h4>
                          <p className="text-[11px] text-[#7A6A60] mt-0.5">{item.summary}</p>
                          {item.note && (
                            <p className="text-[11px] text-[#C86D51] italic mt-0.5">
                              Catatan: "{item.note}"
                            </p>
                          )}
                          <p className="text-xs font-bold text-[#4A2C2A] mt-1.5">
                            {formatRupiah(item.totalPrice)}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 bg-[#FAF7F2] rounded-xl p-1 border border-[#EAE2D6] shrink-0">
                          <button
                            onClick={() => updateCartItemQty(item.cartId, -1)}
                            className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-[#1C1917] hover:bg-[#EAE2D6] cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateCartItemQty(item.cartId, 1)}
                            className="w-6 h-6 rounded-lg bg-[#4A2C2A] text-white flex items-center justify-center hover:bg-[#38201E] cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input Nama Pemesan (Tersinkron dengan Welcome Splash Screen) */}
                  <div className="p-4 rounded-2xl bg-white border border-[#EAE2D6] space-y-2">
                    <label className="block text-xs font-bold text-[#1C1917]">
                      Nama Pemesan <span className="font-normal text-[#8C7B70]">(Opsional)</span>
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={`Contoh: Budi (Default: Tamu Meja ${selectedTable})`}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D6] text-xs focus:outline-none focus:border-[#4A2C2A]"
                    />
                  </div>

                  {/* Pilihan Metode Pembayaran */}
                  <div className="p-4 rounded-2xl bg-white border border-[#EAE2D6] space-y-2.5">
                    <span className="block text-xs font-bold text-[#1C1917]">
                      Pilih Metode Pembayaran
                    </span>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('QRIS')}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        paymentMethod === 'QRIS'
                          ? 'border-[#4A2C2A] bg-[#FAF7F2] ring-1 ring-[#4A2C2A]'
                          : 'border-[#EAE2D6] hover:bg-[#FAF7F2]/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#4A2C2A]/10 text-[#4A2C2A] flex items-center justify-center">
                          <QrCode className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#1C1917]">QRIS (Bayar Instan)</p>
                          <p className="text-[11px] text-[#7A6A60]">
                            GoPay, OVO, DANA, ShopeePay, M-Banking
                          </p>
                        </div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentMethod === 'QRIS' ? 'border-[#4A2C2A]' : 'border-[#B5A69B]'
                        }`}
                      >
                        {paymentMethod === 'QRIS' && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#4A2C2A]" />
                        )}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CASH')}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        paymentMethod === 'CASH'
                          ? 'border-[#C86D51] bg-[#FAF7F2] ring-1 ring-[#C86D51]'
                          : 'border-[#EAE2D6] hover:bg-[#FAF7F2]/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#C86D51]/15 text-[#C86D51] flex items-center justify-center">
                          <Banknote className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#1C1917]">Cash (Bayar di Kasir)</p>
                          <p className="text-[11px] text-[#7A6A60]">
                            Tunjukkan kode pesanan ke kasir untuk bayar tunai
                          </p>
                        </div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          paymentMethod === 'CASH' ? 'border-[#C86D51]' : 'border-[#B5A69B]'
                        }`}
                      >
                        {paymentMethod === 'CASH' && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#C86D51]" />
                        )}
                      </div>
                    </button>
                  </div>

                  {/* Rincian Biaya Transparan */}
                  <div className="p-4 rounded-2xl bg-white border border-[#EAE2D6] space-y-2 text-xs">
                    <div className="flex justify-between text-[#7A6A60]">
                      <span>Subtotal ({cartSummary.totalCount} item)</span>
                      <span>{formatRupiah(cartSummary.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-[#7A6A60]">
                      <span>Pajak Restoran (PB1 10%)</span>
                      <span>{formatRupiah(cartSummary.tax)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-extrabold text-[#1C1917] pt-2 border-t border-dashed border-[#EAE2D6]">
                      <span>Total Bayar</span>
                      <span className="text-[#4A2C2A]">{formatRupiah(cartSummary.total)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-4 bg-white border-t border-[#EAE2D6] shrink-0">
                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#4A2C2A] hover:bg-[#38201E] text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
                >
                  {paymentMethod === 'QRIS' ? (
                    <>
                      <QrCode className="w-4 h-4" />
                      Bayar QRIS • {formatRupiah(cartSummary.total)}
                    </>
                  ) : (
                    <>
                      <Banknote className="w-4 h-4" />
                      Pesan & Bayar di Kasir • {formatRupiah(cartSummary.total)}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================================================================ */}
        {/* LAYAR 3A: PEMBAYARAN QRIS (SIAP QRIS M-BANKING PRIBADI)          */}
        {/* ================================================================ */}
        {screen === 'payment_qris' && currentOrder && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="px-4 py-3.5 bg-white border-b border-[#EAE2D6] flex items-center justify-between shrink-0">
              <button
                onClick={() => setScreen('menu')}
                className="flex items-center gap-1 text-xs font-semibold text-[#5C4D44] cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Menu
              </button>
              <span className="font-bold text-sm">Pembayaran QRIS</span>
              <span className="text-xs font-bold text-[#C86D51]">#{currentOrder.id}</span>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {/* Countdown Banner */}
              <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Batas waktu pembayaran
                </span>
                <span className="font-mono font-extrabold text-sm text-amber-700">
                  {formatCountdown(qrisSecondsLeft)}
                </span>
              </div>

              {/* Kartu Kode QRIS */}
              <div className="bg-white rounded-3xl p-5 border border-[#EAE2D6] shadow-sm text-center">
                <div className="flex items-center justify-between border-b border-[#EAE2D6] pb-3 mb-3.5">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-[#1C1917] text-white font-black text-xs tracking-wider">
                      QRIS
                    </span>
                    <span className="text-[11px] font-semibold text-[#7A6A60]">
                      GPN • Nasional
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#4A2C2A]">
                    Meja {currentOrder.table}
                  </span>
                </div>

                <p className="text-xs font-bold text-[#1C1917]">KALA KOPI & ROASTERY</p>
                <p className="text-[10px] text-[#8C7B70] mb-3">NMID: ID1026008849201 • A01</p>

                {/* Area Gambar QRIS: Prioritas uploadedQrisPreview -> /qris-saya.png -> Fallback SVG tajam */}
                <div className="flex justify-center my-2">
                  {uploadedQrisPreview || !qrisImgFailed ? (
                    <div className="p-2.5 rounded-2xl bg-white border border-[#EAE2D6] shadow-inner">
                      <img
                        src={uploadedQrisPreview || '/qris-saya.png'}
                        alt="QRIS Pembayaran Kala Kopi"
                        onError={() => setQrisImgFailed(true)}
                        className="w-48 h-48 object-contain rounded-xl mx-auto"
                      />
                    </div>
                  ) : (
                    <QRCodeSVG
                      value={`00020101021226580014ID.CO.QRIS.WWW-KALAKOPI-${currentOrder.id}-${currentOrder.total}`}
                      size={196}
                      showCenterBadge={true}
                    />
                  )}
                </div>

                {/* Badge Keterangan Mode Demo Portofolio */}
                <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-[10px] font-semibold text-amber-800">
                  <Info className="w-3 h-3 shrink-0 text-amber-600" />
                  <span>Mode Demo Portofolio — Mohon tidak melakukan transfer dana sungguhan</span>
                </div>

                {/* Nominal Total + Tombol Salin Nominal */}
                <div className="mt-3.5 pt-3 border-t border-dashed border-[#EAE2D6]">
                  <p className="text-[11px] text-[#7A6A60]">Total Nominal Pembayaran</p>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <p className="text-2xl font-extrabold text-[#4A2C2A]">
                      {formatRupiah(currentOrder.total)}
                    </p>
                    <button
                      type="button"
                      onClick={handleCopyNominal}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF7F2] hover:bg-[#EFE6D8] border border-[#EAE2D6] text-[11px] font-bold text-[#4A2C2A] transition-colors cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      Salin Nominal
                    </button>
                  </div>
                </div>

                {/* Tombol Simpan Gambar QRIS & Pratinjau Upload QRIS M-Banking */}
                <div className="grid grid-cols-1 gap-2 mt-4">
                  <button
                    type="button"
                    onClick={handleSaveQrisImage}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#FAF7F2] hover:bg-[#F1E9DC] text-[#1C1917] border border-[#EAE2D6] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-[#4A2C2A]" />
                    Simpan Gambar QRIS
                  </button>

                  <input
                    ref={qrisFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePreviewQrisUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => qrisFileInputRef.current?.click()}
                    className="w-full py-2 px-3 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#5C4D44] border border-dashed border-[#D6C7B2] text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#C86D51]" />
                    <span>
                      {uploadedQrisPreview
                        ? 'Ganti Foto QRIS M-Banking'
                        : 'Pratinjau Upload QRIS M-Banking'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Tombol Konfirmasi / Simulasi Pembayaran Berhasil */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-200 space-y-2">
                <p className="text-[11px] text-emerald-900 text-center">
                  Klik tombol di bawah untuk mengonfirmasi pembayaran & meneruskan pesanan ke dapur:
                </p>
                <button
                  onClick={() => {
                    onConfirmQrisPayment(currentOrder.id);
                    setScreen('tracking');
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Konfirmasi / Simulasi Pembayaran Berhasil
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* LAYAR 3B: PEMBAYARAN CASH (BAYAR DI KASIR)                       */}
        {/* ================================================================ */}
        {screen === 'payment_cash' && currentOrder && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="px-4 py-3.5 bg-white border-b border-[#EAE2D6] flex items-center justify-between shrink-0">
              <button
                onClick={() => setScreen('menu')}
                className="flex items-center gap-1 text-xs font-semibold text-[#5C4D44] cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Menu
              </button>
              <span className="font-bold text-sm">Pembayaran Tunai</span>
              <span className="text-xs font-bold text-[#C86D51]">Meja {currentOrder.table}</span>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-[#EAE2D6] shadow-sm text-center">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
                  <Banknote className="w-7 h-7" />
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  Menunggu Pembayaran di Kasir
                </span>

                <p className="text-xs text-[#7A6A60] mt-4">Nomor Antrean / Kode Pesanan</p>
                <div className="my-2 py-3 px-4 rounded-2xl bg-[#FAF7F2] border-2 border-dashed border-[#C86D51]">
                  <span className="text-3xl font-black tracking-wider text-[#1C1917]">
                    #{currentOrder.id}
                  </span>
                </div>

                <p className="text-xs text-[#5C4D44] leading-relaxed mt-3">
                  Silakan menuju meja kasir dan tunjukkan layar ini untuk melakukan pembayaran tunai
                  sebesar:
                </p>
                <p className="text-2xl font-extrabold text-[#4A2C2A] mt-1">
                  {formatRupiah(currentOrder.total)}
                </p>
              </div>

              {/* Tombol Pintas Uji Coba di Kasir */}
              <div className="p-4 rounded-2xl bg-[#1C1917] text-[#FAF7F2] space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#E8A994]">
                  <Monitor className="w-4 h-4" />
                  <span>Uji Alur Kasir Real-Time</span>
                </div>
                <p className="text-[11px] text-[#D6C7B2] leading-relaxed">
                  Pesanan <strong>#{currentOrder.id}</strong> sudah masuk ke tab{' '}
                  <em>"Menunggu Bayar"</em> di Dashboard Kasir. Klik tombol di bawah untuk
                  mengonfirmasinya sebagai kasir:
                </p>
                <button
                  onClick={() => onJumpToAdminCashier(currentOrder.id)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#C86D51] hover:bg-[#B55E43] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  Buka Kasir untuk Konfirmasi Tunai
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setScreen('tracking')}
                className="w-full py-2.5 px-4 rounded-xl bg-white border border-[#EAE2D6] text-xs font-semibold text-[#5C4D44] hover:bg-[#F3ECE1] cursor-pointer"
              >
                Lihat Halaman Pelacakan Pesanan
              </button>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* LAYAR 4: PELACAKAN STATUS PESANAN (LIVE ORDER TRACKING)          */}
        {/* ================================================================ */}
        {screen === 'tracking' && currentOrder && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="px-4 py-3.5 bg-white border-b border-[#EAE2D6] flex items-center justify-between shrink-0">
              <button
                onClick={() => setScreen('menu')}
                className="flex items-center gap-1 text-xs font-semibold text-[#5C4D44] cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Menu
              </button>
              <span className="font-bold text-sm">Status Pesanan</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#4A2C2A] border border-[#EAE2D6]">
                #{currentOrder.id}
              </span>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="bg-white rounded-3xl p-5 border border-[#EAE2D6] shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[11px] text-[#7A6A60]">Meja {currentOrder.table}</span>
                    <h3 className="font-bold text-base text-[#1C1917]">
                      {currentOrder.status === 'waiting_payment' && 'Menunggu Pembayaran'}
                      {currentOrder.status === 'preparing' && 'Pesanan Sedang Disiapkan'}
                      {currentOrder.status === 'ready' && 'Pesanan Siap Diantar!'}
                    </h3>
                  </div>
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                      currentOrder.status === 'ready'
                        ? 'bg-emerald-100 text-emerald-700'
                        : currentOrder.status === 'preparing'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-[#FAF7F2] text-[#C86D51]'
                    }`}
                  >
                    {currentOrder.status === 'ready' ? (
                      <PackageCheck className="w-6 h-6" />
                    ) : currentOrder.status === 'preparing' ? (
                      <ChefHat className="w-6 h-6" />
                    ) : (
                      <Clock className="w-6 h-6" />
                    )}
                  </div>
                </div>

                {/* Stepper Visual 3 Tahap */}
                <div className="space-y-4 relative before:content-[''] before:absolute before:left-[15px] before:top-3 before:bottom-3 before:w-0.5 before:bg-[#EAE2D6]">
                  <div className="relative flex items-start gap-3.5">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center z-10 shrink-0 ${
                        currentOrder.paymentStatus === 'paid'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#C86D51] text-white ring-4 ring-[#C86D51]/20'
                      }`}
                    >
                      {currentOrder.paymentStatus === 'paid' ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <span className="text-xs font-bold">1</span>
                      )}
                    </div>
                    <div className="pt-1">
                      <p className="text-xs font-bold text-[#1C1917]">Menunggu Pembayaran</p>
                      <p className="text-[11px] text-[#7A6A60]">
                        {currentOrder.paymentStatus === 'paid'
                          ? `Lunas via ${currentOrder.paymentMethod}`
                          : `Silakan selesaikan pembayaran ${currentOrder.paymentMethod}`}
                      </p>
                    </div>
                  </div>

                  <div className="relative flex items-start gap-3.5">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center z-10 shrink-0 ${
                        currentOrder.status === 'ready'
                          ? 'bg-emerald-600 text-white'
                          : currentOrder.status === 'preparing'
                          ? 'bg-[#4A2C2A] text-white ring-4 ring-[#4A2C2A]/20'
                          : 'bg-[#EAE2D6] text-[#8C7B70]'
                      }`}
                    >
                      {currentOrder.status === 'ready' ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <span className="text-xs font-bold">2</span>
                      )}
                    </div>
                    <div className="pt-1">
                      <p
                        className={`text-xs font-bold ${
                          currentOrder.status === 'waiting_payment'
                            ? 'text-[#8C7B70]'
                            : 'text-[#1C1917]'
                        }`}
                      >
                        Diproses Dapur
                      </p>
                      <p className="text-[11px] text-[#7A6A60]">
                        Barista & chef kami sedang meracik pesananmu
                      </p>
                    </div>
                  </div>

                  <div className="relative flex items-start gap-3.5">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center z-10 shrink-0 ${
                        currentOrder.status === 'ready'
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/25'
                          : 'bg-[#EAE2D6] text-[#8C7B70]'
                      }`}
                    >
                      {currentOrder.status === 'ready' ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <span className="text-xs font-bold">3</span>
                      )}
                    </div>
                    <div className="pt-1">
                      <p
                        className={`text-xs font-bold ${
                          currentOrder.status === 'ready' ? 'text-emerald-700' : 'text-[#8C7B70]'
                        }`}
                      >
                        Siap Diantar ke Meja {currentOrder.table}
                      </p>
                      <p className="text-[11px] text-[#7A6A60]">
                        Pramusaji akan segera mengantarkan hidangan ke mejamu
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ringkasan Item Pesanan */}
              <div className="bg-white rounded-2xl p-4 border border-[#EAE2D6] space-y-2.5">
                <h4 className="text-xs font-bold text-[#1C1917]">Rincian Pesanan</h4>
                {currentOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between text-xs py-1.5 border-b last:border-b-0 border-[#F3ECE1]"
                  >
                    <div>
                      <span className="font-semibold">
                        {item.quantity}x {item.name}
                      </span>
                      <p className="text-[11px] text-[#7A6A60]">{item.summary}</p>
                    </div>
                    <span className="font-semibold text-[#4A2C2A]">
                      {formatRupiah(item.totalPrice)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between text-xs font-extrabold pt-2 border-t border-dashed border-[#EAE2D6]">
                  <span>Total ({currentOrder.paymentMethod})</span>
                  <span className="text-[#4A2C2A]">{formatRupiah(currentOrder.total)}</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => setReceiptOrder(currentOrder)}
                  className="w-full py-3 px-4 rounded-2xl bg-[#4A2C2A] hover:bg-[#38201E] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Receipt className="w-4 h-4" />
                  Lihat & Simpan Struk Digital (e-Receipt)
                </button>
                <button
                  onClick={() => setScreen('menu')}
                  className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-[#F3ECE1] text-[#1C1917] border border-[#EAE2D6] font-semibold text-xs cursor-pointer"
                >
                  Pesan Menu Tambahan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* BOTTOM-SHEET MODAL KUSTOMISASI MENU                              */}
        {/* ================================================================ */}
        {customizingItem && (
          <div className="absolute inset-0 z-40 bg-black/50 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150">
            <div className="bg-white rounded-t-3xl max-h-[88%] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
              <div className="relative h-40 w-full shrink-0 bg-[#EFE6D8]">
                <SafeImage
                  src={customizingItem.image}
                  alt={customizingItem.name}
                  category={customizingItem.category}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setCustomizingItem(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-base text-[#1C1917]">{customizingItem.name}</h3>
                    <span className="font-bold text-sm text-[#4A2C2A] shrink-0">
                      {formatRupiah(customizingItem.price)}
                    </span>
                  </div>
                  <p className="text-xs text-[#7A6A60] mt-1">{customizingItem.description}</p>
                </div>

                {customizingItem.type === 'drink' ? (
                  <>
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-[#1C1917]">Penyajian</span>
                      <div className="grid grid-cols-2 gap-2">
                        {DRINK_CUSTOMIZATIONS.temperatures.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setTempOption(opt.id)}
                            className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                              tempOption === opt.id
                                ? 'bg-[#4A2C2A] text-white border-[#4A2C2A]'
                                : 'bg-[#FAF7F2] text-[#5C4D44] border-[#EAE2D6]'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold text-[#1C1917]">Ukuran</span>
                      <div className="grid grid-cols-2 gap-2">
                        {DRINK_CUSTOMIZATIONS.sizes.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setSizeOption(opt.id)}
                            className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-between transition-all cursor-pointer ${
                              sizeOption === opt.id
                                ? 'bg-[#4A2C2A] text-white border-[#4A2C2A]'
                                : 'bg-[#FAF7F2] text-[#5C4D44] border-[#EAE2D6]'
                            }`}
                          >
                            <span>{opt.label}</span>
                            {opt.price > 0 && (
                              <span className="text-[10px] opacity-90">
                                +{formatRupiah(opt.price)}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold text-[#1C1917]">Level Gula</span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {DRINK_CUSTOMIZATIONS.sugarLevels.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setSugarOption(opt.id)}
                            className={`py-2 px-2 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                              sugarOption === opt.id
                                ? 'bg-[#4A2C2A] text-white border-[#4A2C2A]'
                                : 'bg-[#FAF7F2] text-[#5C4D44] border-[#EAE2D6]'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold text-[#1C1917]">
                        Tambahan Topping / Add-ons
                      </span>
                      <div className="space-y-1.5">
                        {DRINK_CUSTOMIZATIONS.addons.map((addon) => {
                          const checked = selectedAddons.includes(addon.id);
                          return (
                            <button
                              key={addon.id}
                              type="button"
                              onClick={() => toggleAddon(addon.id)}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-xs transition-all cursor-pointer ${
                                checked
                                  ? 'border-[#C86D51] bg-[#FAF7F2] font-semibold text-[#1C1917]'
                                  : 'border-[#EAE2D6] text-[#5C4D44]'
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <span
                                  className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                                    checked
                                      ? 'bg-[#C86D51] border-[#C86D51] text-white'
                                      : 'border-[#B5A69B]'
                                  }`}
                                >
                                  {checked && <Check className="w-3 h-3" />}
                                </span>
                                {addon.label}
                              </span>
                              <span className="text-[#4A2C2A] font-semibold">
                                +{formatRupiah(addon.price)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-[#1C1917]">Level Pedas</span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {FOOD_CUSTOMIZATIONS.spiceLevels.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setSpiceOption(opt.id)}
                            className={`py-2 px-2 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                              spiceOption === opt.id
                                ? 'bg-[#C86D51] text-white border-[#C86D51]'
                                : 'bg-[#FAF7F2] text-[#5C4D44] border-[#EAE2D6]'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold text-[#1C1917]">Tambahan Lauk / Topping</span>
                      <div className="space-y-1.5">
                        {FOOD_CUSTOMIZATIONS.addons.map((addon) => {
                          const checked = selectedAddons.includes(addon.id);
                          return (
                            <button
                              key={addon.id}
                              type="button"
                              onClick={() => toggleAddon(addon.id)}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-xs transition-all cursor-pointer ${
                                checked
                                  ? 'border-[#C86D51] bg-[#FAF7F2] font-semibold text-[#1C1917]'
                                  : 'border-[#EAE2D6] text-[#5C4D44]'
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <span
                                  className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                                    checked
                                      ? 'bg-[#C86D51] border-[#C86D51] text-white'
                                      : 'border-[#B5A69B]'
                                  }`}
                                >
                                  {checked && <Check className="w-3 h-3" />}
                                </span>
                                {addon.label}
                              </span>
                              <span className="text-[#4A2C2A] font-semibold">
                                +{formatRupiah(addon.price)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1C1917]">
                    Catatan Khusus <span className="font-normal text-[#8C7B70]">(Opsional)</span>
                  </label>
                  <input
                    type="text"
                    value={itemNote}
                    onChange={(e) => setItemNote(e.target.value)}
                    placeholder="Contoh: Es batu dipisah, sedikit saus..."
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#EAE2D6] text-xs focus:outline-none focus:border-[#4A2C2A]"
                  />
                </div>
              </div>

              <div className="p-4 bg-white border-t border-[#EAE2D6] flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-2.5 bg-[#FAF7F2] px-2.5 py-2 rounded-xl border border-[#EAE2D6]">
                  <button
                    type="button"
                    onClick={() => setItemQty((q) => Math.max(1, q - 1))}
                    className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#1C1917] shadow-2xs cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-bold w-5 text-center">{itemQty}</span>
                  <button
                    type="button"
                    onClick={() => setItemQty((q) => q + 1)}
                    className="w-7 h-7 rounded-lg bg-[#4A2C2A] text-white flex items-center justify-center shadow-2xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#4A2C2A] hover:bg-[#38201E] text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  Tambah • {formatRupiah(customizedUnitPrice * itemQty)}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Struk Digital */}
        <ReceiptModal
          order={receiptOrder}
          onClose={() => setReceiptOrder(null)}
          onDownloadToast={showToast}
        />
      </div>
    </div>
  );
};

// ============================================================================
// 5B. LAYAR KUNCI PIN KASIR (ROLE-BASED ACCESS CONTROL)
// ============================================================================

const DEMO_CASHIER_PIN = '1234';

const CashierPinLockScreen: React.FC<{
  onUnlock: () => void;
  onCancel: () => void;
}> = ({ onUnlock, onCancel }) => {
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const triggerError = (msg: string) => {
    setErrorMsg(msg);
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
      setPin('');
    }, 450);
  };

  const handleDigitPress = (digit: string) => {
    if (pin.length >= 4) return;
    setErrorMsg('');
    const nextPin = pin + digit;
    setPin(nextPin);

    if (nextPin.length === 4) {
      if (nextPin === DEMO_CASHIER_PIN) {
        setTimeout(() => onUnlock(), 150);
      } else {
        triggerError('PIN salah. Gunakan PIN demo 1234.');
      }
    }
  };

  const handleBackspace = () => {
    setErrorMsg('');
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setErrorMsg('');
    setPin('');
  };

  const handleAutoFillDemo = () => {
    setErrorMsg('');
    setPin(DEMO_CASHIER_PIN);
    setTimeout(() => onUnlock(), 220);
  };

  // Dukungan input angka dari keyboard fisik laptop/desktop
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleDigitPress(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 sm:p-7 border border-[#EAE2D6] shadow-xl text-center">
        {/* Ikon Gembok Keamanan */}
        <div className="w-14 h-14 rounded-2xl bg-[#4A2C2A] text-[#FAF7F2] flex items-center justify-center mx-auto mb-4 shadow-md">
          <Lock className="w-6 h-6 text-[#E8A994]" />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#EAE2D6] text-[11px] font-bold text-[#4A2C2A] mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C86D51]" />
          Role-Based Access Control
        </span>

        <h2 className="text-lg font-extrabold text-[#1C1917]">Login PIN Kasir & Admin</h2>
        <p className="text-xs text-[#7A6A60] mt-1 leading-relaxed">
          Area khusus staf kasir & manajer kafe. Masukkan 4 digit PIN otorisasi untuk melanjutkan.
        </p>

        {/* Indikator 4 Digit PIN */}
        <div
          className={`flex items-center justify-center gap-3 my-5 transition-transform ${
            isShaking ? 'animate-bounce' : ''
          }`}
        >
          {[0, 1, 2, 3].map((idx) => {
            const filled = idx < pin.length;
            return (
              <div
                key={idx}
                className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center text-lg font-black transition-all ${
                  errorMsg
                    ? 'border-red-400 bg-red-50 text-red-600'
                    : filled
                    ? 'border-[#4A2C2A] bg-[#FAF7F2] text-[#1C1917] scale-105'
                    : 'border-[#EAE2D6] bg-[#FAF7F2]/60 text-[#B5A69B]'
                }`}
              >
                {filled ? '•' : ''}
              </div>
            );
          })}
        </div>

        {errorMsg && (
          <p className="text-xs font-semibold text-red-600 mb-3 -mt-2">{errorMsg}</p>
        )}

        {/* Keypad Numerik Interaktif */}
        <div className="grid grid-cols-3 gap-2 max-w-[250px] mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleDigitPress(num)}
              className="h-12 rounded-2xl bg-[#FAF7F2] hover:bg-[#EFE6D8] active:scale-95 border border-[#EAE2D6] text-base font-extrabold text-[#1C1917] transition-all cursor-pointer"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="h-12 rounded-2xl bg-[#FAF7F2] hover:bg-[#EFE6D8] border border-[#EAE2D6] text-xs font-bold text-[#7A6A60] transition-all cursor-pointer"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => handleDigitPress('0')}
            className="h-12 rounded-2xl bg-[#FAF7F2] hover:bg-[#EFE6D8] active:scale-95 border border-[#EAE2D6] text-base font-extrabold text-[#1C1917] transition-all cursor-pointer"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            title="Hapus 1 digit"
            className="h-12 rounded-2xl bg-[#FAF7F2] hover:bg-[#EFE6D8] border border-[#EAE2D6] flex items-center justify-center text-[#5C4D44] transition-all cursor-pointer"
          >
            <Delete className="w-4 h-4" />
          </button>
        </div>

        {/* Keterangan & Tombol Sekali Klik Demo Portofolio */}
        <div className="mt-5 p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/80 space-y-2">
          <p className="text-[11px] text-amber-900 font-medium">
            Demo Portofolio — Masukkan PIN: <strong className="font-mono text-xs">1234</strong>
          </p>
          <button
            type="button"
            onClick={handleAutoFillDemo}
            className="w-full py-2 px-3 rounded-xl bg-[#C86D51] hover:bg-[#B55E43] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5" />
            Isi PIN Demo (1234)
          </button>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="mt-4 w-full py-2 text-xs font-semibold text-[#7A6A60] hover:text-[#1C1917] transition-colors cursor-pointer"
        >
          ← Kembali ke Tampilan Pelanggan
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// 6. DASHBOARD KASIR & ADMIN (OPERASIONAL DESKTOP)
// ============================================================================

const AdminView: React.FC<{
  menuItems: MenuItem[];
  orders: Order[];
  highlightedOrderId: string | null;
  onUpdateOrderStatus: (orderId: string, nextStatus: string, nextPaymentStatus?: string) => void;
  onToggleMenuAvailability: (menuId: string) => void;
  onSaveMenuItem: (mode: 'add' | 'edit', itemData: MenuItem) => void;
  onDeleteMenuItem: (menuId: string) => void;
  onSimulateScanTable: (tableStr: string) => void;
  onLockAdmin: () => void;
  showToast: (msg: string) => void;
}> = ({
  menuItems,
  orders,
  highlightedOrderId,
  onUpdateOrderStatus,
  onToggleMenuAvailability,
  onSaveMenuItem,
  onDeleteMenuItem,
  onSimulateScanTable,
  onLockAdmin,
  showToast,
}) => {
  const [adminTab, setAdminTab] = useState<'orders' | 'menu' | 'qr' | 'sales'>('orders');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('waiting_payment');

  const [menuCategoryFilter, setMenuCategoryFilter] = useState('Semua');
  const [menuSearch, setMenuSearch] = useState('');
  const [editingMenuModal, setEditingMenuModal] = useState<{
    mode: 'add' | 'edit';
    item: MenuItem;
  } | null>(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<MenuItem | null>(null);

  const [qrStartTable, setQrStartTable] = useState<number | string>(1);
  const [qrEndTable, setQrEndTable] = useState<number | string>(12);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (highlightedOrderId) {
      setAdminTab('orders');
      const targetOrder = orders.find((o) => o.id === highlightedOrderId);
      if (targetOrder) {
        setOrderStatusFilter(targetOrder.status);
      }
    }
  }, [highlightedOrderId, orders]);

  const orderCounts = useMemo(() => {
    return {
      waiting_payment: orders.filter((o) => o.status === 'waiting_payment').length,
      preparing: orders.filter((o) => o.status === 'preparing').length,
      ready: orders.filter((o) => o.status === 'ready').length,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) => o.status === orderStatusFilter)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, orderStatusFilter]);

  const filteredAdminMenu = useMemo(() => {
    return menuItems.filter((item) => {
      const catOk = menuCategoryFilter === 'Semua' || item.category === menuCategoryFilter;
      const searchOk = item.name.toLowerCase().includes(menuSearch.toLowerCase());
      return catOk && searchOk;
    });
  }, [menuItems, menuCategoryFilter, menuSearch]);

  const salesMetrics = useMemo(() => {
    const paidOrders = orders.filter((o) => o.paymentStatus === 'paid');
    const qrisOrders = paidOrders.filter((o) => o.paymentMethod === 'QRIS');
    const cashOrders = paidOrders.filter((o) => o.paymentMethod === 'CASH');

    const qrisRevenue = qrisOrders.reduce((s, o) => s + o.total, 0);
    const cashRevenue = cashOrders.reduce((s, o) => s + o.total, 0);
    const totalRevenue = qrisRevenue + cashRevenue;
    const totalTransactions = paidOrders.length;

    const qrisPercent = totalRevenue > 0 ? Math.round((qrisRevenue / totalRevenue) * 100) : 50;
    const cashPercent = totalRevenue > 0 ? 100 - qrisPercent : 50;

    const itemMap: Record<string, { name: string; qty: number; revenue: number }> = {};
    paidOrders.forEach((ord) => {
      ord.items.forEach((it) => {
        if (!itemMap[it.name]) {
          itemMap[it.name] = { name: it.name, qty: 0, revenue: 0 };
        }
        itemMap[it.name].qty += it.quantity;
        itemMap[it.name].revenue += it.totalPrice;
      });
    });

    const topItems = Object.values(itemMap)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    return {
      totalRevenue,
      totalTransactions,
      avgOrderValue: totalTransactions > 0 ? Math.round(totalRevenue / totalTransactions) : 0,
      qrisRevenue,
      cashRevenue,
      qrisPercent,
      cashPercent,
      topItems,
    };
  }, [orders]);

  const handleDownloadTableQR = (tableStr: string) => {
    const urlTarget = `https://kalakopi.id/menu?table=${tableStr}`;
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="420" viewBox="0 0 320 420">
      <rect width="320" height="420" rx="24" fill="#1C1917"/>
      <rect x="16" y="16" width="288" height="388" rx="18" fill="#FAF7F2"/>
      <text x="160" y="58" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="16" fill="#4A2C2A">KALA KOPI &amp; ROASTERY</text>
      <rect x="75" y="78" width="170" height="170" rx="16" fill="#FFFFFF" stroke="#EAE2D6" stroke-width="2"/>
      <text x="160" y="168" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="13" fill="#1C1917">QR MEJA ${tableStr}</text>
      <text x="160" y="295" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="32" fill="#1C1917">MEJA ${tableStr}</text>
      <text x="160" y="328" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="14" fill="#C86D51">Scan untuk Pesan &amp; Bayar</text>
      <text x="160" y="365" text-anchor="middle" font-family="monospace" font-size="10" fill="#7A6A60">${urlTarget}</text>
    </svg>`;
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Kartu-QR-Meja-${tableStr}.svg`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Kartu QR Meja ${tableStr} berhasil diunduh!`);
  };

  const generatedTables = useMemo(() => {
    const start = Math.max(1, Math.min(50, Number(qrStartTable) || 1));
    const end = Math.max(start, Math.min(50, Number(qrEndTable) || start));
    const list: string[] = [];
    for (let i = start; i <= end; i++) {
      list.push(padTableNumber(i));
    }
    return list;
  }, [qrStartTable, qrEndTable]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-56px)]">
      {/* Sidebar Navigasi Kasir & Admin */}
      <aside className="w-full lg:w-64 shrink-0">
        <div className="bg-white rounded-3xl p-4 border border-[#EAE2D6] shadow-xs lg:sticky lg:top-20">
          <div className="flex items-center gap-3 px-2 pb-4 mb-3 border-b border-[#EAE2D6]">
            <div className="w-10 h-10 rounded-2xl bg-[#1C1917] text-[#FAF7F2] flex items-center justify-center">
              <Store className="w-5 h-5 text-[#C86D51]" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-[#1C1917]">POS & Admin</h2>
              <p className="text-[11px] text-[#7A6A60]">Kala Kopi & Roastery</p>
            </div>
          </div>

          <nav className="grid grid-cols-2 lg:grid-cols-1 gap-1.5">
            <button
              onClick={() => setAdminTab('orders')}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                adminTab === 'orders'
                  ? 'bg-[#4A2C2A] text-white shadow-xs'
                  : 'text-[#5C4D44] hover:bg-[#FAF7F2]'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Bell className="w-4 h-4" />
                Live Order Board
              </span>
              {orderCounts.waiting_payment + orderCounts.preparing > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    adminTab === 'orders'
                      ? 'bg-[#C86D51] text-white'
                      : 'bg-[#C86D51]/15 text-[#C86D51]'
                  }`}
                >
                  {orderCounts.waiting_payment + orderCounts.preparing}
                </span>
              )}
            </button>

            <button
              onClick={() => setAdminTab('menu')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                adminTab === 'menu'
                  ? 'bg-[#4A2C2A] text-white shadow-xs'
                  : 'text-[#5C4D44] hover:bg-[#FAF7F2]'
              }`}
            >
              <Utensils className="w-4 h-4" />
              Manajemen Menu & Stok
            </button>

            <button
              onClick={() => setAdminTab('qr')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                adminTab === 'qr'
                  ? 'bg-[#4A2C2A] text-white shadow-xs'
                  : 'text-[#5C4D44] hover:bg-[#FAF7F2]'
              }`}
            >
              <QrCode className="w-4 h-4" />
              Generator QR Meja
            </button>

            <button
              onClick={() => setAdminTab('sales')}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                adminTab === 'sales'
                  ? 'bg-[#4A2C2A] text-white shadow-xs'
                  : 'text-[#5C4D44] hover:bg-[#FAF7F2]'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Ringkasan Penjualan
            </button>
          </nav>

          <div className="mt-4 pt-3 border-t border-[#EAE2D6]">
            <button
              onClick={onLockAdmin}
              className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-2xl bg-[#FAF7F2] hover:bg-red-50 text-[#5C4D44] hover:text-red-700 border border-[#EAE2D6] text-xs font-semibold transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Kunci Akses Kasir</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Konten Utama Dashboard */}
      <section className="flex-1 min-w-0">
        {adminTab === 'orders' && (
          <div className="space-y-5">
            <div>
              <h1 className="text-xl font-extrabold text-[#1C1917]">Live Order Board</h1>
              <p className="text-xs text-[#7A6A60]">
                Pantau pesanan masuk dari QR meja, konfirmasi pembayaran tunai, dan perbarui status
                dapur secara real-time.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2.5 bg-white p-2 rounded-2xl border border-[#EAE2D6]">
              {[
                {
                  id: 'waiting_payment',
                  label: 'Menunggu Bayar',
                  count: orderCounts.waiting_payment,
                  badgeColor: 'bg-amber-100 text-amber-800',
                },
                {
                  id: 'preparing',
                  label: 'Diproses Dapur',
                  count: orderCounts.preparing,
                  badgeColor: 'bg-blue-100 text-blue-800',
                },
                {
                  id: 'ready',
                  label: 'Selesai',
                  count: orderCounts.ready,
                  badgeColor: 'bg-emerald-100 text-emerald-800',
                },
              ].map((tab) => {
                const active = orderStatusFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setOrderStatusFilter(tab.id)}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      active
                        ? 'bg-[#1C1917] text-white shadow-xs'
                        : 'text-[#5C4D44] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        active ? 'bg-[#C86D51] text-white' : tab.badgeColor
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#EAE2D6]">
                <ChefHat className="w-10 h-10 text-[#B5A69B] mx-auto mb-2" />
                <h3 className="font-bold text-sm text-[#1C1917]">Tidak ada pesanan di tab ini</h3>
                <p className="text-xs text-[#7A6A60] mt-1">
                  Pesanan baru dari tampilan pelanggan akan langsung muncul di sini.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredOrders.map((order) => {
                  const isHighlighted = order.id === highlightedOrderId;
                  return (
                    <div
                      key={order.id}
                      className={`bg-white rounded-3xl p-5 border transition-all flex flex-col justify-between ${
                        isHighlighted
                          ? 'border-[#C86D51] ring-2 ring-[#C86D51]/30 shadow-md'
                          : 'border-[#EAE2D6] shadow-xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#EAE2D6]">
                          <div className="flex items-center gap-2.5">
                            <span className="px-3 py-1.5 rounded-xl bg-[#1C1917] text-white font-extrabold text-xs">
                              Meja {order.table}
                            </span>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-sm text-[#1C1917]">
                                  #{order.id}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                    order.paymentMethod === 'QRIS'
                                      ? 'bg-purple-100 text-purple-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {order.paymentMethod}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#7A6A60]">
                                {order.customerName} • {formatTime(order.createdAt)}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => setReceiptOrder(order)}
                            title="Lihat Struk"
                            className="p-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F1E9DC] text-[#4A2C2A] cursor-pointer"
                          >
                            <Receipt className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="py-3 space-y-2.5">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#F1E9DC] text-xs"
                            >
                              <div className="flex justify-between font-bold text-[#1C1917]">
                                <span>
                                  {item.quantity}x {item.name}
                                </span>
                                <span>{formatRupiah(item.totalPrice)}</span>
                              </div>
                              <p className="text-[11px] text-[#7A6A60] mt-0.5">{item.summary}</p>
                              {item.note && (
                                <p className="text-[11px] font-semibold text-[#C86D51] mt-1">
                                  Catatan: "{item.note}"
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#EAE2D6] space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#7A6A60]">Total (+PB1 10%)</span>
                          <span className="text-base font-extrabold text-[#4A2C2A]">
                            {formatRupiah(order.total)}
                          </span>
                        </div>

                        {order.status === 'waiting_payment' && (
                          <button
                            onClick={() => {
                              onUpdateOrderStatus(order.id, 'preparing', 'paid');
                              setOrderStatusFilter('preparing');
                            }}
                            className="w-full py-2.5 px-4 rounded-xl bg-[#C86D51] hover:bg-[#B55E43] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                          >
                            <Banknote className="w-4 h-4" />
                            Konfirmasi Pembayaran Tunai
                          </button>
                        )}

                        {order.status === 'preparing' && (
                          <button
                            onClick={() => {
                              onUpdateOrderStatus(order.id, 'ready', 'paid');
                              setOrderStatusFilter('ready');
                            }}
                            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Tandai Selesai & Siap Antar
                          </button>
                        )}

                        {order.status === 'ready' && (
                          <div className="w-full py-2 px-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center justify-center gap-1.5">
                            <PackageCheck className="w-4 h-4" />
                            Selesai • Siap Diantar ke Meja {order.table}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {adminTab === 'menu' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-extrabold text-[#1C1917]">Manajemen Menu & Stok</h1>
                <p className="text-xs text-[#7A6A60]">
                  Ubah status ketersediaan stok secara instan atau tambah/edit daftar menu kafe.
                </p>
              </div>

              <button
                onClick={() =>
                  setEditingMenuModal({
                    mode: 'add',
                    item: {
                      id: '',
                      name: '',
                      category: 'Kopi',
                      type: 'drink',
                      price: 25000,
                      description: '',
                      image:
                        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
                      bestSeller: false,
                      available: true,
                    },
                  })
                }
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#4A2C2A] hover:bg-[#38201E] text-white text-xs font-bold shadow-xs cursor-pointer self-start"
              >
                <Plus className="w-4 h-4" />
                Tambah Menu Baru
              </button>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-[#EAE2D6] flex flex-col sm:flex-row gap-3 justify-between">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setMenuCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer ${
                      menuCategoryFilter === cat
                        ? 'bg-[#1C1917] text-white'
                        : 'bg-[#FAF7F2] text-[#5C4D44] hover:bg-[#EFE6D8]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="relative sm:w-56">
                <Search className="w-3.5 h-3.5 text-[#8C7B70] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  placeholder="Cari nama menu..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D6] text-xs focus:outline-none focus:border-[#4A2C2A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredAdminMenu.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-3.5 border border-[#EAE2D6] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <SafeImage
                      src={item.image}
                      alt={item.name}
                      category={item.category}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#FAF7F2] text-[#4A2C2A]">
                          {item.category}
                        </span>
                        {item.bestSeller && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#C86D51]/15 text-[#C86D51]">
                            Best Seller
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm text-[#1C1917] truncate mt-1">
                        {item.name}
                      </h3>
                      <p className="text-xs font-bold text-[#4A2C2A]">
                        {formatRupiah(item.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onToggleMenuAvailability(item.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
                        item.available
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          item.available ? 'bg-emerald-600' : 'bg-red-600'
                        }`}
                      />
                      {item.available ? 'Tersedia' : 'Habis'}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingMenuModal({ mode: 'edit', item: { ...item } })}
                        className="p-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#EFE6D8] text-[#5C4D44] cursor-pointer"
                        title="Edit Menu"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmItem(item)}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                        title="Hapus Menu"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {adminTab === 'qr' && (
          <div className="space-y-5">
            <div className="bg-white rounded-3xl p-5 border border-[#EAE2D6] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-extrabold text-[#1C1917]">Generator QR Code Meja</h1>
                <p className="text-xs text-[#7A6A60] mt-0.5">
                  Buat kartu QR Code siap cetak untuk ditempel di setiap meja pelanggan.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex items-center gap-2 bg-[#FAF7F2] px-3 py-2 rounded-xl border border-[#EAE2D6] text-xs">
                  <span className="text-[#7A6A60] font-medium">Meja</span>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={qrStartTable}
                    onChange={(e) => setQrStartTable(e.target.value)}
                    className="w-12 px-2 py-1 rounded-lg bg-white border border-[#EAE2D6] font-bold text-center"
                  />
                  <span className="text-[#7A6A60]">s/d</span>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={qrEndTable}
                    onChange={(e) => setQrEndTable(e.target.value)}
                    className="w-12 px-2 py-1 rounded-lg bg-white border border-[#EAE2D6] font-bold text-center"
                  />
                </div>

                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#1C1917] hover:bg-[#322D2A] text-white text-xs font-bold cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  Cetak Semua Kartu
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {generatedTables.map((tableStr) => {
                const tableUrl = `https://kalakopi.id/menu?table=${tableStr}`;
                return (
                  <div
                    key={tableStr}
                    className="bg-white rounded-3xl p-4 border-2 border-[#EAE2D6] shadow-xs flex flex-col items-center text-center hover:border-[#4A2C2A] transition-all"
                  >
                    <div className="flex items-center gap-1.5 text-[#4A2C2A] font-bold text-xs mb-3">
                      <Coffee className="w-3.5 h-3.5" />
                      <span>KALA KOPI</span>
                    </div>

                    <QRCodeSVG value={tableUrl} size={140} showCenterBadge={true} />

                    <div className="mt-3">
                      <h3 className="text-lg font-black tracking-wide text-[#1C1917]">
                        MEJA {tableStr}
                      </h3>
                      <p className="text-xs font-bold text-[#C86D51]">Scan untuk Pesan & Bayar</p>
                      <p className="text-[10px] font-mono text-[#8C7B70] mt-1 truncate max-w-[180px]">
                        /menu?table={tableStr}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 w-full mt-4 pt-3 border-t border-[#EAE2D6]">
                      <button
                        onClick={() => handleDownloadTableQR(tableStr)}
                        className="py-2 px-2 rounded-xl bg-[#FAF7F2] hover:bg-[#EFE6D8] text-[#1C1917] text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        Unduh
                      </button>
                      <button
                        onClick={() => onSimulateScanTable(tableStr)}
                        className="py-2 px-2 rounded-xl bg-[#4A2C2A] hover:bg-[#38201E] text-white text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Smartphone className="w-3 h-3" />
                        Tes Scan
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {adminTab === 'sales' && (
          <div className="space-y-5">
            <div>
              <h1 className="text-xl font-extrabold text-[#1C1917]">Ringkasan Penjualan Hari Ini</h1>
              <p className="text-xs text-[#7A6A60]">
                Data diperbarui secara otomatis setiap kali pembayaran QRIS atau Cash terkonfirmasi.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-3xl p-5 border border-[#EAE2D6]">
                <p className="text-xs font-medium text-[#7A6A60]">Total Omzet Lunas</p>
                <p className="text-2xl font-extrabold text-[#4A2C2A] mt-1">
                  {formatRupiah(salesMetrics.totalRevenue)}
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Termasuk PB1 10%
                </span>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-[#EAE2D6]">
                <p className="text-xs font-medium text-[#7A6A60]">Transaksi Berhasil</p>
                <p className="text-2xl font-extrabold text-[#1C1917] mt-1">
                  {salesMetrics.totalTransactions} Pesanan
                </p>
                <span className="inline-block text-[11px] text-[#7A6A60] mt-2">
                  {orderCounts.waiting_payment} menunggu bayar di kasir
                </span>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-[#EAE2D6]">
                <p className="text-xs font-medium text-[#7A6A60]">Rata-rata Nilai Pesanan</p>
                <p className="text-2xl font-extrabold text-[#C86D51] mt-1">
                  {formatRupiah(salesMetrics.avgOrderValue)}
                </p>
                <span className="inline-block text-[11px] text-[#7A6A60] mt-2">
                  Per transaksi meja
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-3xl p-5 border border-[#EAE2D6] space-y-4">
                <h3 className="font-bold text-sm text-[#1C1917]">
                  Perbandingan Metode Pembayaran
                </h3>

                <div className="h-4 w-full rounded-full bg-[#FAF7F2] overflow-hidden flex border border-[#EAE2D6]">
                  <div
                    style={{ width: `${salesMetrics.qrisPercent}%` }}
                    className="bg-[#4A2C2A] transition-all duration-500"
                  />
                  <div
                    style={{ width: `${salesMetrics.cashPercent}%` }}
                    className="bg-[#C86D51] transition-all duration-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D6]">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#4A2C2A]">
                      <QrCode className="w-4 h-4" />
                      <span>QRIS ({salesMetrics.qrisPercent}%)</span>
                    </div>
                    <p className="text-base font-extrabold text-[#1C1917] mt-1">
                      {formatRupiah(salesMetrics.qrisRevenue)}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE2D6]">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#C86D51]">
                      <Banknote className="w-4 h-4" />
                      <span>Cash ({salesMetrics.cashPercent}%)</span>
                    </div>
                    <p className="text-base font-extrabold text-[#1C1917] mt-1">
                      {formatRupiah(salesMetrics.cashRevenue)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-[#EAE2D6] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#1C1917]">5 Menu Terlaris Hari Ini</h3>
                  <Award className="w-4 h-4 text-[#C86D51]" />
                </div>

                <div className="space-y-2.5">
                  {salesMetrics.topItems.map((item, index) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between p-2.5 rounded-2xl bg-[#FAF7F2] border border-[#F1E9DC]"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`w-6 h-6 rounded-lg text-xs font-extrabold flex items-center justify-center shrink-0 ${
                            index === 0
                              ? 'bg-[#C86D51] text-white'
                              : 'bg-white text-[#4A2C2A] border border-[#EAE2D6]'
                          }`}
                        >
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#1C1917] truncate">{item.name}</p>
                          <p className="text-[11px] text-[#7A6A60]">{item.qty} porsi terjual</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#4A2C2A] shrink-0">
                        {formatRupiah(item.revenue)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Modal Tambah / Edit Menu */}
      {editingMenuModal && (
        <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSaveMenuItem(editingMenuModal.mode, editingMenuModal.item);
              setEditingMenuModal(null);
            }}
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#EAE2D6] space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#1C1917]">
                {editingMenuModal.mode === 'add' ? 'Tambah Menu Baru' : 'Edit Item Menu'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingMenuModal(null)}
                className="p-1.5 rounded-full hover:bg-[#FAF7F2]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Nama Menu</label>
                <input
                  required
                  type="text"
                  value={editingMenuModal.item.name}
                  onChange={(e) =>
                    setEditingMenuModal({
                      ...editingMenuModal,
                      item: { ...editingMenuModal.item, name: e.target.value },
                    })
                  }
                  placeholder="Contoh: Es Kopi Pandan Latte"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D6]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Kategori</label>
                  <select
                    value={editingMenuModal.item.category}
                    onChange={(e) => {
                      const cat = e.target.value;
                      const inferredType =
                        cat === 'Makanan Berat' || cat === 'Camilan & Pastry' ? 'food' : 'drink';
                      setEditingMenuModal({
                        ...editingMenuModal,
                        item: { ...editingMenuModal.item, category: cat, type: inferredType },
                      });
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D6]"
                  >
                    {CATEGORIES.filter((c) => c !== 'Semua').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Harga (Rp)</label>
                  <input
                    required
                    type="number"
                    min="1000"
                    step="500"
                    value={editingMenuModal.item.price}
                    onChange={(e) =>
                      setEditingMenuModal({
                        ...editingMenuModal,
                        item: { ...editingMenuModal.item, price: Number(e.target.value) },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE2D6]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Deskripsi Singkat</label>
                <textarea
                  rows={2}
                  value={editingMenuModal.item.description}
                  onChange={(e) =>
                    setEditingMenuModal({
                      ...editingMenuModal,
                      item: { ...editingMenuModal.item, description: e.target.value },
                    })
                  }
                  placeholder="Jelaskan komposisi dan cita rasa menu..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#EAE2D6]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">URL Foto Menu</label>
                <input
                  type="text"
                  value={editingMenuModal.item.image}
                  onChange={(e) =>
                    setEditingMenuModal({
                      ...editingMenuModal,
                      item: { ...editingMenuModal.item, image: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#EAE2D6]"
                />
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingMenuModal.item.bestSeller}
                  onChange={(e) =>
                    setEditingMenuModal({
                      ...editingMenuModal,
                      item: { ...editingMenuModal.item, bestSeller: e.target.checked },
                    })
                  }
                  className="rounded accent-[#C86D51]"
                />
                <span className="font-semibold">Tandai sebagai "Best Seller"</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingMenuModal(null)}
                className="px-4 py-2.5 rounded-xl bg-[#FAF7F2] text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#4A2C2A] hover:bg-[#38201E] text-white text-xs font-bold cursor-pointer"
              >
                Simpan Menu
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Menu */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-white rounded-3xl p-5 shadow-2xl border border-[#EAE2D6] text-center space-y-3">
            <div className="w-11 h-11 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#1C1917]">Hapus Item Menu?</h3>
            <p className="text-xs text-[#7A6A60]">
              Menu <strong>{deleteConfirmItem.name}</strong> akan dihapus dari daftar pelanggan.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmItem(null)}
                className="py-2.5 rounded-xl bg-[#FAF7F2] text-xs font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onDeleteMenuItem(deleteConfirmItem.id);
                  setDeleteConfirmItem(null);
                }}
                className="py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Struk Digital di Dashboard */}
      <ReceiptModal
        order={receiptOrder}
        onClose={() => setReceiptOrder(null)}
        onDownloadToast={showToast}
      />
    </div>
  );
};

// ============================================================================
// 7. KOMPONEN UTAMA APLIKASI (SHARED STATE & TOP DEMO SWITCHER BAR)
// ============================================================================

export default function App() {
  // Mode tampilan aktif: diawali dari 'intro' (Portfolio Showcase Intro)
  const [viewMode, setViewMode] = useState<'intro' | 'customer' | 'admin'>('intro');
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [selectedTable, setSelectedTable] = useState('04');
  const [showGlobalTablePicker, setShowGlobalTablePicker] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [highlightedOrderId, setHighlightedOrderId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 3200);
    return () => clearTimeout(t);
  }, [toastMessage]);

  const activeOrdersBadgeCount = useMemo(
    () => orders.filter((o) => o.status !== 'ready').length,
    [orders]
  );

  const handleCreateOrder = (orderPayload: {
    table: string;
    customerName: string;
    paymentMethod: 'QRIS' | 'CASH';
    items: CartItem[];
    subtotal: number;
    tax: number;
    total: number;
  }): Order => {
    const nextNumber = 101 + orders.length;
    const newOrder: Order = {
      id: `CF-${nextNumber}`,
      table: orderPayload.table,
      customerName: orderPayload.customerName,
      paymentMethod: orderPayload.paymentMethod,
      paymentStatus: 'unpaid',
      status: 'waiting_payment',
      createdAt: new Date().toISOString(),
      items: orderPayload.items,
      subtotal: orderPayload.subtotal,
      tax: orderPayload.tax,
      total: orderPayload.total,
    };

    setOrders((prev) => [newOrder, ...prev]);
    showToast(`Pesanan #${newOrder.id} (Meja ${newOrder.table}) berhasil dibuat!`);
    return newOrder;
  };

  const handleConfirmQrisPayment = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, paymentStatus: 'paid', status: 'preparing' } : o
      )
    );
    showToast(`Pembayaran QRIS #${orderId} berhasil! Pesanan diteruskan ke dapur.`);
  };

  const handleUpdateOrderStatus = (
    orderId: string,
    nextStatus: string,
    nextPaymentStatus?: string
  ) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: nextStatus,
              paymentStatus: nextPaymentStatus || o.paymentStatus,
            }
          : o
      )
    );
    if (nextStatus === 'preparing') {
      showToast(`Pembayaran tunai #${orderId} dikonfirmasi! Pesanan diproses dapur.`);
    } else if (nextStatus === 'ready') {
      showToast(`Pesanan #${orderId} selesai & siap diantar ke meja!`);
    }
  };

  const handleToggleMenuAvailability = (menuId: string) => {
    setMenuItems((prev) =>
      prev.map((m) => (m.id === menuId ? { ...m, available: !m.available } : m))
    );
    showToast('Status stok menu diperbarui secara real-time');
  };

  const handleSaveMenuItem = (mode: 'add' | 'edit', itemData: MenuItem) => {
    if (mode === 'add') {
      const newItem: MenuItem = { ...itemData, id: `m-${Date.now()}` };
      setMenuItems((prev) => [newItem, ...prev]);
      showToast(`Menu "${newItem.name}" berhasil ditambahkan!`);
    } else {
      setMenuItems((prev) => prev.map((m) => (m.id === itemData.id ? itemData : m)));
      showToast(`Menu "${itemData.name}" berhasil diperbarui!`);
    }
  };

  const handleDeleteMenuItem = (menuId: string) => {
    setMenuItems((prev) => prev.filter((m) => m.id !== menuId));
    showToast('Item menu berhasil dihapus');
  };

  const handleJumpToAdminCashier = (orderId: string) => {
    setHighlightedOrderId(orderId);
    setViewMode('admin');
  };

  const handleSimulateScanTable = (tableStr: string) => {
    setSelectedTable(tableStr);
    setViewMode('customer');
    showToast(`Simulasi Scan QR: Selamat datang di Meja ${tableStr}!`);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] font-sans selection:bg-[#C86D51] selection:text-white">
      {/* ================================================================== */}
      {/* TOP DEMO SWITCHER BAR                                              */}
      {/* ================================================================== */}
      <div className="sticky top-0 z-40 bg-[#1C1917] text-[#FAF7F2] border-b border-white/10 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2">
          {/* Identitas Proyek */}
          <button
            onClick={() => setViewMode('intro')}
            className="flex items-center gap-2 min-w-0 text-left cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-lg bg-[#C86D51] flex items-center justify-center shrink-0">
              <QrCode className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:block truncate">
              <span className="font-bold text-xs tracking-wide block leading-none group-hover:text-[#E8A994] transition-colors">
                Kala Kopi QR System
              </span>
              <span className="text-[10px] text-[#D6C7B2]">Interactive Portfolio Demo</span>
            </div>
          </button>

          {/* Tombol Switcher 3 Mode: Info Proyek | Tampilan Pelanggan (HP) | Kasir & Admin */}
          <div className="flex items-center bg-[#12100E] p-1 rounded-xl border border-white/10 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setViewMode('intro')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                viewMode === 'intro'
                  ? 'bg-[#C86D51] text-white shadow-xs'
                  : 'text-[#D6C7B2] hover:text-white'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Info Proyek</span>
            </button>

            <button
              onClick={() => setViewMode('customer')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                viewMode === 'customer'
                  ? 'bg-[#4A2C2A] text-white shadow-xs'
                  : 'text-[#D6C7B2] hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Tampilan Pelanggan (HP)</span>
            </button>

            <button
              onClick={() => {
                setHighlightedOrderId(null);
                setViewMode('admin');
              }}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                viewMode === 'admin'
                  ? 'bg-[#C86D51] text-white shadow-xs'
                  : 'text-[#D6C7B2] hover:text-white'
              }`}
            >
              {isAdminUnlocked ? (
                <Unlock className="w-3.5 h-3.5 text-emerald-300" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-[#E8A994]" />
              )}
              <span>Kasir & Admin</span>
              {activeOrdersBadgeCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-white text-[#1C1917] text-[10px] font-extrabold">
                  {activeOrdersBadgeCount}
                </span>
              )}
            </button>
          </div>

          {/* Indikator URL Simulasi Meja Aktif (Bisa diklik untuk ganti nomor meja) */}
          <button
            onClick={() => setShowGlobalTablePicker(true)}
            title="Klik untuk mengganti nomor meja simulasi"
            className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono bg-white/8 hover:bg-white/15 px-2.5 py-1.5 rounded-lg border border-white/15 text-[#E8A994] transition-colors cursor-pointer shrink-0"
          >
            <MapPin className="w-3 h-3" />
            <span>?table={selectedTable}</span>
          </button>
        </div>
      </div>

      {/* ================================================================== */}
      {/* AREA KONTEN UTAMA                                                  */}
      {/* ================================================================== */}
      {viewMode === 'intro' && (
        <PortfolioIntroView
          selectedTable={selectedTable}
          onStartCustomerDemo={() => setViewMode('customer')}
          onOpenAdminDashboard={() => {
            setHighlightedOrderId(null);
            setViewMode('admin');
          }}
        />
      )}

      {viewMode === 'customer' && (
        <CustomerView
          menuItems={menuItems}
          orders={orders}
          selectedTable={selectedTable}
          onOpenTableModal={() => setShowGlobalTablePicker(true)}
          onCreateOrder={handleCreateOrder}
          onConfirmQrisPayment={handleConfirmQrisPayment}
          onJumpToAdminCashier={handleJumpToAdminCashier}
          showToast={showToast}
        />
      )}

      {viewMode === 'admin' &&
        (!isAdminUnlocked ? (
          <CashierPinLockScreen
            onUnlock={() => {
              setIsAdminUnlocked(true);
              showToast('Otorisasi berhasil! Selamat datang di Dashboard Kasir.');
            }}
            onCancel={() => setViewMode('customer')}
          />
        ) : (
          <AdminView
            menuItems={menuItems}
            orders={orders}
            highlightedOrderId={highlightedOrderId}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onToggleMenuAvailability={handleToggleMenuAvailability}
            onSaveMenuItem={handleSaveMenuItem}
            onDeleteMenuItem={handleDeleteMenuItem}
            onSimulateScanTable={handleSimulateScanTable}
            onLockAdmin={() => {
              setIsAdminUnlocked(false);
              showToast('Dashboard Kasir & Admin telah dikunci kembali.');
            }}
            showToast={showToast}
          />
        ))}

      {/* ================================================================== */}
      {/* MODAL SIMULASI GANTI NOMOR MEJA (?table=XX)                        */}
      {/* ================================================================== */}
      {showGlobalTablePicker && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-white rounded-3xl p-5 shadow-2xl border border-[#EAE2D6]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#C86D51]" />
                <h3 className="font-bold text-sm text-[#1C1917]">Simulasi Scan QR Meja</h3>
              </div>
              <button
                onClick={() => setShowGlobalTablePicker(false)}
                className="p-1 rounded-full hover:bg-[#FAF7F2] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-[#7A6A60] mb-3">
              Pilih nomor meja untuk mensimulasikan parameter URL{' '}
              <code className="px-1.5 py-0.5 rounded bg-[#FAF7F2] text-[#4A2C2A] font-mono">
                ?table={selectedTable}
              </code>
            </p>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 15 }, (_, i) => padTableNumber(i + 1)).map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    setSelectedTable(num);
                    setShowGlobalTablePicker(false);
                    showToast(`Berpindah ke Meja ${num} (?table=${num})`);
                  }}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    selectedTable === num
                      ? 'bg-[#C86D51] text-white border-[#C86D51]'
                      : 'bg-[#FAF7F2] text-[#1C1917] border-[#EAE2D6] hover:border-[#4A2C2A]'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* NOTIFIKASI TOAST INTERAKTIF                                        */}
      {/* ================================================================== */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-xs bg-[#1C1917] text-[#FAF7F2] px-4 py-3 rounded-2xl shadow-2xl border border-white/15 flex items-center gap-2.5 text-xs font-medium animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}