# Top 20 Products Gallery — GoodData Dashboard Plugin

This project was scaffolded with GoodData's official `@gooddata/plugin-toolkit`, then customized with one
custom widget: **`TopProductsGallery`**, which renders the top 20 products (by Revenue) as an image-led
card grid on your dashboard — the thing Rich Text and Repeater couldn't quite do.

## Before you build: fill in your real field identifiers

Open [`src/dp_top_20_products_gallery/config.ts`](./src/dp_top_20_products_gallery/config.ts) and replace the
four placeholder identifiers with your workspace's real ones:

```ts
export const PRODUCT_NUMBER_ATTR_ID = "label.product.product_number"; // TODO
export const PRODUCT_NAME_ATTR_ID = "label.product.product_name"; // TODO
export const IMAGE_URL_ATTR_ID = "label.product.image_url"; // TODO
export const REVENUE_METRIC_ID = "gmv_net_in_tc"; // already known from the Rich Text setup
```

The easiest way to find the missing ones: run `npm run refresh-md` (after filling in `.env` /
`.env.secrets` — see below), then open the generated `src/md/full.ts` and search for each field by its
display name to copy its `identifier`.

Note: unlike the Repeater visualization, this widget renders its own `<img>` tag, so `IMAGE_URL_ATTR_ID`
does **not** need to be set up as an "Image"-type label in the Logical Data Model — a plain text label
holding the URL is enough.

## Known environment quirk already fixed here

The toolkit's generated `package.json` has two dependency conflicts that break a fresh install/build:
`typescript@7.0.2` clashes with `@typescript-eslint`'s peer range (install with `--legacy-peer-deps`), and
`ajv-keywords` needs `ajv@^8` but npm can hoist an older `ajv@6` and break the CSS build. Both are already
handled: use `--legacy-peer-deps` when installing, and this `package.json` already pins
`"overrides": { "ajv": "^8.20.0" }` to fix the second one. This was verified end-to-end in a real build —
`npm install --legacy-peer-deps` then `npm run build-plugin` — before this project was handed to you.

## Deploying with GitHub only — no local machine, no terminal

This repo includes three ready-made GitHub Actions workflows (in `.github/workflows/`) so the whole build →
host → register → link pipeline can be done by clicking buttons on github.com, with GitHub Pages as the
free HTTPS host. Nothing here needs Node.js, npm, or a terminal on your own computer.

1. **Create a new GitHub repository** (empty, no README) and upload every file in this project to it using
   GitHub's web UI: on the repo page, "Add file" → "Upload files", then drag the whole unzipped project
   folder in. (`node_modules`, `esm`, and `dist` aren't included in this zip — don't worry about them.)

2. **Turn on GitHub Pages**: repo → Settings → Pages → under "Build and deployment", set Source to
   **GitHub Actions**.

3. **Add your GoodData API token as a secret** (only needed for steps 5–6 below, not for building): repo →
   Settings → Secrets and variables → Actions → New repository secret → name it `TIGER_API_TOKEN`, paste
   your GoodData Cloud API token as the value. Nobody — including Claude — can read this back once saved;
   GitHub only shows it once, at creation.

4. **Find the field identifiers you still need to fill in**: `config.ts` currently has placeholders for
   Product Number, Product Name, and Image URL (Revenue is already set). The `npm run refresh-md` step that
   normally finds these needs a terminal, so instead: open your GoodData workspace's Logical Data Model (via
   its web UI) and look up each attribute's identifier there, or ask me and I can look them up another way
   if you share them. Edit `src/dp_top_20_products_gallery/config.ts` directly in GitHub's web-based file
   editor (click the pencil icon on the file) and commit the change — that commit alone triggers step 5
   below automatically.

5. **Build and deploy happens automatically on every commit** via the "Build plugin and deploy to GitHub
   Pages" workflow — watch it run under the repo's "Actions" tab. When it finishes, Settings → Pages shows
   your live URL, something like `https://<your-username>.github.io/<repo-name>/`.

6. **Allow that domain in GoodData's CSP** (this one does need your GoodData org admin login — unavoidable,
   it's an org-level security setting): in GoodData Cloud, go to Settings → Content Security Policy (CSP) →
   Manage → + Add, choose the `script-src` directive, and add your Pages domain, e.g.
   `https://your-username.github.io`.

7. **Register the plugin**: Actions tab → "Register plugin to GoodData workspace" → "Run workflow" → paste
   in the full URL to the built file, e.g. `https://your-username.github.io/your-repo/dp_top_20_products_gallery.mjs`.
   Open the finished run's log to find the printed plugin object id.

8. **Link it to your dashboard**: Actions tab → "Link plugin to dashboard" → "Run workflow" → paste in that
   plugin object id. Once this succeeds, open your actual GoodData dashboard — the Top 20 Products Gallery
   section should be there.

Steps 7 and 8 are one-time per plugin version; after that, re-running step 7/8 again (or linking the same
registered plugin to a different `DASHBOARD_ID` in `.env`) is how you'd reuse it on another dashboard later,
still with no terminal involved.

## Local/terminal path (alternative)

