# Portfolio assets

The portrait is the transparent cutout preview approved by the user on 3 October 2026. It was produced using the built-in image generation/editing tool from the supplied photograph. The user approved this preview after being told the tool changed some portrait details. PNG alpha is preserved.

Final edit prompt:

> PRECISE BACKGROUND REMOVAL EDIT. Image 1 is the user's ORIGINAL nighttime photograph (724x1086) and the ONLY edit target. Image 2 is an unsuccessful generated attempt, NOT a reference to use. Return image 1's original photographed person EXACTLY, pixel-faithful without regenerating his face, clothing, hands or posture. Remove the dark nighttime background including colored distant lights, vegetation, and brick/ledge, and set all background pixels to alpha 0. Keep all foreground person pixels opaque alpha 255, with only a narrow antialiased edge. Absolutely NO glow, blurred background, gradient, shadow, halo or partially transparent background. This is a cutout, not a portrait recreation. Preserve original crop, original face size, original facial expression, original folds, burgundy turban, light blue shirt, watch, bracelet, original jeans and original hand positions. Subject should stay at same scale and placement as original photograph, with blank transparent space above his head. Export transparent PNG. Change ONLY background; do NOT reshoot, enhance, beautify or reinterpret.

Asset: `profile/parampreet-cutout.png`, 1024 × 1536 pixels, RGBA. Transparent background pixels are present. The tool's maximum alpha is 254 rather than 255; it remains effectively opaque inside the person.

Add future assets under `personal/`, `projects/`, `timeline/`, and `textures/`. Configure their paths, alt text, captions and dimensions in `src/data/portfolio.ts`. Use genuine product screenshots without filters. Do not insert generated personal photographs or invented product screenshots. The existing `public/resume.pdf` is a text placeholder and is deliberately not linked.

The personal gallery contains the three user-supplied photographs: `personal/book-market.jpg` (1330 × 2364), `personal/hillside-dusk.jpg` (664 × 1182), and `personal/bakery-counter.jpg` (664 × 1182). Original attachment bytes were saved unchanged. Captions describe visible subjects without inventing locations or personal events.
