/// <reference types="react" />
interface IconProps {
    source: 'AntDesign' | 'Entypo' | 'EvilIcons' | 'Feather' | 'FontAwesome' | 'Foundation' | 'Ionicons' | 'MaterialCommunityIcons' | 'MaterialIcons' | 'Octicons' | 'SimpleLineIcons' | 'Zocial';
    name: string;
    size?: number;
    color?: string;
    style?: any;
}
declare const _default: ({ source, name, size, color, style }: IconProps) => JSX.Element;
export default _default;
