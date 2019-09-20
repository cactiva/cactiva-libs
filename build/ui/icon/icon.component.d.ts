/// <reference types="react" />
interface IconProps {
    source: 'AntDesign' | 'Entypo' | 'EvilIcons' | 'Feather' | 'FontAwesome' | 'Foundation' | 'Ionicons' | 'MaterialCommunityIcons' | 'MaterialIcons' | 'Octicons' | 'SimpleLineIcons' | 'Zocial';
    name: string;
    size?: number;
    color?: string;
}
declare const _default: ({ source, name, size, color }: IconProps) => JSX.Element;
export default _default;
