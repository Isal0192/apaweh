export const getGDriveEmbedUrl = (url: string) => {
  if (url.includes('embeddedfolderview')) {
    return url;
  }
  const folderMatch = url.match(/\/folders\/([a-zA-Z0-9_-]{25,})/);
  if (folderMatch && folderMatch[1]) {
    return `https://drive.google.com/embeddedfolderview?id=${folderMatch[1]}#grid`;
  }
  const dMatch = url.match(/\/d\/([a-zA-Z0-9_-]{25,})/);
  if (dMatch && dMatch[1]) {
    return `https://drive.google.com/file/d/${dMatch[1]}/preview`;
  }
  const idMatch = url.match(/id=([a-zA-Z0-9_-]{25,})/);
  if (idMatch && idMatch[1]) {
    return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
  }
  return null;
};

export const getYouTubeEmbedUrl = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
};
