# KindPNG Image Scraper

A Node.js script to download images from KindPNG.com by category and page number.

## 📦 Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## 🛠 Installation

1. Clone the repository or download the script
2. Install dependencies:

```bash
npm install puppeteer node-image-downloader
```

## 🚀 Usage

bash
node sanic.js <thread> [page]
Arguments
Argument Required Description Example
thread Yes KindPNG category name anime
page No Page number (defaults to 1) 2
Example
bash
node sanic.js cartoon 3
This downloads all images from page 3 of the "cartoon" category.

## 📂 File Structure

Images are saved in:

```bash
./images/
└── threads/
└── thread/
└── page/
├── image1.png
├── image2.png
└── ...
```

## ⚙️ How It Works

Launches a headless browser using Puppeteer

Navigates to the specified KindPNG category page

Automatically scrolls to load all images

Processes image URLs for optimal download

Downloads all images concurrently using node-image-downloader

Saves images in organized directory structure

## 📌 Notes

Respect KindPNG's Terms of Service

Add delays if you encounter rate limiting

Images are saved with their original filenames
