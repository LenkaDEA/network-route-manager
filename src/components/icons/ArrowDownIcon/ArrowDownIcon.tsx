import * as React from 'react'
import Icon, { type IconProps } from '../Icon';

const ArrowDownIcon: React.FC<IconProps> = ({ className, color, width = 24, height = 24, ...props }) => {

    return <Icon
        className={className}
        color={color}
        width={width}
        height={height}
        {...props}>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            stroke='none'
            d="M2.33563 8.74741L3.66436 7.25259L12 14.662L20.3356 7.25259L21.6644 8.74741L12 17.338L2.33563 8.74741Z"
        />
    </Icon>
}

export default ArrowDownIcon;
