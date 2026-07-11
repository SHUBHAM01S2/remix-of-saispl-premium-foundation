const LOVABLE_ASSET_ORIGIN = "https://id-preview--1904647c-6086-4042-bd42-110a0ab53e9b.lovable.app";

export function resolveLovableAssetUrl(url: string) {
  if (!url || /^(https?:|data:|blob:)/.test(url)) return url;
  if (url.startsWith("/__l5e/")) return `${LOVABLE_ASSET_ORIGIN}${url}`;
  return url;
}