export default {
  WEBSITE_NAME: process.env.VUE_APP_WEBSITE_NAME || '百灵',
  BASE_API_URL: process.env.VUE_APP_API_BASE_URL || '',
  BASE_WS_URL: process.env.VUE_APP_WEB_SOCKET_URL || '',
  REQUEST_DID_HEADER: process.env.VUE_APP_DID_HEADER || '',
}
