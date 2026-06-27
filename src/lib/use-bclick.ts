'use client';

import { useEffect, useRef } from 'react';

function applyBClickRipple(host: HTMLElement, e: MouseEvent) {
  const rect = host.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const w = host.offsetWidth;

  const bClick = document.createElement('span');
  bClick.className = 'bClick';
  bClick.style.left = `${x}px`;
  bClick.style.top = `${y}px`;
  bClick.style.setProperty('--scale', w.toString());      

  host.appendChild(bClick);

  setTimeout(() => {
    if (bClick.parentNode) {
      bClick.parentNode.removeChild(bClick);
    }
  }, 500);
}

function findBClickHost(target: EventTarget | null): HTMLElement | null {
  if (!target || (target as Node).nodeType !== Node.ELEMENT_NODE) return null;
  const el = target as HTMLElement;
  if (!el.closest) return null;

  const btn = el.closest('button');
  if (btn) {
    if (btn.getAttribute('data-bclick-skip') === 'true') return null;
    if (btn.classList.contains('clicked')) return null;   
    const b = btn as HTMLButtonElement;
    if (b.disabled) return null;
    if (b.getAttribute('aria-disabled') === 'true') return null;
    const br = btn.getAttribute('role');
    if (
      (br === 'radio' || br === 'menuitemradio') &&       
      btn.getAttribute('data-animation') !== 'bClick'     
    ) {
      return null;
    }
    return btn;
  }

  const marked = el.closest('[data-animation="bClick"]'); 
  if (marked) {
    if (marked.getAttribute('data-bclick-skip') === 'true') return null;
    if (marked.classList.contains('clicked')) return null;
    return marked as HTMLElement;
  }

  return null;
}

/**
 * useBClick — attach ripple to a single non-button host (e.g. custom surface).
 * Native `<button>` elements get ripples automatically via `useBClickObserver` (delegation).
 */
export function useBClick<T extends HTMLElement>() {      
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (element.classList.contains('clicked') || element.classList.contains('disabled')) {
        return;
      }
      if ('disabled' in element && (element as unknown as HTMLButtonElement).disabled) {
        return;
      }

      applyBClickRipple(element, e);
    };

    element.addEventListener('mousedown', handleMouseDown);

    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  return elementRef;
}

let bClickDelegateRefCount = 0;
let bClickDelegateHandler: ((e: MouseEvent) => void) | null = null;

/**
 * One document listener (ref-counted): ripples on most `<button>` elements + `[data-animation="bClick"]`.
 */
export function useBClickObserver() {
  useEffect(() => {
    bClickDelegateRefCount += 1;
    if (bClickDelegateRefCount === 1) {
      bClickDelegateHandler = (e: MouseEvent) => {        
        if (e.button !== 0) return;
        const host = findBClickHost(e.target);
        if (!host) return;
        applyBClickRipple(host, e);
      };
      document.addEventListener('mousedown', bClickDelegateHandler);
    }
    return () => {
      bClickDelegateRefCount -= 1;
      if (bClickDelegateRefCount === 0 && bClickDelegateHandler) {
        document.removeEventListener('mousedown', bClickDelegateHandler);
        bClickDelegateHandler = null;
      }
    };
  }, []);
}
