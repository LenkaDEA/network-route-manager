import { observer, useLocalObservable } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import RoutesStore from '../../stores/RoutesStore';
import type { NetRouteItemModel } from '../../stores/models';
import ArrowDownIcon from '../icons/ArrowDownIcon';
import styles from './Table.module.scss';

const TableRoutes: React.FC = () => {
  const routesStore = useLocalObservable(() => new RoutesStore());

  useEffect(() => {
    routesStore.getRoutes();
  }, [routesStore]);

  const handleSort = (field: keyof NetRouteItemModel) => {
    routesStore.setSort(field);
  };



  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th >
            <div className={styles.header}>
              Адрес назначения
              <ArrowDownIcon
                className={`${styles.header_icon} ${(routesStore.sortField === 'address' && routesStore.sortOrder === 'desc') ? styles.header_rotated : ''}`}
                onClick={() => handleSort('address')}
                color={(routesStore.sortOrder === 'none' || routesStore.sortField !== 'address') ? 'block' : ''}
              />
            </div>


          </th>
          <th>
            <div className={styles.header}>
              Шлюз
              <ArrowDownIcon
                className={`${styles.header_icon} ${(routesStore.sortField === 'gateway' && routesStore.sortOrder === 'desc') ? styles.header_rotated : ''}`}
                onClick={() => handleSort('gateway')}
                color={(routesStore.sortOrder === 'none' || routesStore.sortField !== 'gateway') ? 'block' : ''}
              />
            </div>

          </th>
          <th>
            <div className={styles.header}>
              Интерфейс
              <ArrowDownIcon
                className={`${styles.header_icon} ${(routesStore.sortField === 'interface' && routesStore.sortOrder === 'desc') ? styles.header_rotated : ''}`}
                onClick={() => handleSort('interface')}
                color={(routesStore.sortOrder === 'none' || routesStore.sortField !== 'interface') ? 'block' : ''}
              />
            </div>

          </th>
        </tr>
      </thead>
      <tbody>
        {routesStore.sortedData.map(item => (
          <tr key={item.uuid}>
            <td>{item.address}</td>
            <td>{item.gateway}</td>
            <td>{item.interface}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default observer(TableRoutes);
