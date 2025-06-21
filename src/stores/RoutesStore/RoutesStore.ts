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
    const maskToCidr: Record<string, string> = {
      '0.0.0.0': '/0',
      '255.255.255.0': '/24',
      '255.255.255.128': '/25',
      '255.255.255.255': '/32'
    };

    routes.forEach(item => {
      if (!item.address.includes('/') && maskToCidr[item.mask]) {
        item.address += maskToCidr[item.mask];
      }
    });

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

  getRoutes(): void {
    const ApiRoutes: NetRoutesApi = {
      data: [
        {
          uuid: '0',
          address: '0.0.0.0',
          mask: '0.0.0.0',
          gateway: '193.0.174.1',
          interface: 'Подключение Ethernet'
        },
        {
          uuid: '1',
          address: '10.1.30.0',
          mask: '255.255.255.0',
          gateway: '0.0.0.0',
          interface: 'Гостевая сеть'
        },
        {
          uuid: '2',
          address: '192.168.1.0',
          mask: '255.255.255.0',
          gateway: '0.0.0.0',
          interface: 'Домашняя сеть'
        },
        {
          uuid: '3',
          address: '193.0.175.0',
          mask: '255.255.255.0',
          gateway: '0.0.0.0',
          interface: 'Подключение Ethernet'
        },
        {
          uuid: '4',
          address: '193.0.175.0',
          mask: '255.255.255.128',
          gateway: '193.0.175.10',
          interface: 'Подключение Ethernet'
        },
        {
          uuid: '5',
          address: '193.0.175.22',
          mask: '255.255.255.255',
          gateway: '193.0.175.1',
          interface: 'Подключение Ethernet'
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