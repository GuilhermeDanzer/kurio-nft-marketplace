import { useState } from 'react'
import { CatalogExplorer } from '@/components/catalog/CatalogExplorer'
import { Hero } from '@/components/home/Hero'
import { PromoGrid } from '@/components/home/PromoGrid'
import { BlogSection } from '@/components/home/BlogSection'
import { MobileSearchBar } from '@/components/home/MobileSearchBar'

export function HomePage() {
  const [filtersOpen, setFiltersOpen] = useState(false)

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col px-6 lg:px-0">
      <div className="pt-10 lg:hidden">
        <MobileSearchBar onToggleFilters={() => setFiltersOpen((v) => !v)} />
      </div>

      <div className="mt-4 lg:mt-8">
        <Hero />
      </div>

      <div className="mt-4 lg:mt-24">
        <CatalogExplorer mobileFiltersOpen={filtersOpen} />
      </div>

      <div className="mt-24 hidden lg:block">
        <PromoGrid />
      </div>

      <div className="mt-24 hidden lg:block">
        <BlogSection />
      </div>
    </div>
  )
}
