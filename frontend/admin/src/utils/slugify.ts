export default function slugify(str: string,replaceWith:string = '-'): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, replaceWith)
    .replace(/^-+|-+$/g, '');
}
