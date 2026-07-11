// Assets are served via same-origin Nginx proxy at /__l5e/*.
// Keep this helper as a pass-through so components stay unchanged
// if we ever need to rewrite URLs again.
export function resolveLovableAssetUrl(url: string) {
  return url;
}
