import { redirect } from 'next/navigation'
import { AdBannerForm } from '@/components/admin/ad-banner-form'
import { getCurrentUser } from '@/lib/cms/auth'
import { canPublish } from '@/lib/cms/permissions'
import { getAdminAdBanners } from '@/lib/cms/ad-banners'

export default async function AdsPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/admin/login')
  }

  if (!canPublish(user)) {
    redirect('/admin')
  }

  const banners = await getAdminAdBanners()

  return (
    <div className="space-y-8">
      <header>
        <h1 className="admin-page-title">Реклама</h1>
        <p className="admin-page-description">
          Три рекламных места на главной странице: верхнее, среднее и нижнее.
          Загрузите изображение, укажите ссылку и включите показ.
        </p>
      </header>

      <div className="space-y-6">
        {banners.map((banner) => (
          <AdBannerForm key={banner.slot} banner={banner} />
        ))}
      </div>
    </div>
  )
}
