// Abre o app CondoConnect numa tela (condoconnect://app/<tela>) ou, se não estiver instalado, manda para a loja certa.
export const STORE_LINKS = {
  ios: 'https://apps.apple.com/br/app/condoconnect/id6748700594',
  android: 'https://play.google.com/store/apps/details?id=br.com.condoconnect',
};
export const ANDROID_PACKAGE = 'br.com.condoconnect';

export type Platform = 'ios' | 'android' | 'desktop';

export function detectPlatform(): Platform {
  const ua = navigator.userAgent || '';
  if (/android/i.test(ua)) return 'android';
  // iPadOS novo se identifica como Mac, mas tem tela de toque
  if (/iphone|ipad|ipod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'ios';
  return 'desktop';
}

/** Só aceita caminhos simples do app; qualquer outra coisa vira o início. */
export const safeAppRoute = (route: string | null | undefined): string =>
  /^\/[a-zA-Z0-9/_-]{0,120}$/.test(String(route || '')) ? String(route) : '/inicio';

export const appDeepLink = (route: string) => `condoconnect://app${safeAppRoute(route)}`;

/**
 * Celular: tenta abrir o app e, se ele não abrir, vai para a loja do aparelho.
 * Computador: devolve 'desktop' para a tela mostrar os dois links das lojas.
 */
export function openAppOrStore(route: string): Platform {
  const platform = detectPlatform();
  const to = safeAppRoute(route);
  if (platform === 'android') {
    // Chrome/Samsung Internet: abre o app e, se não houver, vai sozinho para o Google Play.
    window.location.href = `intent://app${to}#Intent;scheme=condoconnect;package=${ANDROID_PACKAGE};`
      + `S.browser_fallback_url=${encodeURIComponent(STORE_LINKS.android)};end`;
  } else if (platform === 'ios') {
    // iPhone: tenta o endereço do app por um iframe invisível (se não existir, não aparece erro)
    // e, se a página continuar à vista depois de um tempo, abre a App Store.
    let left = false;
    const markLeft = () => { left = true; };
    document.addEventListener('visibilitychange', markLeft, { once: true });
    window.addEventListener('pagehide', markLeft, { once: true });
    window.addEventListener('blur', markLeft, { once: true });
    const frame = document.createElement('iframe');
    frame.style.display = 'none';
    frame.src = appDeepLink(to);
    document.body.appendChild(frame);
    setTimeout(() => {
      frame.remove();
      if (!left && document.visibilityState === 'visible') window.location.href = STORE_LINKS.ios;
    }, 1700);
  }
  return platform;
}