If you ever do want to preview changes live before committing (`npm start` against your real dashboard) or
run the CLI commands yourself, the full command-by-command version of this is below.

1. `npm install --legacy-peer-deps`
2. Fill in `.env` and `.env.secrets` with your GoodData Cloud hostname/workspace/token (see "Authentication
   & secrets" below)
3. `npm run refresh-md`, then fill in the real identifiers in `config.ts` as above
4. `npm start` and open `https://127.0.0.1:3001` — you should see your real dashboard with the new "Top 20
   Products by Revenue" section rendering live against your actual data
5. Once happy: `npm run build-plugin`, upload `esm/dashboardPlugin/` to HTTPS hosting, then
   `npm run add-plugin -- "<hosted-url>/dp_top_20_products_gallery.mjs"` and
   `npm run link-plugin -- <plugin-object-id>` to attach it to a real dashboard

---

# GoodData.UI Dashboard Plugin project

This is a one stop project to help you develop, test and build your own dashboard plugin. Before you start, we
encourage you to learn more about plugins in [our documentation](https://www.gooddata.com/docs/gooddata-ui/latest/).

In case you don't feel like reading the documentation at this point, go at least through the following quick introduction.

## Quick Introduction into Dashboard Plugins

Dashboard Plugins (plugins) allow developers to create extensions that alter behavior and look and feel of the
vanilla GoodData KPI Dashboards (dashboards).

Plugins are registered into the dashboard engine used to render a concrete dashboard. At the registration time the
plugin code can use several customization APIs to:

- deliver new custom widgets to render on the dashboard
- alter how particular insights are rendered; this in effect allows you to inject custom data visualizations of
  analytics computed by GoodData
- listen to events occurring on the dashboard

When developing your own plugin, you typically create custom React components and event handlers that interact with
the rendered dashboard using available APIs and then register those components and handlers using the customization APIs.

The infrastructure within this project allows you to develop and verify your new plugin against a live, existing dashboard
located on GoodData.CN.

Once you are happy with your new plugin you have to build it using scripts included in this project and then host
the built artifacts.

After that, you can register the plugin into one or more workspaces on GoodData.CN and
then use the plugin on any number of dashboards

_Note: GoodData currently does not provide hosting for your plugin artifacts._

## Plugin development guide

Building a new plugin is easy. Before you start, ensure that your `.env` and `.env.secrets` files are set up correctly.

0.  (Optional) Export catalog: `npm run refresh-md`

    To make referencing various metadata objects easier in your plugin, you can use the [Export catalog](https://www.gooddata.com/docs/gooddata-ui/latest/learn/visualize_data/export_catalog/) feature to get a easy-to-use list of the various MD objects in your workspace (insights, dashboards, attributes, etc.).
    For convenience, this was integrated to your plugin, just run `npm run refresh-md`.
    This will connect to the workspace specified in the `.env` file using the credentials from `.env.secrets`
    and populate the file `src/md/full.ts` with information about the metadata objects available in the specified workspace.
    See the [Export catalog](https://www.gooddata.com/docs/gooddata-ui/latest/learn/visualize_data/export_catalog/) documentation page for more information.

1.  Start the development server: `npm start`

    To verify everything works correctly, navigate to `https://127.0.0.1:3001`. You should see your existing
    dashboard with a new empty section added at the end. The section will be titled 'Added from a plugin'.

    Note: you can use `PORT` env variable to specify different port number.

2.  Develop your plugin code in `src/dp_top_20_products_gallery`

    The `src/dp_top_20_products_gallery/Plugin.tsx` is the main plugin file where you have to register all
    your custom content. However, you can create as many new files as you want under the `src/dp_top_20_products_gallery`
    directory. Just make sure to never place your custom code outside of this directory.

    Note: we recommend to write your plugin in TypeScript and to use a modern IDE. This way you can conveniently
    explore the plugin customization APIs from the comfort of your development environment.

3.  Build the plugin: `npm run build-plugin`

    This will build plugin artifacts under `esm/dashboardPlugin`.

4.  Upload plugin artifacts to your hosting

    It is paramount that you upload all files from the `esm/dashboardPlugin`.

    _IMPORTANT_:

    Set up hosting for your plugins.
    Update the Content Security Policy of your GoodData.CN installation’s gateway to enable loading plugins from the hosting location.
    [More info](https://www.gooddata.com/docs/gooddata-ui/latest/learn/integrate_and_authenticate/)

    _GOOD IDEA_: treat plugin builds immutably. Never overwrite an already uploaded plugin artifacts. Organize your hosting
    location so there is always unique directory that contains all plugin artifacts. This is a corner-stone of controlled,
    phased rollout of the plugin.

    _BAD IDEA_: overwriting existing plugin artifacts will immediately impact all dashboards that use the plugin, possibly
    breaking them if you did not have chance to fully test the plugin.

5.  Add plugin to one or more workspaces: `npm run add-plugin -- <url>`

    Once your plugin is uploaded to public hosting location, you can add it into your workspace. You can achieve this
    using the same CLI tool that you have used to create this plugin project. For convenience, this project contains
    the tool among the devDependencies together with convenience script to add plugin to either workspace specified
    in your `.env` file (default) or another workspace that you specify on the command line.

    Run the `npm run add-plugin -- "https://your.hosting/pluginDirOfYourChoice/dp_top_20_products_gallery.mjs"` to
    create a new dashboard plugin object in the workspace specified in the `.env` file. The created dashboard object
    point to the URL of the built plugin.

    After successful creation of the plugin object, the tool will print plugin object identifier. You will need this
    identifier later to link dashboard(s) with the plugin.

    Note: the CLI tool has options that allow you to add plugin to different backends and/or different workspaces. Check out
    `npm run gdc-plugins -- --help` to learn more about the tool's commands and options.

6.  Use plugin on a dashboard: `npm run link-plugin -- <plugin-object-id>`

    Now that you have created a plugin object in your workspace, you can link it with one or more dashboards. The
    `link-plugin` script in package.json is a shortcut to link plugin with dashboard specified in your `.env` file.

    If your plugin supports parameterization (see [src/dp_top_20_products_gallery](./src/dp_top_20_products_gallery/Plugin.tsx)) and
    you want to specify parameters for the link between dashboard the plugin, you can run `npm run link-plugin -- <plugin-object-id> --with-parameters`
    and the tool will open an editor for you to enter the parameters.

    Note: the CLI tool has options that allow you to link plugin to different backends and/or different workspaces. Check out
    `npm run gdc-plugins -- --help` to learn more about the tool's commands and options.

    _TIP_: you can use the `unlink` command to remove the link between dashboard and the plugin.

7.  Update plugin parameters on a dashboard: `npm run update-plugin-params -- <plugin-object-id>`

    This command is useful if you want to change or add the parameters in the already linked plugin. The tool will open an editor for you to enter the new parameters.

8.  Remove plugin parameters on a dashboard: `npm run remove-plugin-params -- <plugin-object-id>`

    This command is useful if you want to remove the parameters in the already linked plugin.

## Authentication & secrets

Your plugin does not have to concern itself with the authentication against GoodData backend. When the plugin runs
in context of GoodData Dashboards, it is the application that takes care of all the authentication and ensures
that the plugin executes in an authenticated environment.

The authentication credentials that are required to start the development harness included in this project are used
only during development because the harness needs to provide authenticated environment to the plugin as well.

In order to provide credentials to the development harness, you can use either the `.env.secrets` file or export the
necessary environment variables before starting the harness.

The contents of `.env.secrets` will never make their way into plugin build artifacts, they are loaded only when starting
the development harness. Check out the webpack.config.cjs if you would like to double-check this.

_IMPORTANT: Never include credentials and secrets in your plugin source code or other assets that your plugin requires.
All this data will be available in the publicly hosted plugin artifacts and can also be found through the browser developer console._

## FAQ

### What's up with the directories in src? Can I rename them?

Do not rename or otherwise refactor any of the directories that were created during this project initialization.
The structure and naming are essential for the build and the runtime loading of your plugin to work properly.

This project is setup so that all your custom code must be self-contained in the [src/dp_top_20_products_gallery](./src/dp_top_20_products_gallery) directory.

The [src/dp_top_20_products_gallery\_engine](./src/dp_top_20_products_gallery_engine) and [src/dp_top_20_products_gallery\_entry](./src/dp_top_20_products_gallery_entry) directories contain essential plugin boilerplate.
You should not modify these directories or their contents unless you are 100% sure what you are doing.

The [src/harness] directory contains code for plugin development harness; it is used only during plugin development and the
code in this directory will not be part of the plugin build. You can start the harness using `npm start`.
You should have no need to modify the code in the harness. We anticipate that at times you may need to tweak Analytical Backend setup
that is contained in the [src/harness/backend.ts](src/harness/backend.ts) - this is a safe change.

### How can I setup compatibility of the plugin?

You can edit the compatibility property in `src/dp_top_20_products_gallery\_entry/index`.
It is a standard SemVer string.
Usually you want to have ">=version" there, where version is the GoodData.UI version you developed and built the plugin with.

### How do plugin dependencies work?

Your plugin can depend on arbitrary third party packages at your discretion with one exception: the packages
specified as `peerDependencies` in this project's package.json. Packages that are listed as `peerDependencies`
will be _provided_ by the runtime environment.

### Can I modify webpack config?

This is generally not recommended and if needed should be approached by expert users only. In general, adding new
loaders and _extending_ the resolve section are the safer types of changes. However we strongly discourage making
modifications to other parts of the webpack config: changes to how the `dashboardPlugin` is built can break your
plugin and prevent it from loading correctly.

### How about Internet Explorer?

GoodData applications [do not support Internet Explorer](https://help.gooddata.com/pages/viewpage.action?pageId=86775029) as of November 19th 2021.
The plugin artifacts created during the plugin build are not compatible with Internet Explorer.

### How about Safari?

GoodData applications do support Safari, however currently it's not possible to run this boilerplate locally with GoodData.CN backend running on https protocol, due to the fact how Safari is handling authentication in backend redirects.
