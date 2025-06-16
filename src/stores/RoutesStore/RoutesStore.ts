import { action, makeObservable, observable } from "mobx";
import type { ILocalStore } from "../LocalStore";
import { normalizeNetRoutes, type NetRoutesApi, type NetRoutesModel } from "../models";

type PrivateFields = '_netRouts';

export default class RoutesStore implements ILocalStore {

  private _netRouts: NetRoutesModel = { data: [] }

  constructor() {
    makeObservable<RoutesStore, PrivateFields>(this, {
      _netRouts: observable.ref,
      getRoutes: action,
      ipToNumber: action,
      sortIpsAscending: action,
      sortIpsDescending: action,
      reset: action
    })
  }

  get netRouts(): NetRoutesModel {
    return this._netRouts;
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

  sortIpsAscending = () => {
    return [...this._netRouts.data].sort((a, b) =>
      this.ipToNumber(a.address) - this.ipToNumber(b.address)
    );
  };

  sortIpsDescending = () => {
    return [...this._netRouts.data].sort((a, b) =>
      this.ipToNumber(b.address) - this.ipToNumber(a.address)
    );
  };

  reset(): void {
    this._netRouts = { data: [] };
  }

  destroy(): void {
    this.reset();
  }

}