import { action, computed, makeObservable, observable } from "mobx";
import type { ILocalStore } from "../LocalStore";
import { normalizeNetRoutes, type NetRouteItemModel, type NetRoutesApi, type NetRoutesModel } from "../models";

type PrivateFields = '_netRouts' | '_sortField' | '_sortOrder';

export default class RoutesStore implements ILocalStore {
  private _netRouts: NetRoutesModel = { data: [] };
  private _sortField: keyof NetRouteItemModel | null = null;
  private _sortOrder: 'asc' | 'desc' | 'none' = 'none';

  constructor() {
    makeObservable<RoutesStore, PrivateFields>(this, {
      _netRouts: observable.ref,
      _sortField: observable,
      _sortOrder: observable,
      netRouts: computed,
      sortedData: computed,
      sortOrder: computed,
      sortField: computed,
      getRoutes: action,
      setSort: action,
      reset: action
    })
  }

  get netRouts(): NetRoutesModel {
    return this._netRouts;
  }

  get sortOrder() {
    return this._sortOrder;
  }

  get sortField() {
    return this._sortField;
  }

  get sortedData(): NetRouteItemModel[] {
    if (!this._sortField || this._sortOrder === 'none') {
      return this.addmask(this._netRouts.data);
    }

    return this.addmask([...this._netRouts.data].sort((a, b) => {
      const aValue = a[this._sortField!];
      const bValue = b[this._sortField!];

      if (this._sortField === 'address' || this._sortField === 'gateway') {
        const numA = this.ipToNumber(aValue);
        const numB = this.ipToNumber(bValue);
        return this._sortOrder === 'asc' ? numA - numB : numB - numA;
      }

      if (aValue < bValue) return this._sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return this._sortOrder === 'asc' ? 1 : -1;
      return 0;
    }));
  }

  addmask(routes: NetRouteItemModel[]): NetRouteItemModel[] {

    routes.map((item) => {
      switch (item.mask) {
        case '0.0.0.0':
          !item.address.includes('/') && (item.address = item.address + '/0');
          break;
        case '255.255.255.0':
          !item.address.includes('/') && (item.address = item.address + '/24')
      }
    })
    return routes;
  }

  setSort(field: keyof NetRouteItemModel) {
    if (this._sortField === field) {
      this._sortOrder =
        this._sortOrder === 'none' ? 'asc' :
          this._sortOrder === 'asc' ? 'desc' : 'none';
    } else {
      this._sortField = field;
      this._sortOrder = 'asc';
    }
  }

  //в будущем асинхронная для получения данных с апишки
  getRoutes(): void {
    const ApiRoutes: NetRoutesApi = {
      data: [
        {
          uuid: '0',
          address: '0.0.0.0', //добаввлять /0 из мски
          mask: '0.0.0.0',
          gateway: '193.0.174.1',
          interface: 'Подключение Ethernet'
        },
        {
          uuid: '1',
          address: '10.1.30.0', //добаввлять /24 из мски
          mask: '255.255.255.0',
          gateway: '0.0.0.0',
          interface: 'Гостевая сеть'
        },
        {
          uuid: '2',
          address: '192.168.1.0', //добаввлять /24 из мски
          mask: '255.255.255.0',
          gateway: '0.0.0.0',
          interface: 'Домашняя сеть'
        },
        {
          uuid: '3',
          address: '192.168.10.146', //добаввлять /24 из мски
          mask: '255.255.255.0',
          gateway: '0.0.0.0',
          interface: 'Домашняя сеть'
        },
        {
          uuid: '4',
          address: '192.168.10.5', //добаввлять /24 из мски
          mask: '255.255.255.0',
          gateway: '0.0.0.0',
          interface: 'Домашняя сеть'
        },
      ]
    };

    this._netRouts = normalizeNetRoutes(ApiRoutes);
  };

  ipToNumber = (ip: string): number => {
    return ip.split('.')
      .reduce((acc, octet, index) => acc + parseInt(octet) * Math.pow(256, 3 - index), 0);
  };

  reset(): void {
    this._netRouts = { data: [] };
  }

  destroy(): void {
    this.reset();
  }

}