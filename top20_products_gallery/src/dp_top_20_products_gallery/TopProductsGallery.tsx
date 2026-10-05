// (C) 2026 GoodData Corporation

import { type ReactElement } from "react";

import { useExecutionDataView } from "@gooddata/sdk-ui";
import { idRef, newAttribute, newMeasure, newMeasureSort, newRankingFilter } from "@gooddata/sdk-model";
import {
    type IDashboardWidgetProps,
    isCustomWidget,
    useWidgetFilters,
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
 * Dashboard filters (Seller, Transaction Date, etc.) are resolved with useWidgetFilters and merged
 * with a TOP N ranking filter. useCustomWidgetExecutionDataView cannot be used here because it
 * replaces any filters passed to it with the dashboard filters, which would drop the ranking filter.
 */
export function TopProductsGallery(props: IDashboardWidgetProps): ReactElement {
    const { widget, LoadingComponent, ErrorComponent } = props;
    const widgetIsUsable = isCustomWidget(widget);

    const productNumber = newAttribute(idRef(PRODUCT_NUMBER_ATTR_ID), (a) => a.alias("Product Number"));
    const productName = newAttribute(idRef(PRODUCT_NAME_ATTR_ID), (a) => a.alias("Product Name"));
    const imageUrl = newAttribute(idRef(IMAGE_URL_ATTR_ID), (a) => a.alias("Image URL"));
    const revenue = newMeasure(idRef(REVENUE_METRIC_ID, "measure"), (m) => m.alias("Revenue"));

    const filterTask = useWidgetFilters(widgetIsUsable ? widget : null);

    const { result, status, error } = useExecutionDataView({
        execution:
            widgetIsUsable && filterTask.status === "success" && filterTask.result
                ? {
                      seriesBy: [revenue],
                      slicesBy: [productNumber, productName, imageUrl],
                      filters: [...filterTask.result, newRankingFilter(revenue, "TOP", TOP_N)],
                      sortBy: [newMeasureSort(revenue, "desc")],
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

    if (filterTask.status === "error" || filterTask.status === "rejected") {
        return <ErrorComponent message="Could not load the dashboard filters." />;
    }

    if (filterTask.status !== "success" || status === "loading" || status === "pending") {
        return <LoadingComponent />;
    }

    if (status === "error") {
        return (
            <ErrorComponent
                message="Could not load the top products."
                description={String(error?.message ?? error)}
            />
        );
    }

    const slices = result?.data().slices().toArray() ?? [];

    if (slices.length === 0) {
        return <div className="top-products-gallery__status">No products found for the current filters.</div>;
    }

    return (
        <div className="top-products-gallery">
            {slices.slice(0, TOP_N).map((slice) => {
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
