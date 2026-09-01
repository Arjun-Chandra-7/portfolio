import sharp from 'sharp'

const assets = [
  ['public/assets/arjun-mangekyou.png', 'public/assets/arjun-mangekyou-cutout.png'],
  ['public/assets/arjun-rinnegan.png', 'public/assets/arjun-rinnegan-cutout.png'],
  ['public/assets/arjun-susanoo.png', 'public/assets/arjun-susanoo-cutout.png'],
]

for (const [input, output] of assets) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  const count = width * height
  const outside = new Uint8Array(count)
  const queue = new Uint32Array(count)
  let head = 0
  let tail = 0

  const isBackground = (pixel) => {
    const offset = pixel * channels
    const r = data[offset]
    const g = data[offset + 1]
    const b = data[offset + 2]
    return Math.max(r, g, b) <= 24
  }

  const visit = (pixel) => {
    if (outside[pixel] || !isBackground(pixel)) return
    outside[pixel] = 1
    queue[tail++] = pixel
  }

  for (let x = 0; x < width; x++) {
    visit(x)
    visit((height - 1) * width + x)
  }
  for (let y = 0; y < height; y++) {
    visit(y * width)
    visit(y * width + width - 1)
  }

  while (head < tail) {
    const pixel = queue[head++]
    const x = pixel % width
    const y = Math.floor(pixel / width)
    if (x > 0) visit(pixel - 1)
    if (x + 1 < width) visit(pixel + 1)
    if (y > 0) visit(pixel - width)
    if (y + 1 < height) visit(pixel + width)
  }

  for (let pixel = 0; pixel < count; pixel++) {
    if (!outside[pixel]) continue
    const offset = pixel * channels
    const luminance = Math.max(data[offset], data[offset + 1], data[offset + 2])
    data[offset + 3] = Math.round(255 * Math.max(0, Math.min(1, luminance / 24)))
  }

  await sharp(data, { raw: info }).png({ compressionLevel: 9 }).toFile(output)
  console.log(`${output}: removed ${tail.toLocaleString()} edge-connected background pixels`)
}
