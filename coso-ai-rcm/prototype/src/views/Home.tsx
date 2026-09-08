import { useEffect, useRef } from 'react'
import anime from 'animejs'
import { ShieldCheck, ArrowRight } from 'lucide-react'
type Props = {
  onGetStarted: () => void
}

export function Home({ onGetStarted }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const els = [cardRef.current, titleRef.current, subtitleRef.current, ctaRef.current]
    if (document.hidden) {
      els.forEach(el => { if (el) { el.style.opacity = '1'; el.style.transform = 'none' } })
      return
    }
    const tl = anime.timeline({ easing: 'easeOutExpo', duration: 800 })
    tl.add({ targets: cardRef.current, translateY: [40, 0], opacity: [0, 1] })
      .add({ targets: titleRef.current, translateY: [16, 0], opacity: [0, 1], duration: 600 }, '-=600')
      .add({ targets: subtitleRef.current, translateY: [12, 0], opacity: [0, 1], duration: 600 }, '-=500')
      .add({ targets: ctaRef.current, translateY: [8, 0], opacity: [0, 1], duration: 500 }, '-=450')
  }, [])

  function handleClick() {
    anime({
      targets: ctaRef.current,
      scale: [{ value: 0.96, duration: 90 }, { value: 1, duration: 220 }],
      easing: 'easeOutBack',
      complete: onGetStarted,
    })
    if (document.hidden) onGetStarted()
  }

  return (
    <div
      className="min-h-full flex items-center justify-center p-6 py-16"
      style={{ background: 'radial-gradient(circle at 30% 20%, #eef2ff 0%, #fafafa 60%)' }}
    >
      <div
        ref={cardRef}
        className="max-w-xl w-full bg-white rounded-lg shadow-xl p-10 opacity-0"
        style={{ borderTop: '4px solid #4f46e5' }}
      >
        <div className="flex items-center gap-2 text-indigo-600 mb-6">
          <ShieldCheck size={20} />
          <span className="text-xs font-semibold tracking-widest uppercase">COSO AI RCM</span>
        </div>
        <h1 ref={titleRef} className="text-4xl font-semibold leading-tight tracking-tight opacity-0 text-gray-900">
          The compliance manager&apos;s command center for AI governance.
        </h1>
        <p ref={subtitleRef} className="mt-5 text-base text-gray-600 leading-relaxed opacity-0">
          Agent inventory, capability-mapped risk assessments, controls, recurring testing, and
          evidence &mdash; auto-populated from FloQast Transform, ready for the auditor.
        </p>
        <button
          ref={ctaRef}
          onClick={handleClick}
          className="mt-8 inline-flex items-center gap-2 bg-indigo-600 text-white text-sm font-medium py-3 px-5 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors opacity-0"
        >
          Open the agent inventory
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
