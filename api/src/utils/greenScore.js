function greenScore(listing) {
  let score = 20;
  if ((listing.description || '').length >= 60) score += 20;
  if (listing.price <= 500) score += 20;
  if (['Clothing', 'Books'].includes(listing.category)) score += 20;
  if ((listing.title || '').length >= 12) score += 20;
  return Math.min(100, score);
}

module.exports = { greenScore };
