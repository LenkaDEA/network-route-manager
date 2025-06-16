//Нормализуем данные для удобной работы и надежности

export interface NetRouteItemApi {
    uuid: string,
    address: string,
    mask: string,
    gateway: string,
    interface: string
}

export interface NetRouteItemModel {
    uuid: string,
    address: string,
    mask: string,
    gateway: string,
    interface: string
}

export const normalizeNetRouteItem = (from: NetRouteItemApi): NetRouteItemModel => ({
    uuid: from.uuid,
    address: from.address,
    mask: from.mask,
    gateway: from.gateway,
    interface: from.interface
})