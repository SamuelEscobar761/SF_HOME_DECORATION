interface SellItem {
    id: number;
    image: string;
    title: string;
    provider: string;
    colors: string[];
    extraColors: number;
    discount: number;
    previousPrice: number;
    price: number;
    checked: boolean;
  }