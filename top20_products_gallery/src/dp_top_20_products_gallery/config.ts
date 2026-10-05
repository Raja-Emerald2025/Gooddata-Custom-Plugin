// (C) 2026 GoodData Corporation
//
// Configuration for the Top 20 Products Gallery custom widget.
//
// Identifiers below were looked up from the workspace metadata (elastic_order_EBA-8304):
//   - Product Number / Product Name come from the orders_summary dataset, the same dataset
//     that holds the net_amount fact behind the GMV Net in TC metric.
//   - Image URL is the plain text label of the image_url attribute (Image Dataset).
//
// Note: this component renders the <img> tag itself, so IMAGE_URL_ATTR_ID does NOT need to be
// an "Image"-type label. Any plain text label that holds the image URL works fine.

export const PRODUCT_NUMBER_ATTR_ID = "product_number"; // attribute "Product Number" (orders_summary)
export const PRODUCT_NAME_ATTR_ID = "orders_summary.product_name"; // attribute "Product Name" (orders_summary)
export const IMAGE_URL_ATTR_ID = "image_url"; // attribute "Image url" (image_dataset)
export const REVENUE_METRIC_ID = "gmv_net_in_tc"; // metric "GMV Net in TC"

// How many top products to show, ranked by REVENUE_METRIC_ID descending.
export const TOP_N = 20;
