# Migration from v1

`@polar/client-meldemichel` v2 is based on POLAR@3. For a complete list of changes, see the [changelog](./CHANGELOG.md).

## Node.js support

v2 now requires Node.js `^24.22.1` and npm `^11.19.1`.

This only affects installations via npm.

## Bundle files

This only affects users of the prebuilt bundle.

The `dist` folder contains chunks that `client-meldemichel.js` loads on demand. Host the complete folder instead of single files.

Styles are now part of `client-meldemichel.js`, so `style.css` is no longer shipped. `configOverride.stylePath` is ignored and can be removed.

## `$store` removed from the map instance

This only affects integrations that set or read the map state, e.g. in `REPORT` or `SINGLE` mode.

In v1, the map instance exposed a `$store`. In v2, the map state is accessed via the Meldemichel plugin store and `subscribe`, which the client exports.

```diff
- mapInstance.$store.dispatch('meldemichel/setMapState', payload)
+ mapInstance.store.getPluginStore('external-meldemichel').setMapState(payload)
```

```diff
- const unwatch = mapInstance.$store.watch(
-   (_, getters) => getters['meldemichel/mapState'],
-   callback
- )
+ import { subscribe } from '@polar/client-meldemichel' // or './client-meldemichel.js'
+
+ const unwatch = subscribe(mapInstance, 'external-meldemichel', 'mapState', callback)
```

`subscribe` calls `callback` immediately by default. Pass `{ immediate: false }` as the fifth argument to opt out.

## Wrapper element removed

This only affects integrations that style the `${containerId}-wrapper` element, e.g. when embedding `COMPLETE` mode.

In v1, `createMap` changed the container's id to `${containerId}-wrapper`. In v2, the container is replaced by a `polar-map` custom element that keeps the container's id.

```diff
- #meldemichel-map-client-wrapper {
+ #meldemichel-map-client {
    height: 400px;
  }
```
