/**
 * Photo gallery: one frame visible at a time, per shirt colour.
 *
 * Markup contract (all optional except the root and frames). Elements belong
 * to the closest `[data-gallery]` root, so galleries can nest (e.g. a zoom
 * dialog inside a model page gallery).
 *
 * - `[data-gallery]` root. `data-gallery-color`: the colour shown first.
 *   The script sets `data-gallery-ready` (style JS-only controls with it),
 *   and keeps `data-gallery-index` and `data-gallery-color` current.
 * - `[data-gallery-frame]` with `data-index` (0-based) and, for galleries
 *   with colours, `data-color`. Render the first frame visible and the rest
 *   with `hidden`, so the page reads well without JS.
 * - `[data-gallery-prev]`, `[data-gallery-next]` buttons (wrap around).
 * - `[data-gallery-thumb]` buttons with `data-index`: aria-pressed.
 * - `[data-gallery-color-option]` buttons with `data-color`: aria-pressed.
 * - `[data-gallery-counter]`: text set to "n / total".
 * - `[data-gallery-bar]` with `data-index`: `data-active` on the current one.
 * - `[data-gallery-last]`: shown only on the last frame (`hidden` otherwise).
 *
 * Changing colour keeps the angle. No DOM is created; images in hidden
 * frames with loading="lazy" load when first shown.
 */

export interface GalleryState {
  /** Current frame, 0-based. */
  readonly index: number;
  /** Frames in the current colour. */
  readonly count: number;
  /** Current colour; undefined for galleries without colours. */
  readonly color: string | undefined;
}

export interface Gallery {
  readonly root: HTMLElement;
  readonly state: GalleryState;
  /** Shows frame `index` (wraps around). */
  go(index: number): void;
  next(): void;
  prev(): void;
  setColor(color: string): void;
  /** Removes the listeners and `data-gallery-ready`. */
  destroy(): void;
}

export interface GalleryOptions {
  /** After every change made by the visitor or through the API. */
  readonly onChange?: (gallery: Gallery, state: GalleryState) => void;
}

const ROOT_SELECTOR = '[data-gallery]';

function indexOf(element: HTMLElement | undefined): number {
  const index = Number(element?.dataset.index);
  return Number.isInteger(index) && index >= 0 ? index : 0;
}

export function createGallery(
  root: HTMLElement,
  options: GalleryOptions = {},
): Gallery {
  const own = <E extends HTMLElement>(selector: string): E[] =>
    Array.from(root.querySelectorAll<E>(selector)).filter(
      (element) => element.closest(ROOT_SELECTOR) === root,
    );

  const frames = own<HTMLElement>('[data-gallery-frame]');
  const prevButtons = own<HTMLButtonElement>('[data-gallery-prev]');
  const nextButtons = own<HTMLButtonElement>('[data-gallery-next]');
  const thumbs = own<HTMLButtonElement>('[data-gallery-thumb]');
  const colorOptions = own<HTMLButtonElement>('[data-gallery-color-option]');
  const counters = own<HTMLElement>('[data-gallery-counter]');
  const bars = own<HTMLElement>('[data-gallery-bar]');
  const lastOnly = own<HTMLElement>('[data-gallery-last]');

  const shown = frames.find((frame) => !frame.hidden) ?? frames[0];
  let color = root.dataset.galleryColor ?? shown?.dataset.color;
  let index = indexOf(shown);

  const inColor = (frame: HTMLElement, wanted: string | undefined): boolean =>
    wanted === undefined ||
    frame.dataset.color === undefined ||
    frame.dataset.color === wanted;

  const countFor = (wanted: string | undefined): number =>
    Math.max(1, frames.filter((frame) => inColor(frame, wanted)).length);

  function render(): void {
    const count = countFor(color);
    for (const frame of frames) {
      frame.hidden = !(inColor(frame, color) && indexOf(frame) === index);
    }
    for (const counter of counters) {
      counter.textContent = `${index + 1} / ${count}`;
    }
    for (const bar of bars) {
      bar.toggleAttribute('data-active', indexOf(bar) === index);
    }
    for (const thumb of thumbs) {
      thumb.setAttribute('aria-pressed', String(indexOf(thumb) === index));
    }
    for (const option of colorOptions) {
      option.setAttribute(
        'aria-pressed',
        String(option.dataset.color === color),
      );
    }
    for (const element of lastOnly) element.hidden = index !== count - 1;
    root.dataset.galleryIndex = String(index);
    if (color !== undefined) root.dataset.galleryColor = color;
  }

  function update(nextIndex: number, nextColor: string | undefined): void {
    const count = countFor(nextColor);
    const wrapped = ((nextIndex % count) + count) % count;
    if (wrapped === index && nextColor === color) return;
    index = wrapped;
    color = nextColor;
    render();
    options.onChange?.(gallery, gallery.state);
  }

  const controller = new AbortController();
  const listen = (element: HTMLElement, handler: () => void): void => {
    element.addEventListener('click', handler, { signal: controller.signal });
  };

  const gallery: Gallery = {
    root,
    get state(): GalleryState {
      return { index, count: countFor(color), color };
    },
    go: (target) => update(target, color),
    next: () => update(index + 1, color),
    prev: () => update(index - 1, color),
    setColor: (target) => update(index, target),
    destroy() {
      controller.abort();
      delete root.dataset.galleryReady;
    },
  };

  for (const button of prevButtons) listen(button, () => gallery.prev());
  for (const button of nextButtons) listen(button, () => gallery.next());
  for (const thumb of thumbs) listen(thumb, () => gallery.go(indexOf(thumb)));
  for (const option of colorOptions) {
    listen(option, () => {
      const target = option.dataset.color;
      if (target !== undefined) gallery.setColor(target);
    });
  }

  render();
  root.dataset.galleryReady = '';
  return gallery;
}

/** Starts every not yet started `[data-gallery]` under `scope`. */
export function initGalleries(
  scope: ParentNode = document,
  options: GalleryOptions = {},
): Gallery[] {
  return Array.from(scope.querySelectorAll<HTMLElement>(ROOT_SELECTOR))
    .filter((root) => root.dataset.galleryReady === undefined)
    .map((root) => createGallery(root, options));
}
