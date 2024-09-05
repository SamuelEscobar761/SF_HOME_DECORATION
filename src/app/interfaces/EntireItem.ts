type ImagesByColor = [string, string[]];
interface EntireItem {
    id: number,
    title: string,
    provider: string,
    discount: number,
    price: number,
    imagesByColors: ImagesByColor[],
}