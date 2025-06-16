import { normalizeNetRouteItem, type NetRouteItemApi, type NetRouteItemModel } from "./routeItem"

export interface NetRoutesApi {
    data: NetRouteItemApi[]
}

export interface NetRoutesModel {
    data: NetRouteItemModel[]
}

export const normalizeNetRoutes = (from: NetRoutesApi): NetRoutesModel => ({
    data: from.data.map(normalizeNetRouteItem)
})

