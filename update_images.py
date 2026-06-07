from pathlib import Path
import re
path = Path('src/data/products.js')
text = path.read_text(encoding='utf-8')
updates = {
    10023: 'https://m.media-amazon.com/images/I/51GGNszx9OL._AC_UL320_.jpg',
    10026: 'https://m.media-amazon.com/images/I/61YHhrwOlEL._AC_UL320_.jpg',
    10027: 'https://m.media-amazon.com/images/I/41BFFqkqIFL._SY300_SX300_QL70_FMwebp_.jpg',
    10029: 'https://m.media-amazon.com/images/I/81OF0agYcZL._AC_UL320_.jpg',
    10033: 'https://m.media-amazon.com/images/I/81t7aRilIRL._AC_UL320_.jpg',
    10034: 'https://m.media-amazon.com/images/I/71wzRYZ6JIL._SX522_.jpg',
    10036: 'https://m.media-amazon.com/images/I/61lR7cBXqrL._AC_UL320_.jpg',
    10037: 'https://m.media-amazon.com/images/I/61fMjt3RvsL._AC_SX522_.jpg',
    10038: 'https://m.media-amazon.com/images/I/61L17GLgEkL._AC_UL320_.jpg',
    10039: 'https://m.media-amazon.com/images/I/81UEM0NUZBL._AC_UL320_.jpg',
}
changed = []
for pid, url in updates.items():
    pattern_image = re.compile(rf'(id:\s*{pid},.*?image:\s*\n\s*")([^"]+)("\s*,)', re.S)
    new_text, n1 = pattern_image.subn(rf'\1{url}\3', text, count=1)
    if n1 == 0:
        raise SystemExit(f'Failed to replace image for {pid}')
    text = new_text
    pattern_images = re.compile(rf'(id:\s*{pid},.*?images:\s*\[\s*\n\s*")([^"]+)("\s*,\s*\n\s*\])', re.S)
    new_text, n2 = pattern_images.subn(rf'\1{url}\3', text, count=1)
    if n2 == 0:
        raise SystemExit(f'Failed to replace images array for {pid}')
    text = new_text
    changed.append(pid)
p = Path('src/data/products.js')
p.write_text(text, encoding='utf-8')
print('Updated ids:', changed)
