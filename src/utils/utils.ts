export function applyDiscount(price: number, discountPercentage: number) {
  if (price <= 0 || discountPercentage <= 0 || discountPercentage > 100) {
    return price
  }

  const discountAmount = (price * discountPercentage) / 100
  const discountedPrice = price - discountAmount

  return discountedPrice
}
