import * as React from 'react'
import classNames from 'classnames';

import styles from './Icon.module.scss';

export type IconProps = React.SVGAttributes<SVGElement> & {
    className?: string;
    color?: '' | 'block';
};

const Icon: React.FC<React.PropsWithChildren<IconProps>> = ({ className, color = '', children, width, height, ...props }) => {
    return <svg
        {...props}
        className={classNames(styles.icon,
            styles[`icon__color_${color}`],
            className)}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        {children}
    </svg>;
}

export default Icon;
