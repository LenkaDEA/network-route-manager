import { observer, useLocalObservable } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import RoutesStore from '../../stores/RoutesStore';

const TableRoutes: React.FC = () => {
  const [isSortIP, setIsSortIP] = useState<number>(0);

  const routesStore = useLocalObservable(() => new RoutesStore);
  // let viewRoutes: NetRoutesModel = { data: [] };

  useEffect(() => {
    routesStore.getRoutes();
  }, [routesStore])

  const sortIpsAscendingHandle = () => {
    setIsSortIP(prev => prev === 1 ? 2 : 1);
  };

  useEffect(() => {
    switch (isSortIP) {
      case 1:
        routesStore.sortIpsAscending();
        break;
      case 2:
        routesStore.sortIpsDescending();
        break;
      default:
        routesStore.netRouts.data;
        break;
    }
  }, [isSortIP])

  return (<>
    <table>
      <thead>
        <tr>
          <th>Адрес назначения
            <button onClick={sortIpsAscendingHandle}>Сорт.</button>
          </th>
          <th>Шлюз<button>Сорт.</button></th>
          <th>Интерфейс<button>Сорт.</button></th>
        </tr>
      </thead>
      <tbody>
        {
          routesStore.netRouts.data.map(item =>
            <tr key={item.uuid}>
              <td>{item.address}</td>
              <td>{item.gateway}</td>
              <td>{item.interface}</td>
            </tr>
          )
        }
      </tbody>
    </table>
  </>)
};

export default observer(TableRoutes);
