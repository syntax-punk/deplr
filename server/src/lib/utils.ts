export function getContentForExtension(ext: string) {
  switch (ext) {
    case 'html':
      return 'text/html';
    case 'js':
      return 'text/javascript';
    case 'css':
      return 'text/css';
    case 'png':
      return 'image/png';
    case 'jpg':
      return 'image/jpg';
    case 'jpeg':
      return 'image/jpeg';
    case 'gif':
      return 'image/gif';
    case 'ico':
      return 'image/x-icon';
    case 'json':
      return 'application/json';
    default:
      return 'text/plain';
  }
}