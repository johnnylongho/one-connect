export interface GoogleUserInfo {
  email: string;
  name: string;
  picture?: string;
  sub?: string;
}

export const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  '350557283404-3ae20qulsjt51fsjumggle7rg7sjqmbc.apps.googleusercontent.com';

let gsiScriptLoadingPromise: Promise<void> | null = null;

export function loadGoogleGsiScript(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  if ((window as any).google?.accounts) {
    return Promise.resolve();
  }

  if (gsiScriptLoadingPromise) {
    return gsiScriptLoadingPromise;
  }

  gsiScriptLoadingPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById('google-gsi-client');
    if (existing) {
      if ((window as any).google?.accounts) {
        resolve();
        return;
      }
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', (e) => reject(e));
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-gsi-client';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      resolve();
    };
    script.onerror = (err) => {
      console.warn('Google Identity Services script failed to load:', err);
      reject(err);
    };
    document.head.appendChild(script);
  });

  return gsiScriptLoadingPromise;
}

export function initGoogleOneTap(
  onSuccess: (user: GoogleUserInfo, idToken?: string) => Promise<void> | void,
  onError?: (msg: string) => void
) {
  if (typeof window === 'undefined') return;

  loadGoogleGsiScript()
    .then(() => {
      try {
        const google = (window as any).google;
        if (!google?.accounts?.id) return;

        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response: any) => {
            if (!response?.credential) {
              onError?.('Không nhận được thông tin xác thực từ Google');
              return;
            }

            try {
              // Decode base64 JWT payload safely
              const payloadBase64 = response.credential.split('.')[1];
              const decodedStr = decodeURIComponent(
                atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'))
                  .split('')
                  .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                  .join('')
              );
              const payload = JSON.parse(decodedStr);

              await onSuccess(
                {
                  email: payload.email,
                  name: payload.name || payload.given_name || payload.email.split('@')[0],
                  picture: payload.picture,
                  sub: payload.sub,
                },
                response.credential
              );
            } catch (err: any) {
              console.error('One Tap credential decoding error:', err);
              onError?.(`Lỗi giải mã thông tin tài khoản Google: ${err?.message || err}`);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Prompt Google One Tap widget
        google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed()) {
            console.log('Google One Tap not displayed:', notification.getNotDisplayedReason());
          } else if (notification.isSkippedMoment()) {
            console.log('Google One Tap skipped:', notification.getSkippedReason());
          }
        });
      } catch (err) {
        console.warn('Failed to initialize Google One Tap:', err);
      }
    })
    .catch((err) => {
      console.warn('Google GSI script load error for One Tap:', err);
    });
}

export async function triggerGooglePopupAuth(
  onSuccess: (user: GoogleUserInfo) => Promise<void> | void,
  onError: (msg: string) => void,
  onFallbackRedirect?: () => void
) {
  if (typeof window === 'undefined') return;

  try {
    await loadGoogleGsiScript();
    const google = (window as any).google;

    if (!google?.accounts?.oauth2) {
      if (onFallbackRedirect) {
        onFallbackRedirect();
        return;
      }
      throw new Error('Google OAuth2 SDK không khả dụng');
    }

    const tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'openid email profile',
      callback: async (tokenResponse: any) => {
        if (tokenResponse.error) {
          if (tokenResponse.error === 'popup_closed_by_user') {
            onError('Cửa sổ đăng nhập Google đã được đóng.');
            return;
          }
          onError(`Đăng nhập Google thất bại: ${tokenResponse.error_description || tokenResponse.error}`);
          return;
        }

        if (!tokenResponse.access_token) {
          onError('Không nhận được Access Token từ Google.');
          return;
        }

        try {
          // Fetch user info from Google's official userinfo endpoint
          const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          });

          if (!res.ok) {
            throw new Error(`Google API phản hồi mã lỗi: ${res.status}`);
          }

          const userInfo = await res.json();
          if (!userInfo.email) {
            throw new Error('Không thể lấy được địa chỉ email từ tài khoản Google');
          }

          await onSuccess({
            email: userInfo.email,
            name: userInfo.name || userInfo.given_name || userInfo.email.split('@')[0],
            picture: userInfo.picture,
            sub: userInfo.sub,
          });
        } catch (fetchErr: any) {
          console.error('Failed to fetch Google userinfo:', fetchErr);
          onError(`Lỗi xác thực thông tin tài khoản Google: ${fetchErr?.message || fetchErr}`);
        }
      },
    });

    // Request access token with popup directly tied to oneconnect.id.vn origin
    tokenClient.requestAccessToken({ prompt: 'select_account' });
  } catch (err: any) {
    console.warn('Google popup error, invoking fallback:', err);
    if (onFallbackRedirect) {
      onFallbackRedirect();
    } else {
      onError(`Không thể khởi tạo đăng nhập Google: ${err?.message || err}`);
    }
  }
}
