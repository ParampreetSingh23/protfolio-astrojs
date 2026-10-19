# Technology logos

These local SVG assets preserve source colors and geometry. The site loads them as decorative images beside visible technology names, with no icon API or runtime library.

AWS service icons, including ECR and EKS, come from the official AWS architecture icon package dated 31 July 2026:
https://aws.amazon.com/architecture/icons/
https://d1.awsstatic.com/onedam/marketing-channels/website/public/shared/architecture-icon-release/Icon-package_07312026.5846e92413caa21490223536cc97f1269e44fa92.zip

Other logos come from Gil Barbara's SVG Logos collection, distributed through `@iconify-json/logos` version 1.2.15 (CC0-1.0 collection license):
https://github.com/gilbarbara/logos
https://iconify.design/docs/usage/svg/

Brand names and logos belong to their respective owners. Their display identifies technologies in the supplied portfolio scope; it does not imply affiliation or endorsement. EKS remains in the exploration path rather than being added as an unsupported production accomplishment.

`src/data/logos.ts` maps technology names to local SVG filenames. Unknown or non-brand concepts retain their text labels. Wordmarks with dark artwork use a small neutral backing rather than recoloring the original asset.
