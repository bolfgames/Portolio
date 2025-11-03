# BOLF Games Portfolio Site

Modern, performanslı ve OOP/SOLID prensiplerine uygun kurumsal portföy web sitesi.

## Teknolojiler

- **React 18** + **TypeScript**
- **Vite** (Build tool)
- **Tailwind CSS** (Styling)
- **Framer Motion** (Animations)
- **React Router** (Routing - HashRouter for GitHub Pages)

## Kurulum

```bash
npm install
```

## Geliştirme

```bash
npm run dev
```

## Build

```bash
npm run build
```

Build çıktısı `dist/` klasörüne oluşturulur.

## GitHub Pages Deployment

1. Build alın: `npm run build`
2. `dist/` klasörünün içeriğini GitHub Pages'e deploy edin

## Proje Yapısı

```
src/
├── components/          # UI Bileşenleri
│   ├── common/         # Ortak bileşenler
│   ├── sections/       # Sayfa bölümleri
│   ├── layout/         # Layout bileşenleri
│   └── external/       # External kod wrapper'ları
├── pages/              # Sayfa bileşenleri
├── models/             # TypeScript interfaces
├── services/           # Business logic
├── config/             # JSON config dosyaları
├── assets/             # Görseller, fontlar
└── styles/             # Global CSS
```

## Config Dosyaları

- `src/config/team.json` - Ekip üyeleri bilgileri
- `src/config/projects.json` - Proje bilgileri

## Özellikler

- ✅ OOP/SOLID prensiplerine uygun kod yapısı
- ✅ Responsive tasarım (mobil uyumlu)
- ✅ Performanslı animasyonlar (Framer Motion)
- ✅ Lazy loading ve code splitting
- ✅ GitHub Pages uyumlu routing (HashRouter)
- ✅ TypeScript tip güvenliği
- ✅ Modüler component yapısı

