// (C) 2026 GoodData Corporation

import { type ReactElement } from "react";

import { idRef, newAttribute, newMeasure, newRankingFilter } from "@gooddata/sdk-model";
import {
    type IDashboardWidgetProps,
    isCustomWidget,
    useCustomWidgetExecutionDataView,
} from "@gooddata/sdk-ui-dashboard";

import {
    IMAGE_URL_ATTR_ID,
    PRODUCT_NAME_ATTR_ID,
    PRODUCT_NUMBER_ATTR_ID,
    REVENUE_METRIC_ID,
    TOP_N,
} from "./config.js";

import "./TopProductsGallery.css";

/**
 * Custom dashboard widget: shows the top N products (by Revenue) as an image-led card gallery,
 * similar to a retail "deal of the day" grid.
 *
 * Automatically respects whatever dashboard filters are active (Seller, Transaction Date, etc.)
 * because it is executed through useCustomWidgetExecutionDataView, which is filter-context-aware.
 */
export function TopProductsGallery(props: IDashboardWidgetProps): ReactElement {
    const { widget, LoadingComponent, ErrorComponent } = props;
    const widgetIsUsable = isCustomWidget(widget);

    const productNumber = newAttribute(idRef(PRODUCT_NUMBER_ATTR_ID), (a) => a.alias("Product Number"));
    const productName = newAttribute(idRef(PRODUCT_NAME_ATTR_ID), (a) => a.alias("Product Name"));
    const imageUrl = newAttribute(idRef(IMAGE_URL_ATTR_ID), (a) => a.alias("Image URL"));
    const revenue = newMeasure(idRef(REVENUE_METRIC_ID), (m) => m.alias("Revenue"));

    const { result, status, error } = useCustomWidgetExecutionDataView({
        // Hook requires a real ICustomWidget; when this component is (mis)used outside that
        // context, `execution` is simply omitted below and the hook stays in a harmless
        // "pending" state instead of throwing.
        widget: widgetIsUsable ? widget : ({} as never),
        execution: widgetIsUsable
            ? {
                  seriesBy: [revenue],
                  slicesBy: [productNumber, productName, imageUrl],
                  filters: [newRankingFilter(revenue, "TOP", TOP_N)],
                  componentName: "TopProductsGallery",
              }
            : undefined,
    });

    if (!widgetIsUsable) {
        return (
            <div className="top-products-gallery__status">
                This widget can only be used as a custom dashboard widget.
            </div>
        );
    }

    if (status === "loading" || status === "pending") {
        return <LoadingComponent />;
    }

    if (status === "error") {
        return <ErrorComponent message="Could not load the top products." description={String(error?.message ?? error)} />;
    }

    const slices = result?.data().slices().toArray() ?? [];

    if (slices.length === 0) {
        return <div className="top-products-gallery__status">No products found for the current filters.</div>;
    }

    return (
        <div className="top-products-gallery">
            {slices.map((slice) => {
                const [productNumberTitle, productNameTitle, imageUrlTitle] = slice.sliceTitles();
                const revenuePoint = slice.dataPoints()[0];
                const revenueDisplay = revenuePoint?.formattedValue() ?? revenuePoint?.rawValue ?? "—";

                return (
                    <div className="top-products-gallery__card" key={slice.id}>
                        <div className="top-products-gallery__image-wrap">
                            {imageUrlTitle ? (
                                <img
                                    className="top-products-gallery__image"
                                    src={imageUrlTitle}
                                    alt={productNameTitle ?? productNumberTitle ?? "Product image"}
                                    loading="lazy"
                                />
                            ) : null}
                        </div>
                        <div className="top-products-gallery__name">{productNameTitle ?? "—"}</div>
                        <div className="top-products-gallery__number">({productNumberTitle ?? "—"})</div>
                        <div className="top-products-gallery__revenue">{String(revenueDisplay)}</div>
                    </div>
                );
            })}
        </div>
    );
}
