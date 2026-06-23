const footerLinks = [
  { label: '关于我们', href: '/about' },
  { label: '成员介绍', href: '/members' },
  { label: '活动', href: '/events' },
  { label: '新闻', href: '/news' },
]

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <a href="/" className="flex items-center gap-2.5">
            <img src="/images/logoblack.jpg" alt="AIIA" className="w-8 h-8 rounded-lg object-contain brightness-0 invert" />
            <span className="text-white font-bold text-base">哈工大深圳人工智能创协</span>
          </a>

          <div className="flex items-center gap-6 flex-wrap justify-center">
            {footerLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-xs text-slate-400 hover:text-white transition-colors">
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} HITSZ AIIA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
