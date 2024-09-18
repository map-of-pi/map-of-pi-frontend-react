// Helper function to remove all manner of URLs and links from text
export default function UrlsRemoval(text: string) {
  text = text.trim()
  const urlPattern = /((https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})(\/[^\s]*)?)/g;
  return text.replace(urlPattern, '');
};
