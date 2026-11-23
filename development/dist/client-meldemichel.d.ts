import { MapConfiguration } from '@polar/polar';
import { PolarMapInstance } from '@polar/polar';
import { subscribe } from '@polar/polar';

export declare const createMap: ({ containerId, mode, afmUrl, stadtwaldActive, reportServiceId, configOverride, }: MeldemichelCreateMapParams) => Promise<PolarMapInstance>;

declare const _default: {
    createMap: ({ containerId, mode, afmUrl, stadtwaldActive, reportServiceId, configOverride, }: MeldemichelCreateMapParams) => Promise<PolarMapInstance>;
    subscribe: typeof subscribe;
};
export default _default;

declare interface MeldemichelCreateMapParams {
    containerId: string;
    mode: keyof typeof MODE;
    afmUrl?: string;
    configOverride?: MapConfiguration;
    reportServiceId?: string;
    stadtwaldActive?: boolean;
}

declare const MODE: {
    /**
     * Display everything.
     */
    readonly COMPLETE: "COMPLETE";
    /**
     * Do not display AfmButton, reports, filter, list.
     */
    readonly REPORT: "REPORT";
    /**
     * Do not display AfmButton, reports, filter, list.
     * Do display a single (maybe movable) feature
     */
    readonly SINGLE: "SINGLE";
};

export { subscribe }

export { }



declare module 'i18next' {
	interface CustomTypeOptions {
		enableSelector: true
		resources: Omit<LocaleResources, 'gfi'> & {
			gfi: typeof gfiDe
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'external-meldemichel': typeof meldemichelPluginDe
		}
	}
}
