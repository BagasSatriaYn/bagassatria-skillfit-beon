const fs = require('fs');
const path = require('path');

const targetFiles = [
  'src/App.css',
  'src/pages/Dashboard.jsx',
  'src/components/FinancialChart.jsx',
  'src/components/HousesList.jsx',
  'src/components/PaymentsList.jsx',
  'src/components/ResidentsList.jsx',
  'src/components/PaymentForm.jsx',
  'src/components/ExpenseReport.jsx',
  'src/components/PaymentReport.jsx'
];

const colorMap = {
  // Primary Dark (Deep Forest Green)
  '#1A237E': 'var(--color-primary-dark)',
  '#080A22': 'var(--color-primary-dark)',
  '#2e39ae': 'var(--color-primary-dark)', // hover
  '#764ba2': 'var(--color-primary-dark)', // gradient
  '#667eea': 'var(--color-primary-dark)', // gradient

  // Text Main (Dark Slate)
  '#333333': 'var(--color-text-main)',
  '#333': 'var(--color-text-main)',
  '#374151': 'var(--color-text-main)',
  '#1A2421': 'var(--color-text-main)',

  // Bg Body (Soft Mint)
  '#f5f5f5': 'var(--color-bg-body)',
  '#F4F6F9': 'var(--color-bg-body)',
  '#F8F9FA': 'var(--color-bg-body)',
  '#F1F5F9': 'var(--color-bg-body)',
  '#F8FAFC': 'var(--color-bg-body)',
  '#EFF6FF': 'var(--color-bg-body)',
  '#f8f9fa': 'var(--color-bg-body)',

  // Accent Success (Emerald Green)
  '#28a745': 'var(--color-accent-success)',
  '#218838': 'var(--color-accent-success)',
  '#155724': 'var(--color-accent-success)',
  '#29B6F6': 'var(--color-accent-success)', // Replacing Cyan with Emerald Green
  '#2DCE89': 'var(--color-accent-success)',

  // Accent Warning (Soft Coral/Orange)
  '#ffc107': 'var(--color-accent-warning)',
  '#F59E0B': 'var(--color-accent-warning)',
  '#dc3545': 'var(--color-accent-warning)',
  '#c82333': 'var(--color-accent-warning)',
  '#EF4444': 'var(--color-accent-warning)',
  '#9C27B0': 'var(--color-accent-warning)', // Replacing Neon Purple with Soft Coral
  '#721c24': 'var(--color-accent-warning)',
  '#856404': 'var(--color-accent-warning)',

  // Text Muted (Muted Gray)
  '#666666': 'var(--color-text-muted)',
  '#666': 'var(--color-text-muted)',
  '#6B7280': 'var(--color-text-muted)',
  '#9CA3AF': 'var(--color-text-muted)',
  '#888888': 'var(--color-text-muted)',
  '#888': 'var(--color-text-muted)',
  '#777777': 'var(--color-text-muted)',
  '#777': 'var(--color-text-muted)',
  '#6c757d': 'var(--color-text-muted)',
  '#5a6268': 'var(--color-text-muted)'
};

function processFile(filePath) {
  const fullPath = path.join(__dirname, filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${fullPath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');

  // We sort colorMap keys by length descending to match longest hex first (e.g. #333333 before #333)
  const sortedKeys = Object.keys(colorMap).sort((a, b) => b.length - a.length);

  sortedKeys.forEach(hex => {
    // Escape hex for regex and ensure it's not part of a larger hex string
    const regex = new RegExp(`${hex}(?![0-9a-fA-F])`, 'gi');
    content = content.replace(regex, colorMap[hex]);
  });

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Processed: ${filePath}`);
}

targetFiles.forEach(processFile);
