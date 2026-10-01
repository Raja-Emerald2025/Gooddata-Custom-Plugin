// (C) 2021-2026 GoodData Corporation

import {
    type DashboardContext,
    DashboardPluginV1,
    type IDashboardCustomizer,
    type IDashboardEventHandling,
    newCustomWidget,
    newDashboardItem,
    newDashboardSection,
} from "@gooddata/sdk-ui-dashboard";

// this import will be renamed in plugin-toolkit
import { entryPoint } from "../dp_top_20_products_gallery_entry/index.js";
import { TopProductsGallery } from "./TopProductsGallery.js";

export class Plugin extends DashboardPluginV1 {
    public readonly author = entryPoint.author;
    public readonly displayName = entryPoint.displayName;
    public readonly version = entryPoint.version;
    public readonly minEngineVersion = entryPoint.minEngineVersion;
    public readonly maxEngineVersion = entryPoint.maxEngineVersion;
    public readonly compatibility = entryPoint.compatibility;

    public onPluginLoaded(_ctx: DashboardContext, _parameters?: string): Promise<void> | void {
        /*
         * This will be called when the plugin is loaded in context of some dashboard and before
         * the register() method.
         *
         * If the link between the dashboard and this plugin is parameterized, then all the parameters will
         * be included in the parameters string.
         *
         * The parameters are useful to modify plugin behavior in context of particular dashboard.
         *
         * Note: it is safe to delete this stub if your plugin does not need any specific initialization.
         */
    }

    public register(
        _ctx: DashboardContext,
        customize: IDashboardCustomizer,
        handlers: IDashboardEventHandling,
    ): void {
        customize.customWidgets().addCustomWidget("topProductsGallery", TopProductsGallery);
        customize.layout().customizeFluidLayout((_layout, customizer) => {
            customizer.addSection(
                0,
                newDashboardSection(
                    "Top 20 Products by Revenue",
                    newDashboardItem(newCustomWidget("topProductsGalleryWidget", "topProductsGallery"), {
                        xl: {
                            // full-width section so the card grid has room to lay out
                            gridWidth: 12,
                            // tall enough for ~4 rows of cards; adjust to taste once you see it render
                            gridHeight: 30,
                        },
                    }),
                ),
            );
        });
        handlers.addEventHandler("GDC.DASH/EVT.INITIALIZED", (evt) => {
            // oxlint-disable-next-line eslint-js/no-console
            console.log("### Dashboard initialized", evt);
        });
    }

    public onPluginUnload(_ctx: DashboardContext): Promise<void> | void {
        /*
         * This will be called when user navigates away from the dashboard enhanced by the plugin. At this point,
         * your code may do additional teardown and cleanup.
         *
         * Note: it is safe to delete this stub if your plugin does not need to do anything extra during unload.
         */
    }
}
