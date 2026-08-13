import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/profile', '/api/', '/auth/'],
      },
    ],
    sitemap: 'https://xyroots.com/sitemap.xml',
  }
}
