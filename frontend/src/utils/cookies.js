import Cookies from 'js-cookie';

export const cookieUtils = {
  setToken: (token) => {
    Cookies.set('auth_token', token, {
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
  },

  getToken: () => {
    return Cookies.get('auth_token');
  },

  removeToken: () => {
    Cookies.remove('auth_token');
  }
};
