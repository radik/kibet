import type { ImageMetadata } from 'astro';
import {
  MODELS,
  PHOTO_ANGLES,
  SHIRT_COLORS,
  type ModelSlug,
  type PhotoAngle,
  type ShirtColor,
} from './models.ts';

/*
 * Photos: one per model × shirt colour × angle, plus the home campaign photo.
 *
 * No photos exist yet; every combination without a file renders the grey
 * placeholder. To add a photo, drop the file into src/assets/photos/ under
 * the name below. Nothing else changes: this module picks files up by name
 * at build time and the components render them instead of the placeholder.
 *
 *   src/assets/photos/<model slug>/<colour>-<angle>.<ext>
 *     e.g. src/assets/photos/berlin/white-front.jpg
 *          src/assets/photos/ir-hatyn/black-worn.webp
 *   src/assets/photos/hero.<ext>     campaign photo at the top of the home page
 *
 *   <model slug>  ModelSlug in ./models.ts (berlin, paris, kuchtenech, …)
 *   <colour>      SHIRT_COLORS ids: white, black
 *   <angle>       PHOTO_ANGLES: front, back, print, worn
 *   <ext>         jpg, jpeg, png, webp or avif (lower case)
 *
 * Product photos are shown at 3:4 and cropped to fill (object-fit: cover):
 * export them at 3:4, about 1200 × 1600 px. The hero photo is cropped to a
 * wide landscape box: 2400 px wide or more, subject near the centre.
 * Also update `hero.photoAlt` in the dictionaries to describe the real photo.
 * Files whose names match no model, colour or angle are ignored, with a
 * warning in the build log.
 */

const productFiles = import.meta.glob<ImageMetadata>(
  '../assets/photos/*/*.{jpg,jpeg,png,webp,avif}',
  { eager: true, import: 'default' },
);

const heroFiles = import.meta.glob<ImageMetadata>(
  '../assets/photos/hero.{jpg,jpeg,png,webp,avif}',
  { eager: true, import: 'default' },
);

/** 'berlin/white-front' */
type PhotoKey = `${ModelSlug}/${ShirtColor}-${PhotoAngle}`;

function photoKey(
  slug: ModelSlug,
  color: ShirtColor,
  angle: PhotoAngle,
): PhotoKey {
  return `${slug}/${color}-${angle}`;
}

const KNOWN_KEYS = new Set<string>(
  MODELS.flatMap((model) =>
    SHIRT_COLORS.flatMap(({ id }) =>
      PHOTO_ANGLES.map((angle) => photoKey(model.slug, id, angle)),
    ),
  ),
);

/** '../assets/photos/berlin/white-front.jpg' → 'berlin/white-front'. */
const FILE_NAME = /\/([^/]+)\/([^/.]+)\.[a-z0-9]+$/;

const PRODUCT_PHOTOS = new Map<string, ImageMetadata>();
for (const [path, image] of Object.entries(productFiles)) {
  const [, folder, name] = FILE_NAME.exec(path) ?? [];
  const key = folder && name ? `${folder}/${name}` : '';
  if (KNOWN_KEYS.has(key)) {
    PRODUCT_PHOTOS.set(key, image);
  } else {
    console.warn(
      `[photos] ${path} does not match <model slug>/<colour>-<angle>; ignored.`,
    );
  }
}

/** The photo for one model, colour and angle; undefined while there is none. */
export function productPhoto(
  slug: ModelSlug,
  color: ShirtColor,
  angle: PhotoAngle,
): ImageMetadata | undefined {
  return PRODUCT_PHOTOS.get(photoKey(slug, color, angle));
}

/** One slide of a model's photo gallery. */
export interface GalleryFrame {
  readonly color: ShirtColor;
  readonly angle: PhotoAngle;
  /** Position within its colour, 0-based, in PHOTO_ANGLES order. */
  readonly index: number;
  /** undefined: no photo yet, render the placeholder. */
  readonly image: ImageMetadata | undefined;
}

/**
 * Every frame of a model's gallery: for each colour (SHIRT_COLORS order),
 * one frame per angle (PHOTO_ANGLES order).
 */
export function galleryFrames(slug: ModelSlug): readonly GalleryFrame[] {
  return SHIRT_COLORS.flatMap(({ id: color }) =>
    PHOTO_ANGLES.map((angle, index) => ({
      color,
      angle,
      index,
      image: productPhoto(slug, color, angle),
    })),
  );
}

/** Home campaign photo; undefined while there is none. */
export const HERO_PHOTO: ImageMetadata | undefined =
  Object.values(heroFiles)[0];
