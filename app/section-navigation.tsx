'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

const sections = [
  { id: 'intro', number: '00', label: '프로필', english: 'Profile' },
  { id: 'work', number: '01', label: '프로젝트', english: 'Projects' },
  { id: 'awards', number: '02', label: '수상', english: 'Awards' },
  { id: 'publications', number: '03', label: '논문', english: 'Publications' },
  { id: 'about', number: '04', label: '경력', english: 'Background' },
  { id: 'education', number: '05', label: '학력', english: 'Education' },
  { id: 'contact', number: '06', label: '연락처', english: 'Contact' },
];

export default function SectionNavigation() {
  const [active, setActive] = useState('intro');
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const root = document.documentElement;
      const scrollable = root.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(100, Math.max(0, window.scrollY / scrollable * 100)) : 0);
      const marker = Math.min(240, window.innerHeight * 0.34);
      let current = sections[0].id;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.getBoundingClientRect().top <= marker) current = section.id;
      }
      if (window.scrollY < 10) current = 'intro';
      if (scrollable > 0 && window.scrollY >= scrollable - 3) current = 'contact';
      setActive(current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [open]);

  const current = sections.find(section => section.id === active)!;
  return (
    <>
      <header className="mobile-header">
        <a href="#intro" className="wordmark">YEJI JEON<span className="wordmark-dot" /></a>
        <span className="mobile-current">{current.label}</span>
        <button aria-label={open ? '전체 메뉴 닫기' : '전체 메뉴 열기'} aria-expanded={open} aria-controls="section-sidebar" onClick={() => setOpen(!open)}>
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
        <span className="mobile-progress" style={{ width: `${progress}%` }} />
      </header>
      {open && <button className="sidebar-scrim" aria-label="전체 메뉴 닫기" onClick={() => setOpen(false)} />}
      <aside id="section-sidebar" className={`section-sidebar ${open ? 'is-open' : ''}`}>
        <a href="#intro" className="sidebar-brand wordmark" onClick={() => setOpen(false)}>YEJI JEON<span className="wordmark-dot" /></a>
        
        <div className="sidebar-nav-label">CONTENTS</div>
        <nav className="section-nav" aria-label="전체 메뉴">
          {sections.map(section => (
            <a key={section.id} href={`#${section.id}`} aria-current={active === section.id ? 'location' : undefined} className={active === section.id ? 'is-current' : ''} onClick={() => setOpen(false)}>
              <span className="nav-number">{section.number}</span>
              <span className="nav-label">{section.label}</span>
              <i aria-hidden="true" />
            </a>
          ))}
        </nav>
        <div className="sidebar-location">
          <p className="sr-only" aria-live="polite">현재 위치: {current.label}</p>
          <div className="reading-track" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
          <div className="reading-caption"><span>SCROLL</span><span>{Math.round(progress)}%</span></div>
        </div>

      </aside>
    </>
  );
}
