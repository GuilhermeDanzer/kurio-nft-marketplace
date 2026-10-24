import { ArrowRight } from 'lucide-react'
import { blog } from '@/content/home'
import { blogPosts } from '@/mocks/fixtures'
import { nftArtPool } from '@/lib/assets'

export function BlogSection() {
  return (
    <section id="aprenda" className="flex flex-col gap-10">
      <div className="flex flex-col items-center gap-3 text-center">
        <h2 className="text-[28px] font-bold leading-[36px] tracking-[0.1em] text-foreground">{blog.eyebrow}</h2>
        <p className="max-w-2xl text-[14px] leading-[24px] text-secondary">{blog.subtitle}</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
        {blogPosts.map((p, i) => (
          <article key={p.id} className="flex w-full shrink-0 flex-col overflow-hidden rounded-[8px] bg-surface-card lg:w-[268px]">
            <img src={nftArtPool[i % nftArtPool.length]} alt="" className="h-[160px] w-full object-cover" />
            <div className="flex flex-1 flex-col gap-2 p-4 pt-3">
              <p className="text-[12px] leading-[16px] text-secondary">{p.meta}</p>
              <h3 className="text-[16px] font-bold leading-[20px] text-foreground">{p.title}</h3>
              <p className="text-[14px] leading-[24px] text-secondary">{p.description}</p>
              <span className="mt-2 flex items-center gap-1 text-[12px] font-bold leading-[16px] text-accent">
                Ler mais <ArrowRight className="size-3" />
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
