module.exports = function getRedirectTo(req) {
  const refUrl = req.get("Referer");
  
  if (refUrl) {
    const ref = new URL(refUrl);
    if (req.hostname === ref.hostname) return ref.href;
  }
  
  return null;
}