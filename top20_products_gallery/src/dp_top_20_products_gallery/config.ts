// (C) 2026 GoodData Corporation
//
// Configuration for the Top 20 Products Gallery custom widget.
//
// HOW TO FILL THIS IN:
//   1. Run `npm run refresh-md` (it uses the workspace + credentials from .env / .env.secrets).
//   2. Open the generated file `src/md/full.ts`.
//   3. Find each attribute/metric by its display name (e.g. "Product Number", "Revenue") and
//      copy its `identifier` string into the matching constant below.
//
// Note: unlike the Repeater visualization, this component renders the <img> tag itself, so
// IMAGE_URL_ATTR_ID does NOT need to be set up as an "Image"-type label in the Logical Data
// Model. Any plain text label that holds the image URL works fine.

export const PRODUCT_NUMBER_ATTR_ID = "label.product.product_number"; // TODO: replace with your real identifier
export const PRODUCT_NAME_ATTR_ID = "label.product.product_name"; // TODO: replace with your real identifier
export const IMAGE_URL_ATTR_ID = "label.product.image_url"; // TODO: replace with your real identifier
export const REVENUE_METRIC_ID = "gmv_net_in_tc"; // Revenue metric identifier (from earlier Rich Text setup)

// How many top products to show, ranked by REVENUE_METRIC_ID descending.
export const TOP_N = 20;
